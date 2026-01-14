import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import toast from 'react-hot-toast';
import {
	sellerSignUpInitialValues,
	sellerSignUpSchema,
	signUpInitialValues,
	signUpSchema,
} from 'constants/schemaValidations';
import { useCountryListQuery, useSignUpMutation } from 'services';
import { setModalConfig } from 'store/common';
import 'styles/auth.scss';
import RegisterBuyer from './RegisterBuyer';
import RegisterSeller from './RegisterSeller';
import SocialLogin from '../SocialLogin/SocialLogin';
const Register: React.FC = () => {
	const [userStatus, setUserStatus] = useState('BUYER');
	const [isUploading, setIsUploading] = useState(false);

	const { data: countryList = [] } = useCountryListQuery();
	const { mutateAsync: signUpMutation } = useSignUpMutation();

	useEffect(() => {
		localStorage.setItem('userType', userStatus);
	}, [userStatus]);

	const formik: any = useFormik({
		initialValues:
			userStatus === 'BUYER' ? { ...signUpInitialValues } : { ...sellerSignUpInitialValues },
		validationSchema: userStatus === 'BUYER' ? signUpSchema : sellerSignUpSchema,
		onSubmit: async (values) => {
			const fcmDeviceToken = localStorage.getItem('fcmToken') ?? '';
			signUpMutation({ ...values, type: userStatus, deviceToken: fcmDeviceToken })
				.then((res: any) => {
					if (res?.success) {
						toast.success(res?.message);
						handleClick();
					}
				})
				.catch(() => {});
		},
	});

	const updateImageData = (imgPath: any) => {
		formik.setFieldValue('avatar', imgPath);
	};

	const handleClick = (phoneNumber?: any, email?: any) => {
		setModalConfig({
			visible: true,
			id: null,
			data: { type: 'SIGN_UP', phone: phoneNumber, email: email },
			type: 'verifyOTP',
		});
	};

	const handleTabSelect = (key: any) => {
		formik.setErrors({});
		formik.handleReset();
		setUserStatus(key);
	};

	return (
		<section className="auth-page d-flex justify-content-center align-item-center">
			<div className="auth-page-card d-flex flex-column">
				<h2 className="auth-page-main-title mb-0">
					Create Your <span>Account</span>
				</h2>
				<Tabs
					defaultActiveKey="BUYER"
					id="uncontrolled-tab-example"
					className="auth-page-tabs"
					onSelect={(key) => handleTabSelect(key)}
				>
					<Tab eventKey="BUYER" title="Register as Buyer">
						<SocialLogin type={userStatus} />

						<RegisterBuyer
							userStatus={userStatus}
							isUploading={isUploading}
							setIsUploading={setIsUploading}
							updateImageData={updateImageData}
							countryList={countryList}
							handleClick={handleClick}
						/>
					</Tab>
					<Tab eventKey="SELLER" title="Register as Seller">
						<SocialLogin type={userStatus} />

						<RegisterSeller
							userStatus={userStatus}
							isUploading={isUploading}
							setIsUploading={setIsUploading}
							updateImageData={updateImageData}
							countryList={countryList}
							handleClick={handleClick}
						/>
					</Tab>
				</Tabs>
			</div>
		</section>
	);
};

export default Register;
