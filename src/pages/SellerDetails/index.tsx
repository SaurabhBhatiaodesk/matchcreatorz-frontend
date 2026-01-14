import { FavoriteBtn, ServiceCard, StatusCard } from 'components';
import { IMAGE_PATH } from 'constants/imagePaths';
import { S3_URL } from 'constants/index';
import { useEffect, useState } from 'react';
import { Accordion, Breadcrumb, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useGetPublicUserInfoMutation, useGetUserInfoMutation } from 'services';
import useAuthStore from 'store/auth';
import { setModalConfig } from 'store/common';
import 'styles/seller-details.scss';
import { formatDate } from 'utils';

const SellerDetails: React.FC = () => {
	const { id } = useParams<any>();
	const location = useLocation();
	const { activeTabType } = location?.state ?? {};
	const { user, token }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const { adminData }: Record<string, any> = useAuthStore((state) => state ?? {});
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [userData, setUserData] = useState<any>();
	const [isReported, setIsReported] = useState<any>(false);
	const { mutateAsync: getUserInfoMutation } = useGetUserInfoMutation();
	const { mutateAsync: getPublicUserInfoMutation } = useGetPublicUserInfoMutation();
	const [statusData, setStatusData] = useState<any>([]);
	const showTotalEarning = adminData?.earningSellerCardVisibility;
	const showTotalExpenditure = adminData?.earningBuyerCardVisibility;

	useEffect(() => {
		setIsLoading(true);

		if (token) {
			handleUserInfoMutation();
		} else {
			getPublicUserInfoMutation(id)
				.then((res: any) => {
					if (res?.success) {
						setUserData(res?.data);
						setIsReported(res?.data?.isReported);
					}
				})
				.finally(() => setIsLoading(false));
		}
	}, [id]);

	useEffect(() => {
		if (userData && Object.keys(userData)?.length > 0) {
			const extraCards = handelStatusCard();
			setStatusData([
				{
					image: IMAGE_PATH.StatusIcon1,
					title: 'Completed Jobs',
					subtitle: userData?.completedJobs ?? 0,
				},
				{
					image: IMAGE_PATH.StatusIcon2,
					title: 'Total Jobs',
					subtitle: userData?.totalJobs ?? 0,
				},
				{
					image: IMAGE_PATH.StatusIcon3,
					title: 'Member Since',
					subtitle:
						new Date(userData?.created).toLocaleDateString('en-US', {
							day: 'numeric',
							month: 'long',
							year: 'numeric',
						}) || null,
				},
				...extraCards,
			]);
		}
	}, [userData]);

	const handleUserInfoMutation = () => {
		getUserInfoMutation(id)
			.then((res: any) => {
				if (res?.success) {
					setUserData(res?.data);
					setIsReported(res?.data?.isReported);
				}
			})
			.finally(() => setIsLoading(false));
	};
	const handleDownload = async () => {
		if (userData?.resume) {
			try {
				const response = await fetch(`${S3_URL}${userData?.resume}`);
				if (!response.ok) {
					throw new Error('Failed to fetch PDF file');
				}
				const blob = await response.blob();
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', userData?.resumeName?.split('/').pop());
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

	const handleClick = (type: any) => {
		if (token) {
			setModalConfig({
				visible: true,
				id: id,
				onClick: reportHandler,
				type: 'counterAmount',
				data: { type },
			});
		} else {
			navigate('/login');
		}
	};

	const reportHandler = () => {
		setIsReported(true);
	};

	const handelStatusCard = () => {
		const tempArr = [];
		if (showTotalExpenditure && (activeTabType === 'BUYER' || user?.type === 'SELLER')) {
			tempArr.push({
				image:
					user?.type === 'BUYER' || activeTabType === 'SELLER'
						? IMAGE_PATH.StatusIcon5
						: IMAGE_PATH.expenditureIcon,
				title:
					user?.type === 'BUYER' || activeTabType === 'SELLER'
						? 'Total Earning'
						: 'Total Expenditure',
				subtitle:
					user?.type === 'BUYER' || activeTabType === 'SELLER'
						? `${userData?.totalEarning && userData?.totalEarning !== undefined ? userData?.totalEarning : 0}`
						: `${userData?.totalExpenditure && userData?.totalExpenditure !== undefined ? userData?.totalExpenditure : 0}` ||
							0,
			});
		}
		if (activeTabType === 'SELLER' || user?.type === 'BUYER') {
			tempArr.push({
				image: IMAGE_PATH.StatusIcon4,
				title: 'Avg. Response Time',
				subtitle: userData?.responseTime ?? 0,
			});
		}

		if (showTotalEarning && (activeTabType === 'SELLER' || user?.type === 'BUYER')) {
			tempArr.push({
				image:
					user?.type === 'BUYER' || activeTabType === 'SELLER'
						? IMAGE_PATH.StatusIcon5
						: IMAGE_PATH.expenditureIcon,
				title:
					user?.type === 'BUYER' || activeTabType === 'SELLER'
						? 'Total Earning'
						: 'Total Expenditure',
				subtitle:
					user?.type === 'BUYER' || activeTabType === 'SELLER'
						? `${userData?.totalEarning && userData?.totalEarning !== undefined ? userData?.totalEarning : 0}`
						: `${userData?.totalExpenditure && userData?.totalExpenditure !== undefined ? userData?.totalExpenditure : 0}` ||
							0,
			});
		}

		return tempArr;
	};

	const handleTabChange = (activeTab: string) => {
		navigate('/search-users', { state: { activeTab } });
	};

	const handleChatRequest = () => {
		if (!token) {
			navigate('/login');
		} else {
			setModalConfig({
				visible: true,
				id: userData?.id,
				onClick: handleUserInfoMutation,
				type: 'chatRequest',
			});
		}
	};

	return (
		<>
			<div className={`${token ? 'container-fluid' : 'container'}`}>
				<Breadcrumb>
					<Breadcrumb.Item>Home</Breadcrumb.Item>
					<Breadcrumb.Item className="active">
						{user?.type === 'SELLER' || activeTabType === 'BUYER'
							? 'Buyer Details'
							: 'Seller Details'}
					</Breadcrumb.Item>
				</Breadcrumb>
			</div>
			<section className="position-relative pb-100">
				<div
					className={`seller-profile-details d-flex flex-column ${token ? 'container-fluid' : 'container'}`}
				>
					<div className="seller-profile-details-box">
						<img
							src={userData?.banner ? `${S3_URL + userData?.banner}` : IMAGE_PATH.bannerImage}
							alt=""
							className="w-100 banner-image"
						/>
						<div className="profile-content d-flex">
							<img
								src={userData?.avatar ? `${S3_URL + userData?.avatar}` : IMAGE_PATH.userIcon}
								alt=""
								className="profile-content-img"
							/>
							<div className="d-flex flex-column gap-3">
								<div className="d-flex gap-3 align-items-center">
									<h4 className="profile-content-name">{userData?.fullName}</h4>
									{userData?.avgRating !== 0 && (
										<div className="profile-content-rating">
											<i className="ri-star-fill"></i>
											{userData?.avgRating}
										</div>
									)}
								</div>
								{user?.type !== 'SELLER' ? (
									<span className="profile-content-designation">{userData?.category?.title}</span>
								) : null}
								{userData?.country !== null && (
									<span className="profile-content-location">
										<i className="ri-map-pin-2-line"></i>{' '}
										{userData?.country?.countryName && userData?.state?.stateName
											? `${userData?.state?.stateName},`
											: userData?.state?.stateName}
										{userData?.country?.countryName}
									</span>
								)}
								<div className="d-flex flex-wrap gap-3">
									<>
										<button
											className={`profile-content-btn one ${isReported ? 'disabled' : ''}`}
											disabled={isReported}
											onClick={() => handleClick('Report')}
										>
											<i className="ri-flag-2-line me-2"></i> Report
										</button>

										{activeTabType === 'SELLER' && (
											<>
												{userData && (
													<FavoriteBtn
														isEnabled={userData?.isFavourite}
														userId={userData?.id}
														isButton={true}
													/>
												)}
												<button
													className="profile-content-btn three"
													onClick={() => {
														if (userData?.chatRequest) {
															navigate('/chat-listing', {
																state: {
																	id: userData?.id,
																	activeTabType:
																		userData?.chatRequest && !userData?.isChatConnected
																			? 'requestSent'
																			: 'chats',
																},
															});
														} else {
															handleChatRequest();
														}
													}}
												>
													Contact to Get Quote
												</button>
											</>
										)}
									</>
								</div>
							</div>
						</div>
					</div>

					<div className="white-box">
						<div className=" d-flex flex-wrap justify-content-start gap-3">
							{statusData.map((statusDataCard: any, index: any) => (
								<StatusCard
									key={index}
									image={statusDataCard.image}
									title={statusDataCard.title}
									subtitle={statusDataCard.subtitle}
								/>
							))}
						</div>
					</div>

					{(userData?.bio ||
						userData?.tags?.length > 0 ||
						(userData?.priceRange && userData?.priceRange !== '0')) && (
						<div className="white-box">
							<div className="seller-information d-flex flex-column">
								{userData?.bio && (
									<div className="d-flex flex-column gap-3">
										<h6 className="mb-0 seller-information-heading">Bio</h6>
										<p className="mb-0 description">{userData?.bio}</p>
									</div>
								)}
								{userData?.tags?.length > 0 && (
									<div className="d-flex flex-column gap-3">
										<h6 className="mb-0 seller-information-heading">Tags Selected</h6>
										<div className="d-flex flex-wrap gap-2">
											{userData?.tags.map((item: any, index: any) => (
												<div className="custom-badges" key={index}>
													{item?.tag_name}
												</div>
											))}
										</div>
									</div>
								)}
								{userData?.priceRange && userData?.priceRange !== '0' && (
									<div className="d-flex flex-column gap-3">
										<h6 className="mb-0 seller-information-heading">Price Range</h6>
										<p className="mb-0 subtitle">
											<i className="ri-money-dollar-circle-line me-2"></i>
											{userData?.priceRange?.replace(/(\d+)\s*-\s*(\d+)/, '$$$1 - $$$2')}
										</p>
									</div>
								)}
							</div>
						</div>
					)}

					{userData?.services?.length > 0 && (
						<div className="white-box d-flex flex-column gap-3">
							<div
								className="d-flex justify-content-between section-headings align-items-center"
								onClick={() => handleTabChange('SERVICES')}
							>
								<h4 className="mb-0 main-subtitle">
									{user?.type === 'SELLER' ? 'Jobs Posted By Buyer' : 'Services'}
								</h4>
								<a className="view-link">
									View All <img src={IMAGE_PATH.viewIcon} alt="" className=" ms-2" />
								</a>
							</div>

							<Row>
								{userData?.services?.map((service: any, index: any) => (
									<Col xl={4} md={6} key={index}>
										<ServiceCard
											serviceData={service}
											isLoading={isLoading}
											isHeaderAvatar={false}
										/>
									</Col>
								))}
							</Row>
						</div>
					)}

					{userData?.resumeName && (
						<div className="white-box d-flex flex-column gap-3">
							<h4 className="mb-0 main-subtitle">Resume</h4>
							<div className="d-flex justify-content-between resume-section">
								<div className="resume-section-title">
									<i className="ri-attachment-line me-2"></i>

									{userData?.resumeName ? (
										<>
											{(() => {
												const fileName = userData?.resumeName.slice(
													0,
													userData?.resumeName.lastIndexOf('.'),
												); // Get the name without extension
												const extension = userData?.resumeName.slice(
													userData?.resumeName.lastIndexOf('.'),
												); // Get the extension

												return fileName.length > 15 ? (
													<span title={userData?.resumeName}>
														{fileName.slice(0, 15)}...{extension}
													</span>
												) : (
													userData?.resumeName
												);
											})()}
										</>
									) : (
										'Online Marketplace WireFrame Design.pdf'
									)}
								</div>
								<button className="resume-section-btn" onClick={() => handleDownload()}>
									<i className="ri-download-2-line me-2"></i> View Resume
								</button>
							</div>
						</div>
					)}

					{userData?.portfolios?.length > 0 && (
						<div className="white-box d-flex flex-column gap-3">
							<div className="d-flex justify-content-between section-headings align-items-center">
								<h4 className="mb-0 main-subtitle">Portfolio</h4>
							</div>
							<div className="image-display d-flex flex-wrap gap-3">
								{userData?.portfolios?.map((item: any) => (
									<div className="portfolio-box-display" key={item.id}>
										<div className="portfolio-item d-flex flex-column gap-3 ">
											<img src={S3_URL + item.image} alt={item.title} />
											<h3 className="portfolio-title mb-0">{item.title}</h3>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{userData?.reviews?.length > 0 && (
						<div className="white-box d-flex flex-column gap-4">
							<h4 className="mb-0 main-subtitle">
								Ratings & Reviews ({userData?.reviews?.length})
							</h4>
							{userData?.reviews?.slice(0, 5).map((item: any, index: any) => (
								<div className="d-flex flex-column gap-3 testimonial-section" key={index}>
									<div className="d-flex gap-3 align-items-center">
										<img
											src={
												item?.from?.avatar ? `${S3_URL + item?.from?.avatar}` : IMAGE_PATH.userIcon
											}
											alt=""
											className="testimonial-section-img"
										/>
										<h6 className="mb-0 testimonial-section-name">{item?.from?.fullName}</h6>
									</div>
									<div className="d-flex gap-2 align-items-center">
										<div className="d-flex testimonial-section-rating gap-1">
											{[...Array(5)].map((_, starIndex) => (
												<span key={starIndex}>
													<i
														className={`ri-star-${starIndex < item?.totalStar ? 'fill' : 'line'}`}
													></i>
												</span>
											))}
										</div>
										<span className="testimonial-section-date">{formatDate(item?.created)}</span>
									</div>
									<p className="testimonial-section-description">{item?.reviewMessage}</p>
								</div>
							))}
						</div>
					)}

					{userData?.faqs?.length > 0 && (
						<div className="white-box d-flex flex-column gap-4">
							<h4 className="mb-0 main-subtitle">FAQ</h4>
							<Accordion defaultActiveKey="0" className="faq-accordion">
								{userData?.faqs?.map((item: any, index: any) => (
									<Accordion.Item eventKey={index} key={index}>
										<Accordion.Header>{item?.question}</Accordion.Header>
										<Accordion.Body>{item?.answer}</Accordion.Body>
									</Accordion.Item>
								))}
							</Accordion>
						</div>
					)}
				</div>
			</section>
		</>
	);
};

export default SellerDetails;
