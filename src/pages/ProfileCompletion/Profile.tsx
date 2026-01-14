import { Loader } from 'components';
import { ProfileInterface } from 'constants/interfaces';
import { profileInitialValues, profileSchema } from 'constants/schemaValidations';
import { useFormik } from 'formik';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ReactSelect, { MultiValue } from 'react-select';
import { useQueryClient } from '@tanstack/react-query';
import {
	useBucketUrlMutation,
	useCategoryListQuery,
	useCountryListQuery,
	useProfileListMutation,
	useProfileListQuery,
	useProfileMutation,
	useResponseListQuery,
	useStateListMutation,
	useTagListMutation,
	useUploadFileMutation,
} from 'services';
import useAuthStore from 'store/auth';
import 'styles/auth.scss';
import { isValidFileSize, isValidFileType } from 'utils';

const Profile: React.FC = () => {
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

	const navigate = useNavigate();

	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const queryClient = useQueryClient();
	const [stateList, setStateList] = useState([]);
	const [filteredTags, setFilteredTags] = useState([]);
	const [isUploading, setIsUploading] = useState(false);
	const [userList, setUserList] = useState<any>('');
	const { data: countryList = [] } = useCountryListQuery();
	const { mutateAsync: stateListMutation } = useStateListMutation();
	const { data: categoryList = [] } = useCategoryListQuery();
	const { mutateAsync: tagListMutation } = useTagListMutation();
	const { mutateAsync: bucketUrlMutation } = useBucketUrlMutation();
	const { mutateAsync: uploadFileMutation } = useUploadFileMutation();
	const { mutateAsync: profileMutation } = useProfileMutation();
	const { mutateAsync: profileListMutation } = useProfileListMutation();
	const { data: responseTimeList = [] } = useResponseListQuery();
	const { data: priceRangeList = [] } = useProfileListQuery();

	const prevCountryIdRef = useRef(null);
	const prevCategoryIdRef = useRef(null);
	const getGenderValue = (str: any) => {
		return str?.toLowerCase().replace(/\b\w/g, function (char: any) {
			return char.toUpperCase();
		});
	};

	const payload = {
		gender: getGenderValue(userList?.user?.gender) ?? '',
		priceRange: userList?.user?.priceRange ?? '',
		dob: userList?.user?.dob ?? null,
		city: userList?.user?.city ?? '',
		countryId: userList?.user?.countryId ?? '',
		stateId: userList?.user?.state?.id ?? '',
		zipcode: userList?.user?.zipcode ?? '',
		categoryId: userList?.user?.category?.id ?? '',
		tagId: userList?.user?.tags?.map((tag: any) => tag?.tag_id) ?? [],
		bio: userList?.user?.bio ?? '',
		responseTime: userList?.user?.responseTime ?? '',
		resume: userList?.user?.resume ?? '',
		resumeName: userList?.user?.resumeName ?? '',
	};

	const formik: any = useFormik({
		initialValues: {
			...profileInitialValues,
			...payload,
		},
		validationSchema: profileSchema,
		enableReinitialize: true,
		onSubmit: async (values) => {
			profileMutation({
				...values,
				fullName: user?.fullName,
			}).then((res: any) => {
				if (res?.success) {
					toast.success(res?.message);
					queryClient.invalidateQueries({ queryKey: ['get-profile'] });
					navigate(`/faq`);
				} else {
					toast.error(res?.message);
				}
			});
		},
	});

	useEffect(() => {
		if (user?.step > 1) {
			profileListMutation().then((res: any) => {
				if (res?.success) {
					setUserList(res?.data);
				}
			});
		}
	}, []);

	useEffect(() => {
		const currentCountryId = formik.values.countryId;
		if (currentCountryId && prevCountryIdRef.current !== currentCountryId) {
			prevCountryIdRef.current = currentCountryId;
			handleCountrySelect(currentCountryId);
		}
	}, [formik.values.countryId]);

	const handleCountrySelect = (value: any) => {
		formik.setFieldValue('countryId', value);
		stateListMutation(`?countryId=${value}`).then((res: any) => {
			if (res?.success) {
				setStateList(res?.data?.state);
			}
		});
	};

	const handleStateSelect = (value: any) => {
		formik.setFieldValue('stateId', value?.id);
	};

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
		const selectedTagIds = selectedTags.map((tag: any) => tag?.id);
		formik.setFieldValue('tagId', selectedTagIds);
	};
	const handlePriceRangeSelect = (value: string) =>
		priceRangeList?.priceRangeData?.find((option: any) => option.minMaxVal === value) ?? null;

	const handleGendersSelect = (value: any) =>
		Genders.find((option) => option.value === value) || null;

	const handleResponseTimeSelect = (value: any) =>
		responseTimeList?.responseTimeData?.find((option: any) => option?.time === value) ?? null;

	const renderError = <T extends keyof ProfileInterface>(field: T) =>
		formik.touched[field] && formik.errors[field] ? (
			<span className="text-danger f-error">{formik.errors[field] as ReactNode}</span>
		) : null;

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsUploading(true);
		const file: any = event.target.files?.[0];
		formik.setFieldValue('resumeName', file?.name ?? '');
		if (file) {
			if (!isValidFileType(file) || !isValidFileSize(file)) {
				setIsUploading(false);
				return;
			}
			const response = await bucketUrlMutation(`?location=users&type=pdf&count=1`);
			if (response?.data?.length > 0) {
				const preSignedUrlData = response?.data[0];
				setIsUploading(true);
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

				formik.setFieldValue('resume', preSignedUrlData?.filename ?? '');
			}
		}
		setIsUploading(false);
	};

	return (
		<section className="auth-page d-flex justify-content-center align-item-center">
			<div className="auth-page-card step d-flex flex-column">
				<h2 className="auth-page-main-title mb-0">Profile Completion</h2>
				<div className="step-buttons d-flex justify-content-between ">
					<button className="step-buttons-cta active d-flex flex-column align-items-center gap-2 border-0">
						1<span>Profile</span>
					</button>
					<button className="step-buttons-cta d-flex flex-column align-items-center gap-2 border-0">
						2<span>FAQ’s</span>
					</button>
					<button className="step-buttons-cta d-flex flex-column align-items-center gap-2 border-0">
						3<span>Portfolio</span>
					</button>
				</div>
				<Form className="auth-form" onSubmit={formik.handleSubmit}>
					<Row>
						<Col lg={6}>
							<Form.Group className="mb-20" controlId="formBasicEmail">
								<ReactSelect
									className={`form-react-select ${formik.errors.priceRange ? 'border-red' : ''}`}
									classNamePrefix="form-react-select"
									isSearchable
									placeholder="Range"
									name="PriceRange"
									options={priceRangeList?.priceRangeData ?? []}
									getOptionLabel={(option) => `$${option.minMaxVal.replace(/-/g, '-$')}`}
									getOptionValue={(option) => option.minMaxVal}
									onChange={(option) => formik.setFieldValue('priceRange', option?.minMaxVal ?? '')}
									value={handlePriceRangeSelect(formik.values.priceRange)}
									onBlur={formik.handleBlur}
								/>
								{renderError('priceRange')}
							</Form.Group>
						</Col>
						<Col lg={6}>
							<Form.Group className="mb-20">
								<DatePicker
									selected={formik.values.dob}
									name="dob"
									showFullMonthYearPicker
									showMonthDropdown
									showYearDropdown
									showIcon
									toggleCalendarOnIconClick
									placeholderText="Date of Birth"
									onBlur={formik.handleBlur}
									dateFormat="yyyy-MM-dd"
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
							<Form.Group className="mb-20" controlId="formBasicEmail">
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
							<Form.Group className="mb-20" controlId="formBasicEmail">
								<ReactSelect
									className={`form-react-select ${renderError('stateId') ? 'border-red' : ''}`}
									classNamePrefix="form-react-select"
									isSearchable
									name="stateId"
									placeholder="State"
									autoFocus={false}
									options={stateList || []}
									getOptionLabel={(option: any) => option?.stateName}
									getOptionValue={(option: any) => option?.id}
									onChange={(value: any) => handleStateSelect(value)}
									value={stateList?.find((item: any) => item.id === formik.values.stateId)}
									onBlur={formik.handleBlur}
								/>
								{renderError('stateId')}
							</Form.Group>
						</Col>
						<Col lg={6}>
							<Form.Group className="mb-20">
								<Form.Control
									type="text"
									placeholder="City"
									name="city"
									maxLength={31}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.city}
									className={renderError('city') ? 'border-red' : ''}
								/>
								{renderError('city')}
							</Form.Group>
						</Col>
						<Col lg={6}>
							<Form.Group className="mb-20">
								<Form.Control
									type="text"
									maxLength={9}
									placeholder="Zip Code"
									name="zipcode"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.zipcode}
									className={renderError('zipcode') ? 'border-red' : ''}
								/>
								{renderError('zipcode')}
							</Form.Group>
						</Col>
						<Col lg={6}>
							<Form.Group className="mb-20">
								<ReactSelect
									className={`form-react-select ${renderError('gender') ? 'border-red' : ''}`}
									classNamePrefix="form-react-select"
									isSearchable
									placeholder="Gender"
									name="gender"
									options={Genders}
									getOptionLabel={(option) => option.value}
									getOptionValue={(option) => option.value}
									onChange={(option) => formik.setFieldValue('gender', option ? option.value : '')}
									value={handleGendersSelect(formik.values.gender)}
									onBlur={formik.handleBlur}
								/>
								{renderError('gender')}
							</Form.Group>
						</Col>
						<Col lg={6}>
							<Form.Group className="mb-20">
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
							<Form.Group className="mb-20">
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

						<Col lg={12}>
							<Form.Group className="mb-20">
								<Form.Control
									as="textarea"
									rows={3}
									placeholder="Bio"
									name="bio"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.bio}
									className={renderError('bio') ? 'border-red' : ''}
									maxLength={250}
								/>
								{renderError('bio')}
							</Form.Group>
						</Col>
						<Col lg={6}>
							<Form.Group className="mb-20 position-relative resume-input">
								<div className="form-control ">
									{formik?.values?.resume ? formik?.values?.resumeName : 'Resume'}

									{isUploading ? (
										<Loader />
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
									onChange={handleFileChange}
									onBlur={formik.handleBlur}
								/>
								{renderError('resume')}
							</Form.Group>
						</Col>
						<Col lg={6}>
							<Form.Group className="mb-20">
								<ReactSelect
									className={`form-react-select ${renderError('responseTime') ? 'border-red' : ''}`}
									classNamePrefix="form-react-select"
									isSearchable
									placeholder="Response Time"
									name="responseTime"
									options={responseTimeList?.responseTimeData ?? []}
									getOptionLabel={(option) => `${option.time} Hour${option.time > 1 ? 's' : ''}`}
									getOptionValue={(option) => option?.time}
									onChange={(option) =>
										formik.setFieldValue('responseTime', option ? option?.time : '')
									}
									value={handleResponseTimeSelect(formik.values.responseTime)}
									onBlur={formik.handleBlur}
								/>
								{renderError('responseTime')}
							</Form.Group>
						</Col>
						<Col lg={6}>
							<button className="w-100 auth-page-cta" type="submit">
								Next
							</button>
						</Col>
					</Row>
				</Form>
			</div>
		</section>
	);
};

export default Profile;
