import { IMAGE_PATH } from 'constants/imagePaths';
import { S3_URL } from 'constants/index';
import { useEffect, useState } from 'react';
import { Breadcrumb, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useGetServiceInfoMutation } from 'services';
import useAuthStore from 'store/auth';
import { setModalConfig } from 'store/common';
import { formatRelativeDate } from 'utils';

const ServiceDetail: React.FC = () => {
	const { user, token }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const [serviceData, setServiceData] = useState<any>();
	const { id } = useParams<any>();
	const { mutateAsync: getServiceInfoMutation } = useGetServiceInfoMutation({
		userType: user?.type,
	});

	const navigate = useNavigate();
	const location = useLocation();
	const { activeTabType } = location.state ?? {};

	const handleClick = (itemId: number) => {
		navigate(
			`/${user?.type === 'SELLER' || activeTabType === 'BUYER' ? 'buyer-job-details' : 'service-details'}/${itemId}`,
			{
				state: { activeTabType: activeTabType ?? '' },
			},
		);
	};

	useEffect(() => {
		getServiceInfo();
	}, [id]);

	const getServiceInfo = () => {
		getServiceInfoMutation(`${id}?userId=${user?.id}`)
			.then((res: any) => {
				if (res?.success && res?.data) {
					setServiceData(res.data);
				} else {
					navigate(-1);
				}
			})
			.catch(() => {
				navigate(-1);
			});
	};

	const handleDownload = async () => {
		if (serviceData?.documents?.[0]?.url) {
			try {
				const response = await fetch(`${S3_URL}${serviceData?.documents?.[0]?.url}`);
				if (!response.ok) {
					throw new Error('Failed to fetch PDF file');
				}
				const blob = await response.blob();
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', serviceData?.documents?.[0]?.url?.split('/').pop());
				link.style.display = 'none';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				window.URL.revokeObjectURL(url);
			} catch (error) {
				console.error('Error downloading PDF:', error);
			}
		}
	};

	const handleTabChange = (activeTab: string) => {
		navigate('/search-users', { state: { activeTab } });
	};

	const handleClickBuyBooking = (serviceId: string) => {
		if (!token) {
			navigate('/login');
		} else {
			setModalConfig({
				visible: true,
				id: serviceId,
				onClick: getServiceInfo,
				type: 'buyBooking',
			});
		}
	};

	const handleViewProfile = (id: string) => {
		if (user?.type === 'SELLER' || activeTabType === 'BUYER') {
			navigate(`/buyer-details/${id}`, { state: { activeTabType: activeTabType } });
		} else {
			navigate(`/seller-details/${id}`, { state: { activeTabType: activeTabType } });
		}
	};

	const handleClickAddBid = (bidId: any) => {
		if (!token) {
			navigate('/login');
		} else {
			setModalConfig({
				visible: true,
				id: bidId,
				onClick: getServiceInfo,
				type: 'addBid',
			});
		}
	};

	const handleChatRequest = () => {
		if (!token) {
			navigate('/login');
		} else {
			setModalConfig({
				visible: true,
				id: serviceData?.userId,
				onClick: getServiceInfo,
				type: 'chatRequest',
			});
		}
	};

	const handleClickDetailsOthers = (id: any) => {
		if (user?.type === 'SELLER') {
			navigate(`/buyer-job-details/${id}`, { state: { activeTabType: activeTabType } });
		} else {
			navigate(`/service-details/${id}`, { state: { activeTabType: activeTabType } });
		}
	};
	return (
		<>
			<div className={`${token ? 'container-fluid' : 'container'}`}>
				<Breadcrumb>
					<Breadcrumb.Item>Home</Breadcrumb.Item>
					<Breadcrumb.Item className="active">
						{user?.type === 'SELLER' || activeTabType === 'BUYER'
							? 'Job by Buyer details Page'
							: 'Service Details'}
					</Breadcrumb.Item>
				</Breadcrumb>
			</div>
			<section className="position-relative pb-100">
				<div
					className={`service-detail  d-flex flex-column ${token ? 'container-fluid' : 'container'}`}
				>
					<div className="white-box service-detail-content d-flex gap-2 flex-column">
						<h2 className="mb-0 service-detail-content-title">{serviceData?.title}</h2>
						<span className="service-detail-content-id">ServiceID: #{id}</span>
						<span className="service-detail-content-designation">
							{serviceData?.category?.title}
						</span>
						<span className="service-detail-content-location">
							<i className="ri-map-pin-2-line me-2"></i> {serviceData?.country?.countryName}
						</span>
						<div className="d-flex gap-3 flex-wrap">
							{user?.type === 'SELLER' || activeTabType === 'BUYER' ? (
								<button
									className={`secondary-btn ${serviceData?.isBided || serviceData?.status === 'Booked' ? 'disabled' : ''}`}
									disabled={serviceData?.isBided || serviceData?.status === 'Booked' ? true : false}
									onClick={() => handleClickAddBid(serviceData?.id)}
								>
									Bid
								</button>
							) : (
								<>
									<button
										className="primary-btn"
										onClick={() => {
											if (serviceData?.isChatRequested || serviceData?.isChatConnected) {
												navigate('/chat-listing', {
													state: {
														id: serviceData?.user?.id,
														activeTabType:
															serviceData?.isChatRequested && !serviceData?.isChatConnected
																? 'requestSent'
																: 'chats',
													},
												});
											} else {
												handleChatRequest();
											}
										}}
									>
										Contact Seller
									</button>
									<button
										className="secondary-btn"
										onClick={() => handleClickBuyBooking(serviceData?.id)}
									>
										Buy
									</button>
								</>
							)}
						</div>
					</div>
					<div className="white-box">
						<div className="seller-information d-flex flex-column">
							<div className="d-flex flex-column gap-3">
								<h6 className="mb-0 seller-information-heading">Description</h6>
								<p className="mb-0 description">{serviceData?.description}</p>
							</div>
							<div className="d-flex flex-column gap-3">
								<h6 className="mb-0 seller-information-heading">Tags Selected</h6>
								<div className="d-flex flex-wrap gap-2">
									{serviceData?.tags?.map((item: any) => (
										<div className="custom-badges" key={item?.id}>
											{item?.name}
										</div>
									))}
								</div>
							</div>

							<div className="d-flex flex-column gap-3">
								<h6 className="mb-0 seller-information-heading">
									{serviceData?.price ? 'Price' : 'Price Range'}
								</h6>
								<p className="mb-0 subtitle">
									<i className="ri-money-dollar-circle-line me-2"></i>$
									{serviceData?.price ?? serviceData?.priceRange}
								</p>
							</div>

							<div className="d-flex flex-column gap-3">
								<h6 className="mb-0 seller-information-heading">Posted Date</h6>
								<p className="mb-0 subtitle">
									<i className="ri-calendar-line me-2"></i>
									{formatRelativeDate(serviceData?.created, false)}
								</p>
							</div>
						</div>
					</div>
					<div className="white-box d-flex flex-column gap-3">
						<h4 className="mb-0 main-subtitle">Document</h4>
						{serviceData?.documents?.map((doc: any) => (
							<div className="d-flex justify-content-between resume-section">
								<div className="resume-section-title">
									<i className="ri-attachment-line me-2"></i>
									{doc?.name ? (
										<>
											{(() => {
												const fileName = doc.name.slice(0, doc.name.lastIndexOf('.')); // Get the name without extension
												const extension = doc.name.slice(doc.name.lastIndexOf('.')); // Get the extension

												return fileName.length > 15 ? (
													<span title={doc.name}>
														{fileName.slice(0, 15)}...{extension}
													</span>
												) : (
													doc.name
												);
											})()}
										</>
									) : (
										'Online Marketplace WireFrame Design.pdf'
									)}
								</div>
								<button className="resume-section-btn" onClick={() => handleDownload()}>
									<i className="ri-download-2-line me-2"></i> View Document
								</button>
							</div>
						))}
					</div>
					{serviceData?.images?.length > 0 && (
						<div className="white-box d-flex flex-column gap-3 w-100">
							<h4 className="mb-0 main-subtitle">Images</h4>
							<div className="image-display d-flex  gap-3">
								{serviceData?.images?.map((item: any) => (
									<img key={item?.id} src={S3_URL + item?.url} alt="" />
								))}
							</div>
						</div>
					)}
					<div className="white-box d-flex gap-4 flex-column">
						<h4 className="mb-0 main-subtitle">
							{user?.type === 'SELLER' || activeTabType === 'BUYER'
								? 'Buyer Details'
								: 'Seller Details'}
						</h4>
						<div className="seller-profile d-flex">
							<img
								src={
									serviceData?.user?.avatar
										? S3_URL + serviceData?.user?.avatar
										: IMAGE_PATH.userIcon
								}
								alt=""
								className="seller-profile-img"
								onClick={() => handleViewProfile(serviceData?.user?.id)}
								style={{ cursor: 'pointer' }}
							/>
							<div className="d-flex flex-column gap-2">
								<div className="d-flex gap-3 align-items-center">
									<h4
										className="seller-profile-name mb-0"
										onClick={() => handleViewProfile(serviceData?.user?.id)}
										style={{ cursor: 'pointer' }}
									>
										{serviceData?.user?.fullName}
									</h4>
									{serviceData?.user?.avgRating !== 0 && (
										<div className="seller-profile-rating">
											<i className="ri-star-fill"></i>
											{serviceData?.user?.avgRating}
										</div>
									)}
								</div>
								<span className="seller-profile-designation">
									{serviceData?.user?.category?.title}
								</span>
								<span className="seller-profile-location">
									<i className="ri-map-pin-2-line"></i>
									{serviceData?.user?.country?.countryName && serviceData?.user?.state?.stateName
										? `${serviceData?.user?.state?.stateName},`
										: serviceData?.user?.state?.stateName}
									{serviceData?.user?.country?.countryName}
								</span>
							</div>
						</div>
					</div>
					<div className="white-box d-flex flex-column gap-3">
						{serviceData?.others?.length > 0 ? (
							<div className="d-flex justify-content-between section-headings align-items-center">
								<h4 className="mb-0 main-subtitle">
									Other{' '}
									{user?.type === 'SELLER' || activeTabType === 'BUYER'
										? 'Jobs By Buyer'
										: 'Services By Sellers'}
								</h4>
								<a
									className="view-link"
									onClick={() =>
										handleTabChange(
											user?.type === 'SELLER' || activeTabType === 'BUYER' ? 'BUYER' : 'SERVICES',
										)
									}
								>
									View All <img src={IMAGE_PATH.viewIcon} alt="" className=" ms-2" />
								</a>
							</div>
						) : null}

						<Row>
							{serviceData?.others?.slice(0, 3).map((item: any) => (
								<Col xl={4} lg={6} md={6} className="mb-3" key={item?.id}>
									<div className="common-card h-100 d-flex flex-column">
										<div className="d-flex flex-column gap-2">
											<h6 className="job-title mb-0">{item?.title}</h6>
											<div className="d-flex gap-1">
												<p className="job-description mb-0">
													{item?.description.length > 35 ? (
														<>
															{`${item?.description.slice(0, 35)}`}
															<a
																className="more-link ms-1"
																onClick={() => handleClickDetailsOthers(item?.id)}
															>
																...
															</a>
														</>
													) : (
														item?.description
													)}
												</p>
											</div>
											{item?.tags && (
												<div className="d-flex gap-2 flex-wrap align-items-center">
													{item?.tags?.slice(0, 2).map((tag: any, index: number) => (
														<div key={index} className="badges">
															{tag?.name}
														</div>
													))}
													{item?.tags?.length > 2 && (
														<a className="badges-links">+{item?.tags?.length - 2}</a>
													)}
												</div>
											)}
											<div className="d-flex flex-wrap gap-3 user-job-details">
												<span>
													<i className="ri-map-pin-2-line "></i>
													{serviceData?.country?.countryName}
												</span>
												<span>
													<i className="ri-calendar-line"></i>
													{formatRelativeDate(item?.created, false)}
												</span>
												{item?.price || item?.priceRange ? (
													<span>
														<i className="ri-money-dollar-circle-line"></i>$
														{item?.price || item?.priceRange}
													</span>
												) : null}
											</div>
										</div>
										<div className="d-flex gap-3 flex-wrap mt-auto">
											<button className="primary-btn" onClick={() => handleClick(item?.id)}>
												Details
											</button>
											{user?.type === 'SELLER' || activeTabType === 'BUYER' ? (
												<button
													className={`secondary-btn ${item?.isBided || item?.status === 'Booked' ? 'disabled' : ''}`}
													disabled={item?.isBided || item?.status === 'Booked' ? true : false}
													onClick={() => handleClickAddBid(item?.id)}
												>
													Bid
												</button>
											) : (
												<button
													className="secondary-btn"
													onClick={() => handleClickBuyBooking(item?.id)}
												>
													Buy
												</button>
											)}
										</div>
									</div>
								</Col>
							))}
						</Row>
					</div>
				</div>
			</section>
		</>
	);
};

export default ServiceDetail;
