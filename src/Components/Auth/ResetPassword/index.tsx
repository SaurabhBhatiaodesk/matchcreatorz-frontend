import 'styles/auth.scss';
import { Form } from 'react-bootstrap';
import { ReactNode, useState } from 'react';
import { useFormik } from 'formik';
import { resetPasswordInitialValues, resetPasswordSchema } from 'constants/schemaValidations';
import { useResetPasswordMutation } from 'services';
import { ResetPasswordInterface } from 'constants/interfaces';
import { useLocation, useNavigate } from 'react-router-dom';
import { IMAGE_PATH } from 'constants/imagePaths';
import toast from 'react-hot-toast';

const ResetPassword: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { phone, email } = location.state || {};

	const [passwordVisible, setPasswordVisible] = useState(false);
	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

	const togglePasswordVisibility = () => {
		setPasswordVisible((prev) => !prev);
	};

	const toggleConfirmPasswordVisibility = () => {
		setConfirmPasswordVisible((prev) => !prev);
	};

	const { mutateAsync: resetPasswordMutation } = useResetPasswordMutation();
	const formik: any = useFormik({
		initialValues: { ...resetPasswordInitialValues },
		validationSchema: resetPasswordSchema,
		onSubmit: async (values) => {
			const emailPayload = {
				email: email,
				verificationType: 'EMAIL',
			};
			const phonePayload = {
				phone: phone,
				verificationType: 'PHONE',
			};

			const payload = email ? emailPayload : phonePayload;

			resetPasswordMutation({ ...values, ...payload })
				.then((res: any) => {
					if (res?.success) {
						toast.success(res?.message);
						navigate(`/login`);
					}
				})
				.catch(() => {});
		},
	});

	const renderError = <T extends keyof ResetPasswordInterface>(field: T) =>
		formik.touched[field] && formik.errors[field] ? (
			<span className="text-danger f-error">{formik.errors[field] as ReactNode}</span>
		) : null;

	return (
		<section className="auth-page d-flex justify-content-center align-item-center">
			<div className="auth-page-card d-flex flex-column">
				<img src={IMAGE_PATH.lockIcon} alt="" className="w-100 auth-page-img" />
				<div className="d-flex flex-column gap-3">
					<h2 className="auth-page-main-title mb-0">Reset Password</h2>
					<p className="text-center mb-0 auth-page-text">
						To change your password, please fill the fields below. Your password must contain at
						least 8 characters.
					</p>
				</div>

				<Form className="auth-form" onSubmit={formik.handleSubmit}>
					<Form.Group className="mb-20 position-relative" controlId="formBasicPassword">
						<Form.Control
							type={passwordVisible ? 'text' : 'password'}
							placeholder="New Password"
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

					<Form.Group className="mb-20 position-relative" controlId="formBasicPassword">
						<Form.Control
							type={confirmPasswordVisible ? 'text' : 'password'}
							placeholder="Confirm Password"
							className={renderError('confirmPassword') ? 'border-red' : ''}
							name="confirmPassword"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.confirmPassword}
						/>
						<span className="eye-view" onClick={toggleConfirmPasswordVisibility}>
							<i className={confirmPasswordVisible ? 'ri-eye-off-fill' : 'ri-eye-fill'}></i>
						</span>
						{renderError('confirmPassword')}
					</Form.Group>
					<button className="w-100 auth-page-cta" type="submit">
						Change Password
					</button>
				</Form>
			</div>
		</section>
	);
};

export default ResetPassword;
