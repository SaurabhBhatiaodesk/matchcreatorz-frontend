import { Tab, Tabs } from 'react-bootstrap';
import { IMAGE_PATH } from 'constants/imagePaths';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import toast from 'react-hot-toast';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import { useRequestOTPMutation, useVerifyOTPMutation } from 'services';
import useAuthStore from 'store/auth';
import useCommonStore from 'store/common';
import 'styles/auth.scss';

const VerifyOTP: React.FC = () => {
	const setUserInfo = useAuthStore((state) => state.setUserInfo);
	const navigate = useNavigate();

	const [otp, setOtp] = useState<string>('');
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const [error, setError] = useState<string | null>(null);
	const [signupVerification, setSignupVerification] = useState(
		modalConfig?.data?.verificationType ?? 'PHONE',
	);
	const userType = localStorage.getItem('userType');

	const { mutateAsync: verifyProfileMobileMutation } = useVerifyOTPMutation();
	const { mutateAsync: requestOTPMobileMutation } = useRequestOTPMutation();

	useEffect(() => {
		if (modalConfig?.data?.verifyKey) {
			handleClick();
		}
	}, [modalConfig?.data?.verifyKey, modalConfig?.data?.type, signupVerification]);

	const phonePayload = {
		type: modalConfig?.data?.type,
		phone: modalConfig?.data?.phone,
		verificationType: signupVerification,
		otp: otp,
	};
	const emailPayload = {
		type: modalConfig?.data?.type,
		email: modalConfig?.data?.email,
		verificationType: signupVerification,
		otp: otp,
	};

	const getPayload = () =>
		signupVerification === 'EMAIL' ||
		modalConfig?.data?.verificationType === 'EMAIL' ||
		modalConfig?.data?.type === 'UPDATE_EMAIL' ||
		(modalConfig?.data?.type === 'FORGOT_PASSWORD' && modalConfig?.data?.email)
			? { ...emailPayload, verificationType: signupVerification }
			: { ...phonePayload, verificationType: signupVerification };

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (otp.length !== 4) {
			setError('Please enter OTP');
			return;
		}
		setError(null);

		verifyProfileMobileMutation(getPayload())
			.then((res: any) => {
				if (!res?.success) return;

				const { data, message } = res;
				const { type, verifyKey, phone, email } = modalConfig?.data || {};

				hideCommonModal();

				if (type === 'SIGN_UP') {
					setUserInfo(data);
					const isBuyer = userType === 'BUYER';
					const hasVerifyKey = !!verifyKey;
					const toastMessage = hasVerifyKey ? 'Account Verified Successfully' : message;
					const route = hasVerifyKey ? '/my-account' : isBuyer ? '/dashboard' : '/profile';
					toast.success(toastMessage);
					navigate(route);
				} else {
					toast.success(message);
					navigate('/reset-password', { state: { phone, email } });
				}
			})
			.finally(() => setOtp(''));
	};

	const handleClick = () => {
		requestOTPMobileMutation(getPayload())
			.then((res: any) => {
				if (res?.success) {
					toast.success(res?.message);
				}
			})
			.catch(() => {});
	};

	return (
		<div className="auth-page-card d-flex flex-column m-0">
			<button onClick={() => hideCommonModal()} className="modal-close-btn border-0 p-0">
				<i className="ri-close-line"></i>
			</button>
			<img src={IMAGE_PATH.lockIcon} alt="" className="w-100 auth-page-img" />
			<div className="d-flex flex-column gap-3">
				<h2 className="auth-page-main-title mb-0">Verify Account</h2>
				<p className="text-center mb-0 auth-page-text">
					A 4 digit code has been sent to{' '}
					{signupVerification === 'EMAIL' ? modalConfig?.data?.email : modalConfig?.data?.phone}
				</p>
			</div>
			{modalConfig?.data?.type === 'SIGN_UP' && !modalConfig?.data?.verificationType && (
				<Tabs
					defaultActiveKey={signupVerification}
					id="uncontrolled-tab-example"
					className="d-flex auth-page-tabs flex-direction-row"
					style={{ flexWrap: 'nowrap' }}
					onSelect={(key: any) => {
						setSignupVerification(key);
					}}
				>
					<Tab
						eventKey="PHONE"
						title="PHONE"
						style={{ width: '45%' }}
						disabled={modalConfig?.data?.type === 'EMAIL'}
					></Tab>
					<Tab
						eventKey="EMAIL"
						title="EMAIL"
						style={{ width: '45%' }}
						disabled={modalConfig?.data?.type === 'PHONE'}
					></Tab>
				</Tabs>
			)}
			<Form className="auth-form" onSubmit={handleSubmit}>
				<div className="opt-inputs d-flex justify-content-center">
					<OtpInput
						value={otp}
						onChange={setOtp}
						numInputs={4}
						renderInput={(props) => <input {...props} />}
					/>
				</div>
				{error && <div className="f-error text-danger">{error}</div>}
				<button className="w-100 auth-page-cta mt-4" type="submit">
					Verify
				</button>
			</Form>
			<p className="text-center mb-0 auth-page-text">
				{"Didn't Receive Code? "}
				<a className="auth-page-link" onClick={handleClick}>
					{'Request Again'}
				</a>
			</p>
		</div>
	);
};

export default VerifyOTP;
