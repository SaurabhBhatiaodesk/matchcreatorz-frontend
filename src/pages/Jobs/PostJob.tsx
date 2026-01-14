import { AddImage, Loader } from 'components';
import { postJobInitialValues, PostJobInterface, postJobSchema } from 'constants/index';
import { useFormik } from 'formik';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactSelect, { MultiValue } from 'react-select';
import {
	useBucketUrlMutation,
	useCategoryListQuery,
	useCountryListQuery,
	usePostJobMutation,
	useProfileListQuery,
	useTagListMutation,
	useUploadFileMutation,
} from 'services';
import useAuthStore from 'store/auth';
import { setModalConfig } from 'store/common';
import { isValidFileSize, isValidFileType } from 'utils';
import * as Yup from 'yup';

const PostJob: React.FC = () => {
	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const navigate = useNavigate();
	const location = useLocation();
	const jobData = location.state || {};
	const [filteredTags, setFilteredTags] = useState([]);
	const [isUploading, setIsUploading] = useState(false);
	const [isUploadingDoc, setIsUploadingDoc] = useState(false);
	const { mutateAsync: bucketUrlMutation } = useBucketUrlMutation();
	const { mutateAsync: uploadFileMutation } = useUploadFileMutation();
	const { mutateAsync: postJobMutation } = usePostJobMutation();
	const { data: priceRangeList = [] } = useProfileListQuery();
	const { data: categoryList = [] } = useCategoryListQuery();
	const { mutateAsync: tagListMutation } = useTagListMutation();
	const { data: countryList = [] } = useCountryListQuery();

	const prevCountryIdRef = useRef(null);
	const prevCategoryIdRef = useRef(null);

	const payload = {
		title: jobData?.title ?? '',
		price: jobData?.price ?? '',
		priceRange: jobData?.priceRange ?? '',
		categoryId: jobData?.categoryId ?? '',
		tagIds: jobData?.tags?.map((tag: any) => tag?.id) ?? [],
		description: jobData?.description ?? '',
		countryId: jobData?.countryId ?? '',
		documents: jobData?.documents ?? [],
		images: jobData?.images?.map((image: any) => image?.url) ?? [],
	};

	const priceSchema = Yup.object().shape({
		price: Yup.number()
			.required('Please enter an amount.')
			.min(1, 'The amount must be at least 1.')
			.max(9999999999, 'The amount cannot exceed 10 digits.')
			.positive('The amount must be greater than 0.')
			.typeError('Please enter a valid number.'),
	});

	const priceRangeSchema = Yup.object().shape({
		priceRange: Yup.string().required('Price Range is required'),
	});

	const combinedSchema =
		user.type === 'BUYER'
			? postJobSchema.concat(priceRangeSchema)
			: postJobSchema.concat(priceSchema);

	const formik: any = useFormik({
		initialValues: {
			...postJobInitialValues,
			...payload,
		},
		validationSchema: combinedSchema,
		enableReinitialize: true,
		onSubmit: async (values, { setErrors, resetForm }) => {
			if (user.type === 'BUYER') {
				if (!values.priceRange) {
					setErrors({ priceRange: 'Please provide a Price Range.' }); // More engaging
					return;
				}
				if (values.price) {
					setErrors({ price: 'Price should not be specified for a Buyer.' }); // Clearer context
					return;
				}
				delete values.price;
			} else if (user.type === 'SELLER') {
				if (!values.price) {
					setErrors({ price: 'Please enter a Price.' }); // More engaging
					return;
				}
				if (values.priceRange) {
					setErrors({ priceRange: 'Price Range should not be specified for a Seller.' }); // Clearer context
					return;
				}
				delete values.priceRange;
			}

			const newValues = jobData?.id ? { id: jobData?.id, ...values } : { ...values };
			postJobMutation({
				...newValues,
			}).then((res: any) => {
				if (res?.success) {
					toast.success(res?.message);
					resetForm();
					navigate(-1);
				}
			});
		},
	});

	const renderError = <T extends keyof PostJobInterface>(field: T) =>
		formik.touched[field] && formik.errors[field] ? (
			<span className="text-danger f-error">{formik.errors[field] as ReactNode}</span>
		) : null;

	const handlePriceRangeSelect = (value: string) =>
		priceRangeList?.priceRangeData?.find((option: any) => option.minMaxVal === value) ?? null;

	useEffect(() => {
		const currentCategoryId = formik.values.categoryId;
		if (currentCategoryId && prevCategoryIdRef.current !== currentCategoryId) {
			prevCategoryIdRef.current = currentCategoryId;
			handleCategorySelect(currentCategoryId);
		}
	}, [formik.values.categoryId]);

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
		const temp = formik?.values?.images ?? [];
		if (imgPath) {
			temp.push(imgPath);
		}
		formik.setFieldValue('images', temp);
	};

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldError('documents', undefined);
		setIsUploadingDoc(true);
		const file: any = event.target.files?.[0];
		if (file) {
			if (!isValidFileType(file) || !isValidFileSize(file)) {
				setIsUploadingDoc(false);
				return;
			}
			const response = await bucketUrlMutation(`?location=users&type=pdf&count=1`);
			if (response?.data?.length > 0) {
				const preSignedUrlData = response?.data[0];
				setIsUploadingDoc(true);
				if (file && preSignedUrlData) {
					const requestOptions = {
						method: 'PUT',
						headers: {
							'Content-Type': 'pdf',
						},
						body: file,
					};

					await uploadFileMutation({
						url: preSignedUrlData?.url,
						requestOptions,
					});
				}
				const temp = formik.values.documents;
				if (preSignedUrlData) {
					temp.push({ url: preSignedUrlData?.filename, name: file?.name });
				}
				formik.setFieldValue('documents', temp ?? []);
			}
		}
		setIsUploadingDoc(false);
	};

	const handleDelete = (data: any, type: string) => {
		if (type === 'doc') {
			formik.setFieldValue('documents', data ?? []);
			formik.setFieldError('documents', undefined);
			formik.setErrors({});
		} else {
			formik.setFieldValue('images', data ?? []);
			formik.setFieldError('images', undefined);
			formik.setErrors({});
		}
	};

	const handleView = (type: string) => {
		setModalConfig({
			visible: true,
			id: null,
			type: 'viewDoc',
			data: {
				file: type === 'doc' ? formik?.values?.documents : formik?.values?.images,
				dataType: type,
			},
			onClick: handleDelete,
		});
	};

	return (
		<div className="profile-section d-flex flex-column">
			<h4 className="main-subtitle mb-0">
				<span className="back-arrow" onClick={() => navigate(-1)}>
					<i className="ri-arrow-left-line"></i>
				</span>{' '}
				{user.type === 'BUYER' ? 'Post a Job' : 'Post a Service'}
			</h4>
			<Form onSubmit={formik.handleSubmit}>
				<Row>
					<Col lg={6}>
						<Form.Group className="mb-4">
							<Form.Control
								type="text"
								name="title"
								placeholder="Job Title"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.title}
								className={renderError('title') ? 'border-red' : ''}
							/>
							{renderError('title')}
						</Form.Group>
					</Col>
					<Col lg={6}>
						<Form.Group className="mb-4">
							{user.type === 'BUYER' ? (
								<>
									<ReactSelect
										className={`form-react-select ${renderError('priceRange') ? 'border-red' : ''}`}
										classNamePrefix="form-react-select"
										isSearchable
										placeholder="Price Range ($)"
										name="priceRange"
										options={priceRangeList?.priceRangeData ?? []}
										getOptionLabel={(option: any) => `$${option?.minMaxVal.replace(/-/g, '-$')}`}
										getOptionValue={(option) => option.minMaxVal}
										onChange={(option) =>
											formik.setFieldValue('priceRange', option?.minMaxVal ?? '')
										}
										value={handlePriceRangeSelect(formik.values.priceRange)}
										onBlur={formik.handleBlur}
									/>
									{renderError('priceRange')}
								</>
							) : (
								<>
									<Form.Control
										className={renderError('price') ? 'border-red' : ''}
										type="text"
										name="price"
										placeholder="Amount ($)"
										maxLength={11}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.price}
									/>
									{renderError('price')}
								</>
							)}
						</Form.Group>
					</Col>
					<Col lg={6}>
						<Form.Group className="mb-4">
							<ReactSelect
								className={`form-react-select ${renderError('categoryId') ? 'border-red' : ''}`}
								classNamePrefix="form-react-select"
								isSearchable
								placeholder="Category"
								name="categoryId"
								autoFocus={false}
								options={categoryList?.category ?? []}
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
					</Col>
					<Col lg={6}>
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
					</Col>
					<Col lg={12}>
						<Form.Group className="mb-4">
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Description"
								name="description"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.description}
								className={renderError('description') ? 'border-red' : ''}
							/>
							{renderError('description')}
						</Form.Group>
					</Col>
					<Col lg={6}>
						<Form.Group className="mb-4">
							<ReactSelect
								className={`form-react-select ${renderError('countryId') ? 'border-red' : ''}`}
								classNamePrefix="form-react-select"
								isSearchable
								placeholder="Country"
								name="countryId"
								autoFocus={false}
								options={countryList?.country ?? []}
								getOptionLabel={(option: any) => option?.countryName}
								getOptionValue={(option: any) => option?.id}
								onChange={(value: any) => handleCountrySelect(value?.id)}
								value={countryList?.country?.find(
									(item: any) => item.id === formik.values.countryId,
								)}
								onBlur={formik.handleBlur}
							/>
							{renderError('countryId')}
						</Form.Group>
					</Col>
					<Col lg={6}>
						<Form.Group className="mb-4 position-relative resume-input">
							<div className={`form-control ${renderError('documents') ? 'border-red' : ''}`}>
								{formik?.values?.documents?.length > 0
									? `${formik?.values?.documents?.length} Attachment`
									: 'Upload Documents'}

								{isUploadingDoc ? (
									<Loader />
								) : (
									<>
										<i className="ri-attachment-line" style={{ float: 'right', zIndex: 1 }}></i>
										{formik?.values?.documents?.length > 0 && (
											<i
												className="ri-eye-fill"
												role="button"
												onClick={() => handleView('doc')}
												style={{ float: 'right', position: 'absolute', right: '3rem', zIndex: 2 }}
											></i>
										)}
									</>
								)}
							</div>
							<Form.Control
								type="file"
								multiple={false}
								className={`rounded-pill`}
								name="documents"
								accept=".pdf"
								onChange={handleFileChange}
								onFocus={() => formik.setFieldError('documents', undefined)}
							/>
							{renderError('documents')}
						</Form.Group>
					</Col>
					<Col lg={6}>
						<Form.Group className="mb-4 position-relative resume-input">
							<div className={`form-control ${renderError('images') ? 'border-red' : ''}`}>
								{formik?.values?.images?.length > 0
									? `${formik?.values?.images?.length} Attachment`
									: 'Upload Images'}
								{isUploading ? (
									<Loader />
								) : (
									<>
										{formik?.values?.images?.length > 0 && (
											<i
												className="ri-eye-fill"
												role="button"
												onClick={() => handleView('images')}
												style={{ float: 'right', position: 'absolute', right: '3rem', zIndex: 2 }}
											></i>
										)}
										<i className="ri-folder-image-line" style={{ float: 'right' }}></i>
									</>
								)}
							</div>

							<AddImage
								updateImageData={updateImageData}
								setIsUploading={setIsUploading}
								isMultiple={false}
							/>
							{renderError('images')}
						</Form.Group>
					</Col>
				</Row>
				<Row>
					{payload?.title ? (
						<Col lg={3}>
							<button
								className="primary-btn w-100 mw-100"
								type="reset"
								onClick={() => navigate(-1)}
							>
								Discard
							</button>
						</Col>
					) : (
						<Col lg={3}>
							<button
								className="primary-btn w-100 mw-100"
								type="reset"
								onClick={() => formik.handleReset()}
							>
								Discard
							</button>
						</Col>
					)}
					<Col lg={3}>
						<button className="secondary-btn w-100 mw-100" type="submit">
							Post
						</button>
					</Col>
				</Row>
			</Form>
		</div>
	);
};

export default PostJob;
