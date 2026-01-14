import React, { ReactNode, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import { SignInInterface } from 'constants/interfaces';
import { signInInitialValues, signInSchema } from 'constants/schemaValidations';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCountryListQuery, useLoginMutation } from 'services';
import useAuthStore from 'store/auth';
import ReactSelect from 'react-select';

const LoginBuyer: React.FC = () => {
	const { resetState } = useAuthStore();
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [keepLoggedIn, setKeepLoggedIn] = useState(false);
	const [isPhone, setIsPhone] = useState(false);
	const [isFocused, setIsFocused] = useState(true);

	const setUserInfo = useAuthStore((state) => state.setUserInfo);
	const { data: countryList = [] } = useCountryListQuery();

	useEffect(() => {
		const handleOutsideClick = (event: any) => {
			if (!event.target.closest('.input-wrapper')) {
				setIsFocused(false);
			}
		};
		document.addEventListener('mousedown', handleOutsideClick);
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, []);

	const togglePasswordVisibility = () => {
		setPasswordVisible((prev) => !prev);
	};

	const navigate = useNavigate();
	const { mutateAsync: loginMutation } = useLoginMutation();

	const formik: any = useFormik({
		initialValues: { ...signInInitialValues },
		validationSchema: signInSchema,
		onSubmit: async (values) => {
			const fcmDeviceToken = localStorage.getItem('fcmToken') || '';
			const payload = isPhone
				? { userName: values?.countryCode + values?.userName }
				: { userName: values?.userName };
			loginMutation({
				...payload,
				type: 'BUYER',
				password: values?.password,
				deviceToken: fcmDeviceToken,
			})
				.then((res: any) => {
					if (res?.success) {
						formik.handleReset();
						toast.success(res?.message);
						if (!keepLoggedIn) {
							resetState();
						}
						setUserInfo({ ...res?.data, keepLogin: keepLoggedIn });
						navigate('/dashboard');
					}
				})
				.catch(() => {});
		},
	});

	useEffect(() => {
		const isPhoneNumberValid = (phone: string | undefined) => {
			if (!phone) return false;
			return !isNaN(Number(phone));
		};

		if (isPhoneNumberValid(formik?.values?.userName)) {
			setIsPhone(true);
		} else {
			setIsPhone(false);
		}
	}, [formik?.values?.userName]);

	const renderError = <T extends keyof SignInInterface>(field: T) =>
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
		<Form className="auth-form" onSubmit={formik.handleSubmit}>
			<Form.Group className="mb-20" controlId="formBasicEmail">
				{!isPhone ? (
					<>
						<Form.Control
							type="text"
							name="userName"
							placeholder="Email ID / Mobile Number"
							onChange={formik.handleChange}
							onBlur={() => setIsFocused(false)}
							onFocus={() => setIsFocused(true)}
							autoFocus={isFocused}
							value={formik.values.userName}
							className={renderError('userName') ? 'border-red' : ''}
						/>
						{renderError('userName')}
					</>
				) : (
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
								(item: any) => item.slug === formik.values.countrySlug,
							)}
							onBlur={formik.handleBlur}
						/>
						<Form.Control
							type="text"
							placeholder="Mobile Number"
							name="userName"
							className={`phone-padding`}
							onBlur={() => setIsFocused(false)}
							onFocus={() => setIsFocused(true)}
							autoFocus={isFocused}
							onChange={formik.handleChange}
							value={formik.values.userName}
							autoComplete="off"
							maxLength={13}
						/>
					</div>
				)}
			</Form.Group>
			<Form.Group className="mb-20 position-relative" controlId="formBasicPassword">
				<Form.Control
					type={passwordVisible ? 'text' : 'password'}
					placeholder="Password"
					name="password"
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.password}
					className={renderError('password') ? 'border-red' : ''}
				/>
				<span className="eye-view" onClick={togglePasswordVisibility}>
					<i className={passwordVisible ? 'ri-eye-off-fill' : 'ri-eye-fill'}></i>
				</span>
				{renderError('password')}
			</Form.Group>
			<Form.Group
				className="mb-20 d-flex justify-content-between align-items-center"
				controlId="formBasicCheckbox"
			>
				<Form.Check
					type="checkbox"
					label="Keep me logged in"
					onClick={() => setKeepLoggedIn(!keepLoggedIn)}
				/>
				<a className="auth-page-link" onClick={() => navigate('/forgot-password')}>
					Forgot Password?
				</a>
			</Form.Group>
			<button className="w-100 auth-page-cta" type="submit">
				Login
			</button>
		</Form>
	);
};

export default LoginBuyer;
