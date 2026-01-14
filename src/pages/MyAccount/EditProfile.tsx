import { EditProfileInterface } from 'constants/interfaces';
import { editProfileInitialValues, editProfileSchema } from 'constants/schemaValidations';
import { useFormik } from 'formik';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ReactSelect from 'react-select';
import { useCountryListQuery, useProfileMutation, useStateListMutation } from 'services';
import useAuthStore from 'store/auth';
import './styles.scss';

const EditProfile: React.FC = () => {
	const navigate = useNavigate();
	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});

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
	const prevCountryIdRef = useRef(null);
	const { mutateAsync: profileMutation } = useProfileMutation();

	const { data: countryList = [] } = useCountryListQuery();
	const { mutateAsync: stateListMutation } = useStateListMutation();
	const [stateList, setStateList] = useState([]);

	const getGenderValue = (str: any) => {
		return str?.toLowerCase().replace(/\b\w/g, function (char: any) {
			return char.toUpperCase();
		});
	};

	const payload = {
		fullName: user?.fullName ?? '',
		gender: getGenderValue(user?.gender) ?? '',
		address: user?.address ?? '',
		countryId: user?.countryId ?? '',
		stateId: user?.stateId ?? '',
		city: user?.city ?? '',
		zipcode: user?.zipcode ?? '',
		bio: user?.bio ?? '',
	};

	const formik: any = useFormik({
		initialValues: {
			...editProfileInitialValues,
			...payload,
		},
		validationSchema: editProfileSchema,
		enableReinitialize: true,
		onSubmit: async (values) => {
			profileMutation({
				...values,
			}).then((res: any) => {
				if (res?.success) {
					toast.success(res?.message);
					navigate('/my-account');
				}
			});
		},
	});

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

	const handleGendersSelect = (value: any) =>
		Genders.find((option) => option.value === value) || null;

	const renderError = <T extends keyof EditProfileInterface>(field: T) =>
		formik.touched[field] && formik.errors[field] ? (
			<span className="text-danger f-error">{formik.errors[field] as ReactNode}</span>
		) : null;

	return (
		<div className="profile-section d-flex flex-column">
			<h4 className="profile-section-title mb-0" onClick={() => navigate(-1)}>
				<span className="back-arrow">
					<i className="ri-arrow-left-line"></i>
				</span>{' '}
				Edit Profile
			</h4>
			<Form onSubmit={formik.handleSubmit}>
				<Row>
					<Col lg={6}>
						<Form.Group className="mb-4">
							<Form.Label>Full Name</Form.Label>
							<Form.Control
								type="text"
								name="fullName"
								maxLength={51}
								placeholder="Full Name"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.fullName}
								className={renderError('fullName') ? 'border-red' : ''}
							/>
							{renderError('fullName')}
						</Form.Group>
					</Col>
					{user?.type === 'BUYER' && (
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
									getOptionValue={(option) => option.value}
									onChange={(option) => formik.setFieldValue('gender', option ? option.value : '')}
									value={handleGendersSelect(formik.values.gender)}
									onBlur={formik.handleBlur}
								/>
								{renderError('gender')}
							</Form.Group>
						</Col>
					)}
					<Col lg={6}>
						<Form.Group className="mb-4">
							<Form.Label>Address</Form.Label>
							<Form.Control
								type="text"
								name="address"
								placeholder="Address"
								maxLength={101}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.address}
								className={renderError('address') ? 'border-red' : ''}
							/>
							{renderError('address')}
						</Form.Group>
					</Col>
					<Col lg={6}>
						<Form.Group className="mb-4">
							<Form.Label>Country</Form.Label>
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
						<Form.Group className="mb-4">
							<Form.Label>State</Form.Label>
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
						<Form.Group className="mb-4">
							<Form.Label>City</Form.Label>
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
						<Form.Group className="mb-4">
							<Form.Label>Zipcode</Form.Label>
							<Form.Control
								type="text"
								name="zipcode"
								maxLength={9}
								placeholder="Zipcode"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.zipcode}
								className={renderError('zipcode') ? 'border-red' : ''}
							/>
							{renderError('zipcode')}
						</Form.Group>
					</Col>
					<Col lg={12}>
						<Form.Group className="mb-4">
							<Form.Label>Bio</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Bio"
								name="bio"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.bio}
								className={renderError('bio') ? 'border-red' : ''}
							/>
							{renderError('bio')}
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

export default EditProfile;
