import { Loader } from 'components';
import { EditOtherDetailsInterface } from 'constants/interfaces';
import { editOtherDetailsInitialValues, editOtherDetailsSchema } from 'constants/schemaValidations';
import { useFormik } from 'formik';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ReactSelect, { MultiValue } from 'react-select';
import {
	useBucketUrlMutation,
	useCategoryListQuery,
	usePriceRangeMutation,
	useProfileMutation,
	useResponseListQuery,
	useTagListMutation,
	useUploadFileMutation,
} from 'services';
import useAuthStore from 'store/auth';
import { handleFileChange } from 'utils';
import './styles.scss';

const EditOtherDetails: React.FC = () => {
	const Genders = [
		{
			key: 'MALE',
			value: 'Male',
		},
		{
			key: 'FEMALE',
			value: 'Female',
		},
		{
			key: 'OTHER',
			value: 'Other',
		},
	];
	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const prevCategoryIdRef = useRef(null);
	const [isUploading, setIsUploading] = useState(false);
	const { mutateAsync: bucketUrlMutation } = useBucketUrlMutation();
	const { mutateAsync: uploadFileMutation } = useUploadFileMutation();

	const [filteredTags, setFilteredTags] = useState([]);
	const [priceRangeList, setPriceRangeList] = useState<any>([]);
	const [responseTimeList, setResponseTimeList] = useState<any>([]);
	const { mutateAsync: usePriceRangeList } = usePriceRangeMutation();
	const { data: categoryList = [] } = useCategoryListQuery();
	const { data: responseList = [] } = useResponseListQuery();
	const { mutateAsync: tagListMutation } = useTagListMutation();
	const { mutateAsync: profileMutation } = useProfileMutation();
	const navigate = useNavigate();
	const getGenderValue = (str: any) => {
		return str?.toLowerCase().replace(/\b\w/g, function (char: any) {
			return char.toUpperCase();
		});
	};
	const payload = {
		dob: user?.dob ?? null,
		gender: getGenderValue(user?.gender) ?? '',
		priceRange: user?.priceRange ?? '',
		categoryId: user?.category?.id ?? '',
		tagId: user?.tags?.map((tag: any) => tag?.tag_id) ?? [],
		resume: user?.resume ?? '',
		resumeName: user?.resumeName ?? '',
		responseTime: user?.responseTime ?? '',
	};

	const formik: any = useFormik({
		initialValues: { ...editOtherDetailsInitialValues, ...payload },
		enableReinitialize: true,
		validationSchema: editOtherDetailsSchema,
		onSubmit: async (values) => {
			profileMutation({ ...values }).then((res: any) => {
				if (res?.success) {
					toast.success(res?.message);
					navigate(`/my-account`);
				}
			});
		},
	});

	useEffect(() => {
		const currentCategoryId = formik.values.categoryId;
		if (currentCategoryId && prevCategoryIdRef.current !== currentCategoryId) {
			prevCategoryIdRef.current = currentCategoryId;
			handleCategorySelect(currentCategoryId);
		}
	}, [formik.values.categoryId]);

	useEffect(() => {
		usePriceRangeList().then((res: any) => {
			if (res?.success) {
				setPriceRangeList(res?.data?.priceRangeData);
			}
		});
	}, []);

	useEffect(() => {
		if (responseList?.responseTimeData) {
			setResponseTimeList(responseList.responseTimeData);
		}
	}, [responseList]);

	const handleCategorySelect = (value: any) => {
		formik.setFieldValue('categoryId', value);
		tagListMutation(`?categoryId=${value}`).then((res: any) => {
			if (res?.success) {
				setFilteredTags(res?.data?.tag);
			}
		});
	};

	const handleTagSelect = (selectedTags: MultiValue<{ id: string; name: string }>) => {
		const selectedTagIds = selectedTags.map((tag: any) => tag?.id);
		formik.setFieldValue('tagId', selectedTagIds);
	};

	const renderError = <T extends keyof EditOtherDetailsInterface>(field: T) =>
		formik.touched[field] && formik.errors[field] ? (
			<span className="text-danger f-error">{formik.errors[field] as ReactNode}</span>
		) : null;

	return (
		<div className="profile-section d-flex flex-column">
			<h4 className="profile-section-title mb-0" onClick={() => navigate(-1)}>
				<span className="back-arrow">
					<i className="ri-arrow-left-line"></i>
				</span>{' '}
				Edit Other Details
			</h4>
			<Form onSubmit={formik.handleSubmit}>
				<Row>
					<Col lg={6}>
						<Form.Group className="mb-4">
							<Form.Label>DOB</Form.Label>
							<DatePicker
								selected={formik.values.dob}
								name="dob"
								showFullMonthYearPicker
								showMonthDropdown
								showIcon
								showPopperArrow
								showYearDropdown
								placeholderText="Date of Birth"
								onBlur={formik.handleBlur}
								dateFormat="yyyy-MM-dd"
								toggleCalendarOnIconClick
								onChange={(date: any) =>
									formik.setFieldValue('dob', date?.toISOString()?.split('T')[0])
								}
								className={`form-control w-100 ${renderError('dob') ? 'border-red' : ''}`}
								maxDate={new Date()}
								onKeyDown={(e) => e.preventDefault()}
							/>

							{renderError('dob')}
						</Form.Group>
					</Col>
					<Col lg={6}>
						<Form.Group className="mb-4">
							<Form.Label>Gender</Form.Label>
							<ReactSelect
								className={`form-react-select ${renderError('gender') ? 'border-red' : ''}`}
								classNamePrefix="form-react-select"
								isSearchable
								placeholder="Gender"
								name="gender"
								options={Genders}
								getOptionLabel={(option) => option.value}
								getOptionValue={(option) => option.key}
								value={
									Genders.find(
										(option) => option.key.toLowerCase() === formik.values.gender.toLowerCase(),
									) || null
								}
								onChange={(selectedOption) =>
									formik.setFieldValue('gender', selectedOption?.key ?? '')
								}
								onBlur={formik.handleBlur}
							/>
							{renderError('gender')}
						</Form.Group>
					</Col>

					<Col lg={6}>
						<Form.Group className="mb-4">
							<Form.Label>Price Range</Form.Label>
							<ReactSelect
								className={`form-react-select ${formik.errors.priceRange ? 'border-red' : ''}`}
								classNamePrefix="form-react-select"
								isSearchable
								placeholder="Price Range"
								name="priceRange"
								options={priceRangeList ?? []}
								getOptionLabel={(option: any) => `$${option?.minMaxVal.replace(/-/g, '-$')}`}
								getOptionValue={(option: any) => option?.minMaxVal}
								value={priceRangeList?.find(
									(item: any) => item.minMaxVal === formik.values.priceRange,
								)}
								onChange={(selectedOption: any) => {
									formik.setFieldValue('priceRange', selectedOption?.minMaxVal ?? '');
								}}
								onBlur={formik.handleBlur}
							/>
							{renderError('priceRange')}
						</Form.Group>
					</Col>
					<Col lg={6}>
						<Form.Group className="mb-4">
							<Form.Label>Category</Form.Label>
							<ReactSelect
								className={`form-react-select`}
								classNamePrefix="form-react-select"
								isSearchable
								placeholder="Design"
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
							<Form.Label>Tags</Form.Label>
							<ReactSelect
								className={`form-react-select ${renderError('tagId') ? 'border-red' : ''}`}
								classNamePrefix="form-react-select"
								isSearchable
								isMulti
								placeholder="Tags"
								name="tagId"
								autoFocus={false}
								options={filteredTags || []}
								getOptionLabel={(option: any) => option?.name}
								getOptionValue={(option: any) => option?.id}
								onChange={handleTagSelect}
								value={filteredTags.filter((tag: any) => formik.values.tagId.includes(tag?.id))}
								onBlur={formik.handleBlur}
							/>
							{renderError('tagId')}
						</Form.Group>
					</Col>
					<Col lg={6}>
						<Form.Group className="mb-20 position-relative resume-input">
							<Form.Label>Resume</Form.Label>
							<div className="form-control ">
								{formik?.values?.resumeName ?? 'Resume'}
								{isUploading ? (
									<Loader style={{ float: 'right' }} />
								) : (
									<i className="ri-attachment-line" style={{ float: 'right' }}></i>
								)}
							</div>
							<Form.Control
								type="file"
								placeholder="Resume"
								className="rounded-pill"
								name="resume"
								accept=".pdf, .doc, .docx"
								onChange={(event) =>
									handleFileChange(
										event,
										setIsUploading,
										formik,
										bucketUrlMutation,
										uploadFileMutation,
									)
								}
								onBlur={formik.handleBlur}
							/>
							{renderError('resume')}
						</Form.Group>
					</Col>
					<Col lg={6}>
						<Form.Group className="mb-4">
							<Form.Label>Response Time</Form.Label>
							<ReactSelect
								className={`form-react-select ${renderError('responseTime') ? 'border-red' : ''}`}
								classNamePrefix="form-react-select"
								isSearchable
								placeholder="Response Time"
								name="responseTime"
								options={responseTimeList.map((item: any) => ({
									value: item.time,
									label: `${item.time} Hour${item.time > 1 ? 's' : ''}`,
								}))}
								value={
									responseTimeList
										.map((item: any) => ({
											value: item.time,
											label: `${item.time} Hour${item.time > 1 ? 's' : ''}`,
										}))
										.find((option: any) => option.value === formik.values.responseTime) ?? null
								}
								onChange={(selectedOption: any) => {
									formik.setFieldValue('responseTime', selectedOption?.value ?? '');
								}}
								onBlur={formik.handleBlur}
							/>
							{renderError('responseTime')}
						</Form.Group>
					</Col>
				</Row>
				<button className="secondary-btn" type="submit">
					Update
				</button>
			</Form>
		</div>
	);
};

export default EditOtherDetails;
