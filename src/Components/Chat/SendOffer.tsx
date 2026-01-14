import AddImage from 'components/AddImage';
import { Loader } from 'components/Common';
import { S3_URL } from 'constants/index';
import { AddUpdateOfferInterface } from 'constants/interfaces';
import {
	addUpdateOfferInitialValues,
	addUpdateOfferSchema,
} from 'constants/schemaValidations/chatSchema';
import { useFormik } from 'formik';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import ReactSelect, { MultiValue } from 'react-select';
import {
	useAddUpdateOfferMutation,
	useBucketUrlMutation,
	useCategoryListQuery,
	useCountryListQuery,
	useProfileListMutation,
	useTagListMutation,
	useUploadFileMutation,
} from 'services';
import useCommonStore from 'store/common';
import useSocketStore from 'store/socket';
import { isValidFileSize, isValidFileType } from 'utils';
import './styles.scss';

const SendOffer: React.FC = () => {
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const [filteredTags, setFilteredTags] = useState([]);
	const [isUploadingDoc, setIsUploadingDoc] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [walletAmount, setWalletAmount] = useState(0);

	const { mutateAsync: addUpdateOfferMutation } = useAddUpdateOfferMutation();
	const { mutateAsync: bucketUrlMutation } = useBucketUrlMutation();
	const { mutateAsync: uploadFileMutation } = useUploadFileMutation();
	const { mutateAsync: profileListMutation } = useProfileListMutation();

	const { data: categoryList = [] } = useCategoryListQuery();
	const { mutateAsync: tagListMutation } = useTagListMutation();
	const { data: countryList = [] } = useCountryListQuery();
	const { getChatHistory } = useSocketStore((state) => ({
		getChatHistory: state.getChatHistory,
	}));

	const prevCountryIdRef = useRef(null);
	const prevCategoryIdRef = useRef(null);

	const formik: any = useFormik({
		initialValues: {
			...addUpdateOfferInitialValues,
		},
		validate: (values) => {
			const errors: any = {};
			if (Number(values.price) > walletAmount) {
				errors.price = 'Insufficient balance. Please add more funds to proceed.';
			}
			return errors;
		},
		validationSchema: addUpdateOfferSchema,
		enableReinitialize: true,
		onSubmit: async (values) => {
			addUpdateOfferMutation({ ...values, receiverId: Number(modalConfig?.id) }).then(
				(res: any) => {
					if (res?.success) {
						toast.success(res?.message);
						modalConfig?.onClick();
						hideCommonModal();
					}
					getChatHistory(1, 20);
				},
			);
		},
	});

	const renderError = <T extends keyof AddUpdateOfferInterface>(field: T) =>
		formik.touched[field] && formik.errors[field] ? (
			<span className="text-danger f-error">{formik.errors[field] as ReactNode}</span>
		) : null;

	useEffect(() => {
		const currentCategoryId = formik.values.categoryId;
		if (currentCategoryId && prevCategoryIdRef.current !== currentCategoryId) {
			prevCategoryIdRef.current = currentCategoryId;
			handleCategorySelect(currentCategoryId);
		}
	}, [formik.values.categoryId]);

	useEffect(() => {
		profileListMutation().then((res: any) => {
			if (res?.success) {
				setWalletAmount(res?.data?.user?.walletAmount);
			}
		});
	}, []);

	const handleCategorySelect = (value: any) => {
		formik.setFieldValue('categoryId', value);
		tagListMutation(`?categoryId=${value}`).then((res: any) => {
			if (res?.success) {
				setFilteredTags(res?.data?.tag);
			}
		});
	};

	const handleTagSelect = (selectedTags: MultiValue<{ id: string; name: string }>) => {
		const selectedTagIds = selectedTags.map((tag) => tag.id);
		formik.setFieldValue('tagIds', selectedTagIds);
	};

	useEffect(() => {
		const currentCountryId = formik.values.countryId;
		if (currentCountryId && prevCountryIdRef.current !== currentCountryId) {
			prevCountryIdRef.current = currentCountryId;
			handleCountrySelect(currentCountryId);
		}
	}, [formik.values.countryId]);

	const handleCountrySelect = (value: any) => {
		formik.setFieldValue('countryId', value);
	};

	const updateImageData = (imgPath: any) => {
		const temp = formik.values.images;
		if (imgPath) {
			temp.push(imgPath);
		}
		formik.setFieldValue('images', temp);
	};

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsUploadingDoc(true);
		const file: any = event.target.files?.[0];
		if (file) {
			if (!isValidFileType(file) || !isValidFileSize(file)) {
				setIsUploadingDoc(false);
				return;
			}

			const response = await bucketUrlMutation(`?location=users&type=pdf&count=1`);
			if (response?.data?.length > 0) {
				const signurlData = response?.data[0];
				setIsUploadingDoc(true);
				if (file && signurlData) {
					const requestOptions = {
						method: 'PUT',
						headers: {
							'Content-Type': 'pdf',
						},
						body: file,
					};

					await uploadFileMutation({
						url: signurlData?.url,
						requestOptions,
					});
				}
				const temp = formik.values.documents;
				if (signurlData) {
					temp.push({ url: signurlData?.filename, name: file?.name });
				}
				formik.setFieldValue('documents', temp || []);
			}
		}
		setIsUploadingDoc(false);
	};

	return (
		<>
			<button onClick={() => hideCommonModal()} className="modal-close-btn border-0 p-0">
				<i className="ri-close-line"></i>
			</button>
			<Modal.Body>
				<h2 className="modal-title mb-30 ">Send Offer</h2>
				<Form
					className="auth-form"
					onSubmit={formik.handleSubmit}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							formik.handleSubmit();
							e.preventDefault();
						}
					}}
				>
					<Form.Group className="mb-4">
						<Form.Control
							type="text"
							name="title"
							placeholder="Project Title"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.title}
							className={renderError('title') ? 'border-red' : ''}
						/>
						{renderError('title')}
					</Form.Group>

					<Form.Group className="mb-4">
						<Form.Control
							type="text"
							name="budget"
							placeholder="Budget ($)"
							onChange={(e) => {
								const value = Number(e.target.value);
								if (value >= 0 || e.target.value === '') {
									formik.setFieldValue('price', e.target.value);
									if (value > walletAmount) {
										formik.setFieldError(
											'price',
											`Amount exceeds wallet balance ($${walletAmount})`,
										);
									} else {
										formik.setFieldError('price', undefined);
									}
								}
							}}
							maxLength={11}
							onBlur={formik.handleBlur}
							value={formik.values.price}
							className={renderError('price') ? 'border-red' : ''}
						/>
						{renderError('price')}
					</Form.Group>

					<Form.Group className="mb-4">
						<ReactSelect
							className={`form-react-select ${renderError('categoryId') ? 'border-red' : ''}`}
							classNamePrefix="form-react-select"
							isSearchable
							placeholder="Category"
							name="categoryId"
							autoFocus={false}
							options={categoryList?.category || []}
							getOptionLabel={(option: any) => option?.title}
							getOptionValue={(option: any) => option?.id}
							onChange={(value) => handleCategorySelect(value?.id)}
							value={categoryList?.category?.find(
								(item: any) => item.id === formik.values.categoryId,
							)}
							onBlur={formik.handleBlur}
						/>
						{renderError('categoryId')}
					</Form.Group>

					<Form.Group className="mb-4">
						<ReactSelect
							className={`form-react-select ${renderError('tagIds') ? 'border-red' : ''}`}
							classNamePrefix="form-react-select"
							isSearchable
							isMulti
							placeholder="Tags"
							name="tagIds"
							autoFocus={false}
							options={filteredTags || []}
							getOptionLabel={(option: any) => option?.name}
							getOptionValue={(option: any) => option?.id}
							onChange={handleTagSelect}
							value={filteredTags.filter((tag: any) => formik.values.tagIds.includes(tag?.id))}
							onBlur={formik.handleBlur}
						/>
						{renderError('tagIds')}
					</Form.Group>

					<Form.Group className="mb-4">
						<Form.Control
							as="textarea"
							rows={6}
							placeholder="Description"
							name="description"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.description}
							maxLength={251}
							className={renderError('description') ? 'border-red' : ''}
						/>
						{renderError('description')}
					</Form.Group>

					<Form.Group className="mb-4 position-relative resume-input">
						<div className={`form-control ${renderError('documents') ? 'border-red' : ''}`}>
							{formik?.values?.documents?.length > 0
								? `${formik?.values?.documents?.length} Attachment`
								: 'Upload Documents'}
							{isUploadingDoc ? (
								<Loader />
							) : (
								<i className="ri-attachment-line" style={{ float: 'right', zIndex: 1 }}></i>
							)}
						</div>
						<Form.Control
							type="file"
							multiple
							name="documents"
							accept=".pdf, .doc, .docx"
							onChange={handleFileChange}
							className={renderError('documents') ? 'border-red' : ''}
						/>
						{renderError('documents')}
					</Form.Group>

					{formik?.values?.documents?.length > 0 ? (
						<div className="d-flex align-items-center gap-2 mb-4 flex-wrap">
							{formik.values.documents.map((file: any, index: any) => {
								const shortenedFileName = file?.name?.slice(0, 5);
								const removeFile = () => {
									const updatedDocuments = formik.values.documents.filter(
										(_: any, fileIndex: number) => fileIndex !== index,
									);
									formik.setFieldValue('documents', updatedDocuments);
								};
								return (
									<div key={index} className="uploaded-file-item d-flex gap-1 position-relative">
										<i className="ri-file-line"></i>
										{shortenedFileName}
										<button
											className=" border-0 p-0 uploaded-file-item-close-btn"
											onClick={removeFile}
											type="button"
										>
											<i className="ri-close-fill"></i>
										</button>
									</div>
								);
							})}
						</div>
					) : null}

					<Form.Group className="mb-4 position-relative resume-input">
						<div className={`form-control ${renderError('images') ? 'border-red' : ''}`}>
							{formik?.values?.images?.length > 0
								? `${formik?.values?.images?.length} Attachment`
								: 'Upload Images'}
							{isUploading ? (
								<Loader />
							) : (
								<i className="ri-folder-image-line" style={{ float: 'right' }}></i>
							)}
						</div>

						<AddImage
							updateImageData={updateImageData}
							setIsUploading={setIsUploading}
							isMultiple={false}
						/>
						{renderError('images')}
					</Form.Group>

					{formik?.values?.images?.length > 0 ? (
						<div className="d-flex align-items-center gap-2 mb-4 flex-wrap">
							{formik.values.images.map((file: any, index: any) => {
								const handleRemoveImage = (index: number) => {
									const updatedImages = formik.values.images.filter(
										(_: any, i: any) => i !== index,
									);
									formik.setFieldValue('images', updatedImages);
								};

								return (
									<div key={index} className="uploaded-file-item d-flex gap-1 position-relative">
										<img
											src={`${S3_URL + file}`}
											alt=""
											className="uploaded-file-item-preview-img"
										/>
										<button
											type="button"
											onClick={() => handleRemoveImage(index)}
											className=" border-0 p-0 uploaded-file-item-close-btn"
										>
											<i className="ri-close-line"></i>
										</button>
									</div>
								);
							})}
						</div>
					) : null}

					<Form.Group className="mb-4">
						<ReactSelect
							className={`form-react-select ${renderError('countryId') ? 'border-red' : ''}`}
							classNamePrefix="form-react-select"
							isSearchable
							placeholder="Country"
							name="countryId"
							autoFocus={false}
							options={countryList?.country || []}
							getOptionLabel={(option: any) => option?.countryName}
							getOptionValue={(option: any) => option?.id}
							onChange={(value: any) => handleCountrySelect(value?.id)}
							value={countryList?.country?.find((item: any) => item.id === formik.values.countryId)}
							onBlur={formik.handleBlur}
						/>
						{renderError('countryId')}
					</Form.Group>

					<div className="d-flex gap-3 justify-content-center mt-4">
						<button className="primary-btn" onClick={() => hideCommonModal()}>
							Cancel
						</button>
						<button className="secondary-btn" type="submit">
							Send
						</button>
					</div>
				</Form>
			</Modal.Body>
		</>
	);
};

export default SendOffer;
