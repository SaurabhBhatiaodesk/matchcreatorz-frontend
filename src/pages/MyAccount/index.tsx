import { AddImage, Loader } from 'components';
import { IMAGE_PATH } from 'constants/imagePaths';
import { S3_URL } from 'constants/index';
import { ChangePasswordInterface } from 'constants/interfaces';
import { changePasswordInitialValues, changePasswordSchema } from 'constants/schemaValidations';
import { useFormik } from 'formik';
import { DeletePortfolio } from 'pages';
import { ReactNode, useEffect, useState } from 'react';
import { Col, Dropdown, Form, Row, Stack, Tab, Tabs } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
	useAddAvatarUserMutation,
	useChangePasswordMutation,
	useDeleteFaqMutation,
	useProfileListMutation,
	useProfileMutation,
} from 'services';
import useAuthStore, { setUserInfo } from 'store/auth';
import { setModalConfig } from 'store/common';
import { updateAddOrDeleteObject } from 'utils';
import OtherDetails from './OtherDetails';
import './styles.scss';

const MyAccount: React.FC = () => {
	const navigate = useNavigate();
	const { user, token }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const [profileData, setProfileData] = useState<any>([]);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [passwordVisibleOP, setPasswordVisibleOP] = useState(false);
	const [passwordVisibleCP, setPasswordVisibleCP] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [isBannerUploading, setIsBannerUploading] = useState(false);
	const [activeTab, setActiveTab] = useState('profile');

	const { mutateAsync: profileMutation, isPending: isProfile } = useProfileMutation();
	const { mutateAsync: profileListMutation } = useProfileListMutation();
	const { mutateAsync: deleteFaqMutation } = useDeleteFaqMutation();
	const { mutateAsync: changePasswordMutation } = useChangePasswordMutation();
	const { mutateAsync: addAvatarMutation, isPending: isAvatar } = useAddAvatarUserMutation();

	useEffect(() => {
		profileListMutation().then((res: any) => {
			if (res?.success) {
				setProfileData(res?.data?.user);
				setUserInfo({ token: token, user: res?.data?.user });
			}
		});
	}, []);
	const handleAddFaqClick = (item: any) => {
		if (user?.faqs?.length >= 10) {
			toast.error('The FAQ limit has been exceeded.'); // Minor grammar correction for clarity
		} else {
			setModalConfig({
				visible: true,
				id: null,
				data: { ...item },
				type: 'addFaq',
			});
		}
	};

	const handleTabSelect = (key: string) => {
		setActiveTab(key);
	};

	const handleDelete = (id: any) => {
		deleteFaqMutation(id).then((res: any) => {
			if (res?.success) {
				const updatedData = updateAddOrDeleteObject(user?.faqs, null, id);
				setUserInfo({ token: token, user: { ...user, faqs: updatedData } });
				toast.success(res?.message);
			}
		});
	};

	const handleClickPortfolio = () => {
		if (user?.portfolios?.length >= 10) {
			toast.error('You have reached the maximum limit of 10 portfolios.');
		} else {
			setModalConfig({
				visible: true,
				id: null,
				type: 'addPortfolio',
			});
		}
	};

	const formik: any = useFormik({
		initialValues: { ...changePasswordInitialValues },
		validationSchema: changePasswordSchema,
		onSubmit: async (values, { resetForm }) => {
			changePasswordMutation({ ...values }).then((res: any) => {
				if (res?.success) {
					toast.success(res?.message);
					resetForm();
					navigate(`/dashboard`);
				}
			});
		},
	});

	const updateImageData = (imgPath: any) => {
		const payload = { avatar: imgPath };
		addAvatarMutation(payload, {
			onSuccess: (res: any) => {
				if (res?.success) {
					setProfileData(res?.data?.user);
					formik.setFieldValue('avatar', imgPath);
					setUserInfo({ token: token, user: { ...user, avatar: imgPath } });
				}
			},
		});
	};

	const updateBanner = (imgPath: any) => {
		const payload = { banner: imgPath };
		profileMutation({
			...payload,
		}).then((res: any) => {
			if (res?.success) {
				toast.success(res?.message);
				setUserInfo({ token: token, user: { ...user, banner: imgPath } });
			}
		});
	};

	const renderError = <T extends keyof ChangePasswordInterface>(field: T) =>
		formik.touched[field] && formik.errors[field] ? (
			<span className="text-danger f-error">{formik.errors[field] as ReactNode}</span>
		) : null;

	const handleClickUpdatePhoneEmail = (data: string, type: string) => {
		setModalConfig({
			visible: true,
			id: null,
			data: { verificationType: data, type: type },
			type: 'updatePhoneEmail',
		});
	};

	const handleClickVerify = (phoneNumber: any, email: any, data: string, verifyKey: string) => {
		setModalConfig({
			visible: true,
			id: null,
			data: {
				verificationType: data,
				phone: phoneNumber,
				email: email,
				type: 'SIGN_UP',
				verifyKey: verifyKey,
			},
			type: 'verifyOTP',
		});
	};
	return (
		<div className="profile-section d-flex flex-column">
			<h4 className="profile-section-title mb-0">My Account</h4>
			<Tabs
				defaultActiveKey="profile"
				className="custom-tabs"
				onSelect={(key: any) => handleTabSelect(key)}
			>
				<Tab eventKey="profile" title="My Profile">
					<div className="profile-section-details">
						<div className="position-relative banner">
							{isBannerUploading || isProfile ? (
								<Loader />
							) : (
								<img
									src={user?.banner ? `${S3_URL}${user?.banner}` : IMAGE_PATH.bannerImage}
									alt=""
									className="cover-image w-100"
								/>
							)}

							<div className="edit-icon d-flex align-items-center">
								<i className="ri-pencil-line"></i>
								<AddImage
									updateImageData={updateBanner}
									setIsUploading={setIsBannerUploading}
									isMultiple={false}
								/>
							</div>
						</div>
						<div className="position-relative user-profile">
							{isUploading || isAvatar ? (
								<Loader />
							) : (
								<img
									src={user?.avatar ? `${S3_URL}${user?.avatar}` : IMAGE_PATH.userIcon}
									alt=""
									className="w-100 h-100 object-fit-cover"
								/>
							)}

							<div className=" input-files d-flex align-items-center justify-content-center">
								<i className="ri-upload-2-line"></i>
								<AddImage
									updateImageData={updateImageData}
									setIsUploading={setIsUploading}
									isMultiple={false}
								/>
							</div>
						</div>
						<div className="profile-section-details-content white-box d-flex flex-column">
							<h6 className="mb-0 subheading">Personal Details</h6>
							<Row>
								<Col lg={6} className="mb-30">
									<div className="d-flex gap-3">
										<span className="icon d-flex align-items-center justify-content-center">
											<i className="ri-user-fill"></i>
										</span>
										<div className="d-flex flex-column gap-1">
											<span className="title">Full Name</span>
											<span className="name">{user?.fullName}</span>
										</div>
									</div>
								</Col>
								<Col lg={6} className="mb-30">
									<div className="d-flex gap-3 align-items-start">
										<span className="icon d-flex align-items-center justify-content-center">
											<i className="ri-phone-fill"></i>
										</span>
										<div className="d-flex flex-column gap-1">
											<span className="title">Mobile Number</span>
											<span className="name">
												{user?.countryCode}
												{user?.phone}
											</span>
										</div>
										{user?.isPhoneVerified && <span className="text-success">Verified</span>}
										{!user?.isPhoneVerified && user?.phone && (
											<button
												className="bg-transparent border-0 p-0 text-danger verify-btn"
												onClick={() =>
													handleClickVerify(user?.formattedPhone, null, 'PHONE', 'VERIFY')
												}
											>
												Verify
											</button>
										)}
										<button
											className="bg-transparent border-0 p-0 edit-btn"
											onClick={() =>
												handleClickUpdatePhoneEmail(
													'PHONE',
													user?.phone ? 'UPDATE_PHONE' : 'UPDATE_PHONE',
												)
											}
										>
											<i className="ri-pencil-fill"></i>
										</button>
									</div>
								</Col>
								<Col lg={6} className="mb-30">
									<div className="d-flex gap-3 align-items-start">
										<span className="icon d-flex align-items-center justify-content-center">
											<i className="ri-mail-fill"></i>
										</span>
										<div className="d-flex flex-column gap-1">
											<span className="title">Email</span>
											<span className="name">{user?.email}</span>
										</div>
										{user?.isEmailVerified && <span className="text-success">Verified</span>}
										{!user?.isEmailVerified && user?.email && (
											<button
												className="bg-transparent border-0 p-0 text-danger verify-btn"
												onClick={() => handleClickVerify(null, user?.email, 'EMAIL', 'VERIFY')}
											>
												Verify
											</button>
										)}
										<button
											className="bg-transparent border-0 p-0 edit-btn"
											onClick={() => handleClickUpdatePhoneEmail('EMAIL', 'UPDATE_EMAIL')}
										>
											<i className="ri-pencil-fill"></i>
										</button>
									</div>
								</Col>
								{user?.type === 'BUYER' && (
									<Col lg={6} className="mb-30">
										<div className="d-flex gap-3">
											<span className="icon d-flex align-items-center justify-content-center">
												<i className="ri-men-fill"></i>
											</span>
											<div className="d-flex flex-column gap-1">
												<span className="title">Gender</span>
												<span className="name">{user?.gender ?? 'N/A'}</span>
											</div>
										</div>
									</Col>
								)}
								<Col lg={6} className="mb-30">
									<div className="d-flex gap-3">
										<span className="icon d-flex align-items-center justify-content-center">
											<i className="ri-map-pin-2-fill"></i>
										</span>
										<div className="d-flex flex-column gap-1">
											<span className="title">Address</span>
											<span className="name">{user?.address ?? 'N/A'}</span>
										</div>
									</div>
								</Col>
								<Col lg={6} className="mb-30">
									<div className="d-flex gap-3">
										<span className="icon d-flex align-items-center justify-content-center">
											<i className="ri-earth-fill"></i>
										</span>
										<div className="d-flex flex-column gap-1">
											<span className="title">Country</span>
											<span className="name">{user?.country?.countryName ?? 'N/A'}</span>
										</div>
									</div>
								</Col>
								<Col lg={6} className="mb-30">
									<div className="d-flex gap-3">
										<span className="icon d-flex align-items-center justify-content-center">
											<i className="ri-building-4-fill"></i>
										</span>
										<div className="d-flex flex-column gap-1">
											<span className="title">State</span>
											<span className="name">{user?.state?.stateName ?? 'N/A'}</span>
										</div>
									</div>
								</Col>
								<Col lg={6} className="mb-30">
									<div className="d-flex gap-3">
										<span className="icon d-flex align-items-center justify-content-center">
											<i className="ri-hotel-fill"></i>
										</span>
										<div className="d-flex flex-column gap-1">
											<span className="title">City</span>
											<span className="name">{user?.city ?? 'N/A'}</span>
										</div>
									</div>
								</Col>
								<Col lg={6} className="mb-30">
									<div className="d-flex gap-3">
										<span className="icon d-flex align-items-center justify-content-center">
											<i className="ri-id-card-fill"></i>
										</span>
										<div className="d-flex flex-column gap-1">
											<span className="title">Zipcode</span>
											<span className="name">{user?.zipcode ?? 'N/A'}</span>
										</div>
									</div>
								</Col>
								<Col lg={12} className="mb-30">
									<div className="d-flex gap-3">
										<span className="icon d-flex align-items-center justify-content-center">
											<i className="ri-information-2-fill"></i>
										</span>
										<div className="d-flex flex-column gap-1">
											<span className="title">Bio</span>
											<span className="name">{user?.bio ?? 'N/A'}</span>
										</div>
									</div>
								</Col>
								<Col lg={3}>
									<button
										className="border-0 secondary-btn"
										onClick={() => navigate('/edit-profile')}
									>
										Edit Profile
									</button>
								</Col>
							</Row>
						</div>
					</div>
				</Tab>
				<Tab eventKey="change-password" title="Change Password">
					<div className="d-flex gap-3 flex-column">
						<h6 className="subheading mb-0">Change Password</h6>
						<Form onSubmit={formik.handleSubmit}>
							<Row>
								<Col lg={6}>
									<Form.Group className="mb-4 position-relative">
										<Form.Control
											type={passwordVisibleOP ? 'text' : 'password'}
											placeholder="Enter Old Password"
											name="currentPassword"
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.currentPassword}
											className={renderError('currentPassword') ? 'border-red' : ''}
										/>
										<span
											className="eye-view"
											onClick={() => setPasswordVisibleOP(!passwordVisibleOP)}
										>
											<i className={passwordVisibleOP ? 'ri-eye-off-fill' : 'ri-eye-fill'}></i>
										</span>
										{renderError('currentPassword')}
									</Form.Group>
								</Col>
								<Col lg={6}>
									<Form.Group className="mb-4 position-relative">
										<Form.Control
											type={passwordVisible ? 'text' : 'password'}
											placeholder="Enter New Password"
											name="newPassword"
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.newPassword}
											className={renderError('newPassword') ? 'border-red' : ''}
										/>
										<span className="eye-view" onClick={() => setPasswordVisible(!passwordVisible)}>
											<i className={passwordVisible ? 'ri-eye-off-fill' : 'ri-eye-fill'}></i>
										</span>
										{renderError('newPassword')}
									</Form.Group>
								</Col>
								<Col lg={6}>
									<Form.Group className="mb-4 position-relative">
										<Form.Control
											type={passwordVisibleCP ? 'text' : 'password'}
											placeholder="Enter Confirm Password"
											name="confirmPassword"
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.confirmPassword}
											className={renderError('confirmPassword') ? 'border-red' : ''}
										/>
										<span
											className="eye-view"
											onClick={() => setPasswordVisibleCP(!passwordVisibleCP)}
										>
											<i className={passwordVisibleCP ? 'ri-eye-off-fill' : 'ri-eye-fill'}></i>
										</span>
										{renderError('confirmPassword')}
									</Form.Group>
								</Col>
							</Row>
							<button className="secondary-btn" type="submit">
								Save Password
							</button>
						</Form>
					</div>
				</Tab>
			</Tabs>

			{user?.type === 'SELLER' && activeTab !== 'change-password' && (
				<>
					<OtherDetails profileData={profileData} />
					<div className="white-box profile-section-faq d-flex flex-column">
						<div className="d-flex justify-content-between">
							<h4 className="faq-box-heading mb-0">FAQ</h4>
							<button className="faq-box-add-btn" onClick={() => handleAddFaqClick({})}>
								+Add
							</button>
						</div>
						<Stack className="profile-section-faq-content gap-4">
							{user?.faqs &&
								user?.faqs?.map((item: any, index: any) => (
									<div className="profile-section-faq-display d-flex flex-column gap-1" key={index}>
										<div className="d-flex justify-content-between align-items-center">
											<h6 className="title mb-0">{item?.question}</h6>
											<Dropdown className="profile-dropdown">
												<Dropdown.Toggle
													className="bg-transparent border-0 p-0 "
													id="dropdown-basic"
												>
													<i className="ri-more-2-fill"></i>
												</Dropdown.Toggle>

												<Dropdown.Menu className="profile-dropdown-menu">
													<Dropdown.Item onClick={() => handleAddFaqClick(item)}>
														<i className="ri-pencil-line me-1"></i>Edit
													</Dropdown.Item>
													<Dropdown.Item onClick={() => handleDelete(item?.id)}>
														<i className="ri-delete-bin-7-line me-1"></i>
														Delete
													</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>
										</div>
										<p className="description mb-0">{item?.answer}</p>
									</div>
								))}
						</Stack>
					</div>
					<div className="white-box profile-section-faq d-flex flex-column mb-30">
						<div className="d-flex justify-content-between">
							<h4 className="faq-box-heading mb-0">Portfolio</h4>
							<button className="faq-box-add-btn" onClick={() => handleClickPortfolio()}>
								+Add
							</button>
						</div>
						<Row>
							{user?.portfolios &&
								user?.portfolios?.map((item: any, index: any) => (
									<Col lg={3} key={index}>
										<DeletePortfolio id={item?.id} image={item?.image} title={item?.title} />
									</Col>
								))}
						</Row>
					</div>
				</>
			)}
		</div>
	);
};

export default MyAccount;
