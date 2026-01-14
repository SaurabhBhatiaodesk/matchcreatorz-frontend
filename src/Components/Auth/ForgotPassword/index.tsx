import 'styles/auth.scss';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCountryListQuery, useForgotPasswordMutation } from 'services';
import { useFormik } from 'formik';
import { forgetPasswordInitialValues, forgotPasswordSchema } from 'constants/schemaValidations';
import toast from 'react-hot-toast';
import { ReactNode, useEffect, useState } from 'react';
import { ForgotPasswordInterface } from 'constants/interfaces';
import { setModalConfig } from 'store/common';
import { IMAGE_PATH } from 'constants/imagePaths';
import ReactSelect from 'react-select';

const ForgotPassword: React.FC = () => {
	const navigate = useNavigate();
	const [isPhone, setIsPhone] = useState(false);
	const [isFocused, setIsFocused] = useState(true);
	const { data: countryList = [] } = useCountryListQuery();

	const { mutateAsync: forgetPasswordMutation } = useForgotPasswordMutation();

	const formik: any = useFormik({
		initialValues: { ...forgetPasswordInitialValues },
		validationSchema: forgotPasswordSchema,
		onSubmit: async (value) => {
			const { countrySlug, ...values } = value;
			const payload = isPhone
				? { phone: values?.countryCode + values?.userName }
				: { email: values?.userName };
			forgetPasswordMutation({
				...payload,
				type: 'FORGOT_PASSWORD',
				verificationType: isPhone ? 'PHONE' : 'EMAIL',
			}).then((res: any) => {
				if (res?.success) {
					toast.success(res?.message);
					handleClick();
				}
			});
		},
	});

	const renderError = <T extends keyof ForgotPasswordInterface>(field: T) =>
		formik.touched[field] && formik.errors[field] ? (
			<span className="text-danger f-error">{formik.errors[field] as ReactNode}</span>
		) : null;

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

	const handleClick = () => {
		setModalConfig({
			visible: true,
			id: null,
			data: {
				type: 'FORGOT_PASSWORD',
				phone: `${formik?.values?.countryCode + formik?.values?.userName}`,
				email: isPhone ? '' : formik?.values?.userName,
				verificationType: isPhone ? 'PHONE' : 'EMAIL',
			},
			type: 'verifyOTP',
		});
	};

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
		<section className="auth-page d-flex justify-content-center align-item-center">
			<div className="auth-page-card d-flex flex-column">
				<img src={IMAGE_PATH.lockIcon} alt="" className="w-100 auth-page-img" />
				<div className="d-flex flex-column gap-3">
					<h2 className="auth-page-main-title mb-0">Forgot Password?</h2>
					<p className="text-center mb-0 auth-page-text">
						Enter the email address associated with your account and we’ll send you a link to reset
						your password?
					</p>
				</div>
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
										(item: any) => item.slug === formik?.values?.countrySlug,
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
					<button className="w-100 auth-page-cta" type="submit">
						Submit
					</button>
				</Form>
				<a className="auth-page-link text-center" onClick={() => navigate('/login')}>
					<i className="ri-arrow-left-line"></i> Back to Login
				</a>
			</div>
		</section>
	);
};

export default ForgotPassword;
