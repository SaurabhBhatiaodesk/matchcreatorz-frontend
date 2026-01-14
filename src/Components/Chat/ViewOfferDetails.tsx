import { S3_URL } from 'constants';
import { IMAGE_PATH } from 'constants/imagePaths';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	useCreateBookingMutation,
	useOfferInfoMutation,
	useOfferStatusUpdateMutation,
	useProfileListMutation,
} from 'services';
import useAuthStore, { setUserInfo } from 'store/auth';
import useCommonStore, { setModalConfig } from 'store/common';
import useSocketStore from 'store/socket';
import { setProfileData } from 'store/user';
import { handleDownload } from 'utils';
const ViewOfferDetails = ({}) => {
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const { user, token }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const [offerDetail, setOfferDetail] = useState<any>();
	const { mutateAsync: offerInfoMutation } = useOfferInfoMutation();
	const { mutateAsync: offerStatusUpdateMutation } = useOfferStatusUpdateMutation();
	const { mutateAsync: createBookingMutation } = useCreateBookingMutation();
	const { mutateAsync: profileListMutation } = useProfileListMutation();

	const navigate = useNavigate();
	const location = useLocation();
	const { activeTabType } = location.state || {};

	const { getChatHistory } = useSocketStore((state) => ({
		getChatHistory: state.getChatHistory,
	}));

	useEffect(() => {
		offerInfoData();
	}, []);

	const handleUpdateData = () => {
		getChatHistory(modalConfig?.data?.page, 20);
		offerInfoData();
	};

	const offerInfoData = () => {
		offerInfoMutation(`${modalConfig?.id}`).then((res: any) => {
			if (res?.success) {
				setOfferDetail(res?.data);
			}
		});
	};

	const handleOfferStatus = (id: any, status: any) => {
		offerStatusUpdateMutation(`${id}?status=${status}`).then((res: any) => {
			if (res?.success) {
				toast.success(res?.message);
				handleUpdateData();
			}
		});
	};

	const handleCounterOffer = () => {
		setModalConfig({
			visible: true,
			id: offerDetail?.id,
			type: 'counterSent',
			onClick: handleUpdateData,
		});
	};

	const handleViewProfile = (id: string) => {
		if (user?.type === 'SELLER' || activeTabType === 'BUYER') {
			navigate(`/buyer-details/${id}`, { state: { activeTabType: activeTabType } });
		} else {
			navigate(`/seller-details/${id}`, { state: { activeTabType: activeTabType } });
		}
	};
	const isReceiver = offerDetail?.offerBy !== user?.type;

	const handleBuyService = (id: any) => {
		const payload = { offerId: id };
		createBookingMutation(payload).then((res: any) => {
			if (res?.success) {
				toast.success(res?.message);
				handleUpdateData();
				profileListMutation().then((res: any) => {
					if (res?.success) {
						setProfileData(res?.data?.user);
						setUserInfo({ token: token, user: res?.data?.user });
					}
				});
			}
		});
	};
	return (
		<>
			<button className="modal-close-btn border-0 p-0" onClick={() => hideCommonModal()}>
				<i className="ri-close-line"></i>
			</button>
			<Modal.Body>
				<div className="d-flex flex-column gap-3">
					<div className="modal-detail-box">
						<div className="d-flex flex-column gap-2 offer-details">
							<div className="d-flex justify-content-between align-items-center">
								<div className="d-flex gap-3 align-items-center">
									<h4 className="offer-details-name mb-0">Offer ID#{offerDetail?.id}</h4>

									{offerDetail?.status === 'Pending' ? (
										<div className="offer-details-status">
											<i className="ri-timer-2-line me-1"></i>
											{offerDetail?.status}
										</div>
									) : offerDetail?.status === 'Withdrawn' ? (
										<div className="offer-details-status ">{offerDetail?.status}</div>
									) : offerDetail?.status === 'Accepted' ? (
										<div className="offer-details-status green-bg">
											<i className="ri-check-line me-1"></i>
											{offerDetail?.status}
										</div>
									) : offerDetail?.status === 'Rejected' ? (
										<div className="offer-details-status red-bg">{offerDetail?.status}</div>
									) : null}
								</div>

								<span
									className={`offer-details-statuscheck ${offerDetail?.paymentStatus === 'Paid' ? 'green' : ''} `}
								>
									{offerDetail?.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid'}
								</span>
							</div>
							<div className="offer-details-subtitle">{offerDetail?.title}</div>
							<span className="offer-details-designation">
								{user?.type === 'BUYER'
									? offerDetail?.seller?.category?.title
									: offerDetail?.category?.title}
							</span>
							<span className="offer-details-location">
								<i className="ri-map-pin-2-line"></i>
								{user?.type === 'BUYER'
									? offerDetail?.country?.countryName
									: offerDetail?.seller?.country?.countryName}
							</span>

							{offerDetail?.counterBy && offerDetail?.isCounter === true ? (
								<></>
							) : (
								<>
									{offerDetail?.status === 'Pending' && (
										<div className="d-flex flex-wrap gap-3">
											{!isReceiver && !offerDetail?.counterPrice && (
												<button
													className="job-details-content-btn red-bg"
													onClick={() => handleOfferStatus(offerDetail?.id, 'WithDrawn')}
												>
													Withdraw Offer
												</button>
											)}

											{!offerDetail?.counterPrice && isReceiver && (
												<>
													<button
														className="job-details-content-btn"
														onClick={() => handleOfferStatus(offerDetail?.id, 'Rejected')}
													>
														Reject
													</button>
													<button
														className="job-details-content-btn red-border"
														onClick={() => handleOfferStatus(offerDetail?.id, 'Accepted')}
													>
														Accept
													</button>
													<button
														className="job-details-content-btn red-bg"
														onClick={() => handleCounterOffer()}
													>
														Counter
													</button>
												</>
											)}

											{offerDetail?.counterPrice && !isReceiver && (
												<>
													<button
														className="job-details-content-btn"
														onClick={() => handleOfferStatus(offerDetail?.id, 'Rejected')}
													>
														Reject
													</button>
													<button
														className="job-details-content-btn red-border"
														onClick={() => handleOfferStatus(offerDetail?.id, 'Accepted')}
													>
														Accept
													</button>
												</>
											)}
										</div>
									)}

									{offerDetail?.paymentStatus === 'Pending' &&
										offerDetail?.status === 'Accepted' &&
										user?.type === 'BUYER' && (
											<button
												className="job-details-content-btn red-bg"
												onClick={() => handleBuyService(offerDetail?.id)}
											>
												Make Payment
											</button>
										)}

									{offerDetail?.status === 'Accepted' && offerDetail?.paymentStatus === 'Paid' && (
										<button
											className="job-details-content-btn red-bg"
											onClick={(e) => {
												if (offerDetail?.bookingId) {
													navigate(`/booking-details/${offerDetail.bookingId}`);
												} else {
													e.preventDefault();
												}
											}}
										>
											Go to Booking
										</button>
									)}
								</>
							)}
						</div>
					</div>
					<div className="modal-detail-box">
						<h4 className="modal-subtitle mb-3">
							{user?.type === 'BUYER' ? 'Seller' : 'Buyer'} Details
						</h4>
						<div className="d-flex flex-column gap-2 offer-details">
							<div className="d-flex gap-3 align-items-start">
								<img
									src={
										(user?.type === 'BUYER' && offerDetail?.seller?.avatar) ||
										(user?.type === 'SELLER' && offerDetail?.buyer?.avatar)
											? `${S3_URL}${
													user?.type === 'BUYER'
														? offerDetail.seller.avatar
														: offerDetail.buyer.avatar
												}`
											: IMAGE_PATH.userIcon
									}
									alt=""
									className="offer-details-img"
									onClick={() =>
										handleViewProfile(
											user?.type === 'BUYER' ? offerDetail?.seller?.id : offerDetail?.buyer?.id,
										)
									}
									style={{ cursor: 'pointer' }}
								/>
								<div className="d-flex flex-column gap-2">
									<h6
										className="offer-details-username mb-0"
										onClick={() =>
											handleViewProfile(
												user?.type === 'BUYER' ? offerDetail?.seller?.id : offerDetail?.buyer?.id,
											)
										}
										style={{ cursor: 'pointer' }}
									>
										{user?.type === 'BUYER'
											? offerDetail?.seller?.fullName
											: offerDetail?.buyer?.fullName}
									</h6>
									<span className="offer-details-designation">
										{user?.type === 'BUYER'
											? offerDetail?.seller?.category?.title
											: offerDetail?.category?.title}
									</span>
									{offerDetail?.seller?.avgRating?.length > 0 ||
									offerDetail?.buyer?.avgRating?.length > 0 ? (
										<>
											<div className="offer-details-status">
												<i className="ri-star-fill"></i>{' '}
											</div>
											{user?.type === 'BUYER'
												? offerDetail?.seller?.avgRating
												: offerDetail?.buyer?.avgRating}
										</>
									) : null}
								</div>
							</div>
						</div>
					</div>
					<div className="modal-detail-box">
						<div className="offer-details d-flex flex-column gap-4">
							<div className="d-flex flex-column gap-3 ">
								<h6 className="mb-0 modal-subtitle">Description</h6>
								<p className="mb-0 description">{offerDetail?.description}</p>
							</div>
							<div className="d-flex flex-column gap-3">
								<h6 className="mb-0 modal-subtitle">Budget (By {offerDetail?.offerBy})</h6>
								<p className="mb-0 price">
									<i className="ri-money-dollar-circle-line me-2"></i> ${offerDetail?.price}
								</p>
							</div>
							{offerDetail?.counterPrice > 0 ? (
								<div className="d-flex flex-column gap-3">
									<h6 className="mb-0 modal-subtitle">Counter (By {offerDetail?.counterBy})</h6>
									<p className="mb-0 price">
										<i className="ri-money-dollar-circle-line me-2"></i> $
										{offerDetail?.counterPrice}
									</p>
								</div>
							) : null}
						</div>
					</div>
					<div className="modal-detail-box">
						<h4 className="mb-3 modal-subtitle">Document</h4>
						{offerDetail?.offerDocument?.map((document: any) => (
							<div
								key={document?.id}
								className="d-flex justify-content-between resume-section mb-3"
							>
								<div className="resume-section-title">
									<i className="ri-attachment-line me-2"></i>
									{document?.name ? (
										<>
											{(() => {
												const fileName = document.name.slice(0, document.name.lastIndexOf('.')); // Get the name without extension
												const extension = document.name.slice(document.name.lastIndexOf('.')); // Get the extension

												return fileName.length > 15 ? (
													<span title={document.name}>
														{fileName.slice(0, 15)}...{extension}
													</span>
												) : (
													document.name
												);
											})()}
										</>
									) : (
										'Online Marketplace WireFrame Design.pdf'
									)}
								</div>
								<button
									className="resume-section-btn"
									onClick={() => handleDownload(document?.url)}
								>
									<i className="ri-download-2-line me-2"></i>View Document
								</button>
							</div>
						))}
					</div>
					<div className="modal-detail-box">
						<div className="d-flex flex-column  gap-3 w-100">
							<h4 className="mb-0 modal-subtitle">Images</h4>
							<div className="image-display d-flex  gap-3">
								{offerDetail?.offerImage?.map((item: any, index: any) => (
									<img
										key={index}
										src={offerDetail?.offerImage ? `${S3_URL}${item?.url}` : ''}
										alt=""
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</Modal.Body>
		</>
	);
};

export default ViewOfferDetails;
