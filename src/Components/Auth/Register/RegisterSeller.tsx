import React, { ReactNode, useState } from 'react';
import { Form } from 'react-bootstrap';
import { AddImage, Loader } from 'components';
import {
	S3_URL,
	sellerSignUpInitialValues,
	SellerSignupInterface,
	sellerSignUpSchema,
} from 'constants/index';

import ReactSelect from 'react-select';
import { IMAGE_PATH } from 'constants/imagePaths';
import { useNavigate } from 'react-router-dom';
import { useSignUpMutation } from 'services';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';

interface RegisterSellerProps {
	userStatus: any;
	isUploading: boolean;
	setIsUploading: (isUploading: boolean) => void;
	updateImageData: any;
	countryList: any;
	handleClick: any;
}

const RegisterSeller: React.FC<RegisterSellerProps> = ({
	userStatus,
	updateImageData,
	countryList,
	isUploading,
	setIsUploading,
	handleClick,
}) => {
	const navigate = useNavigate();
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [passwordVisibleCp, setPasswordVisibleCp] = useState(false);
	const { mutateAsync: signUpMutation } = useSignUpMutation();
	const togglePasswordVisibilityBuyer = () => {
		setPasswordVisible((prev) => !prev);
	};

	const togglePasswordVisibilityBuyerCP = () => {
		setPasswordVisibleCp((prev) => !prev);
	};

	const formik: any = useFormik({
		initialValues: { ...sellerSignUpInitialValues },
		validationSchema: sellerSignUpSchema,
		onSubmit: async (value) => {
			const { quickdent, countrySlug, ...values } = value;
			const fcmDeviceToken = localStorage.getItem('fcmToken') ?? '';
			signUpMutation({ ...values, type: userStatus, deviceToken: fcmDeviceToken })
				.then((res: any) => {
					if (res?.success) {
						toast.success(res?.message);
						handleClick(`${formik.values.countryCode}${formik.values.phone}`, formik.values.email);
					}
				})
				.catch(() => {});
		},
	});

	const renderError = <T extends keyof SellerSignupInterface>(field: T) =>
		formik.touched[field] && formik.errors[field] ? (
			<span className="text-danger f-error">{formik.errors[field] as ReactNode}</span>
		) : null;

	const formatOptionLabel = ({
		slug,
		code,
		countryName,
	}: {
		slug: string;
		code: string;
		countryName: string;
	}) => (
		<div className="d-flex align-items-center">
			{slug ? (
				<img
					src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${slug.toLowerCase()}.svg`}
					alt={countryName}
					style={{ width: '20px', height: '15px', marginRight: '10px' }}
				/>
			) : null}
			<span>{code}</span>
		</div>
	);
	return (
		<>
			<Form className="auth-form" onSubmit={formik.handleSubmit}>
				<div className="position-relative text-center profile-image-card">
					{isUploading ? (
						<Loader />
					) : (
						<img
							src={
								formik?.values?.avatar
									? `${S3_URL}${formik?.values?.avatar}`
									: IMAGE_PATH.profileIcon
							}
							alt=""
							className="profile-image"
						/>
					)}
					<div className="input--file">
						<span>
							<i className="ri-upload-2-line"></i>
						</span>

						<AddImage
							updateImageData={updateImageData}
							setIsUploading={setIsUploading}
							isMultiple={false}
						/>
					</div>
				</div>
				<Form.Group className="mb-20">
					<Form.Control
						type="text"
						placeholder="Full Name"
						name="fullName"
						maxLength={51}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.fullName}
						className={renderError('fullName') ? 'border-red' : ''}
					/>
					{renderError('fullName')}
				</Form.Group>
				<Form.Group className="mb-20" controlId="formBasicEmail">
					<Form.Control
						type="email"
						placeholder="Email ID"
						name="email"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.email}
						className={renderError('email') ? 'border-red' : ''}
					/>
					{renderError('email')}
				</Form.Group>
				<Form.Group className="mb-20 ">
					<div className="d-flex position-relative">
						<ReactSelect
							className={`form-react-select phone`}
							classNamePrefix="form-react-select"
							isSearchable
							name="countryCode"
							placeholder="+91"
							autoFocus={false}
							options={countryList?.country || []}
							getOptionLabel={(option: any) => `${option?.code}`}
							getOptionValue={(option: any) => option?.code}
							formatOptionLabel={formatOptionLabel}
							onChange={(value: any) => {
								formik.setFieldValue('countryCode', value?.code);
								formik.setFieldValue('countrySlug', value?.slug);
							}}
							value={countryList?.country?.find(
								(item: any) => item.slug === formik?.values?.countrySlug,
							)}
							onBlur={formik.handleBlur}
						/>
						<Form.Control
							type="text"
							placeholder="Phone Number"
							name="phone"
							className={`phone-padding ${renderError('phone') ? 'border-red' : ''}`}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.phone}
							autoComplete="off"
							maxLength={12}
						/>
					</div>
					{renderError('phone')}
				</Form.Group>
				<Form.Group className="mb-20 position-relative" controlId="formBasicPassword">
					<Form.Control
						type={passwordVisible ? 'text' : 'password'}
						placeholder="Password"
						className={renderError('password') ? 'border-red' : ''}
						name="password"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.password}
					/>
					<span className="eye-view" onClick={togglePasswordVisibilityBuyer}>
						<i className={passwordVisible ? 'ri-eye-off-fill' : 'ri-eye-fill'}></i>
					</span>
					{renderError('password')}
				</Form.Group>
				<Form.Group className="mb-20 position-relative" controlId="formBasicPassword">
					<Form.Control
						type={passwordVisibleCp ? 'text' : 'password'}
						placeholder="Confirm Password"
						name="confirmPassword"
						className={renderError('confirmPassword') ? 'border-red' : ''}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.confirmPassword}
					/>
					<span className="eye-view" onClick={togglePasswordVisibilityBuyerCP}>
						<i className={passwordVisibleCp ? 'ri-eye-off-fill' : 'ri-eye-fill'}></i>
					</span>
					{renderError('confirmPassword')}
				</Form.Group>
				<Form.Group className="mb-20 " controlId="sellerFormBasicCheckbox">
					<div className="d-flex align-items-center">
						<Form.Check
							type="checkbox"
							label="I Accept "
							name="agreeTerms"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							checked={formik.values.agreeTerms}
						/>

						<a className="terms-link ms-1 " onClick={() => navigate('/terms-conditions')}>
							{' '}
							Terms & Conditions
						</a>
					</div>
					{renderError('agreeTerms')}
				</Form.Group>
				<Form.Group className="mb-20" controlId="formBasicCheckbox">
					<div className="d-flex align-items-center">
						<Form.Check
							type="checkbox"
							label="I consent to receive SMS messages from Quicdent for verification purposes and understand that message and data rates may apply. "
							name="quickdent"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							checked={formik.values.quickdent}
						/>
					</div>
					{renderError('quickdent')}
				</Form.Group>

				<button className="w-100 auth-page-cta" type="submit">
					Submit
				</button>
			</Form>
			<p className="text-center mt-4 mb-0 auth-page-text">
				Already have an account?{' '}
				<a className="auth-page-link" onClick={() => navigate('/login')}>
					Login
				</a>
			</p>
		</>
	);
};
export default RegisterSeller;
