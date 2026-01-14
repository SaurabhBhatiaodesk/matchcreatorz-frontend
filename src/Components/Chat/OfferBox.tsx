import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
	useCreateBookingMutation,
	useOfferStatusUpdateMutation,
	useProfileListMutation,
} from 'services';
import useAuthStore, { setUserInfo } from 'store/auth';
import { setModalConfig } from 'store/common';
import useSocketStore from 'store/socket';
import { setProfileData } from 'store/user';

interface OfferBoxProps {
	offerMessages: any;
	page: number;
}

const OfferBox: React.FC<OfferBoxProps> = ({ offerMessages, page }) => {
	const navigate = useNavigate();
	const { user, token }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const { mutateAsync: offerStatusUpdateMutation } = useOfferStatusUpdateMutation();
	const { mutateAsync: profileListMutation } = useProfileListMutation();
	const { mutateAsync: createBookingMutation } = useCreateBookingMutation();

	const { getChatHistory, getUserChatList } = useSocketStore((state) => ({
		getChatHistory: state.getChatHistory,
		getUserChatList: state.getUserChatList,
	}));

	const handleUpdateData = () => {
		getChatHistory(page, 20);
		getUserChatList(page, 20);
	};

	const handleOfferStatus = (id: any, status: any) => {
		offerStatusUpdateMutation(`${id}?status=${status}`).then((res: any) => {
			if (res?.success) {
				toast.success(res?.message);
				handleUpdateData();
				if (status === 'Accepted') {
					profileListMutation().then((res: any) => {
						if (res?.success) {
							setProfileData(res?.data?.user);
							setUserInfo({ token: token, user: res?.data?.user });
						}
					});
				}
			}
		});
	};

	const handleViewOffer = () => {
		setModalConfig({
			visible: true,
			id: offerMessages?.offer?.id,
			type: 'viewOfferDetails',
			data: { page },
		});
	};

	const handleCounterOffer = () => {
		setModalConfig({
			visible: true,
			id: offerMessages?.offer?.id,
			type: 'counterSent',
			onClick: handleUpdateData,
		});
	};

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
	const isReceiver = offerMessages?.receiverType === user?.type;

	return (
		<>
			{offerMessages?.offer?.counterBy && offerMessages?.isCounter === true ? (
				<>
					<div
						className={`${user?.type === offerMessages?.senderType ? 'offer-box' : 'left-side-box'}`}
					>
						<>
							{(offerMessages?.offer?.status === 'Pending' ||
								offerMessages?.offer?.status === 'Accepted' ||
								offerMessages?.offer?.status === 'Rejected') && (
								<div className="d-flex flex-column gap-3">
									<div className="d-flex flex-column gap-1">
										<span className="content-title">Offer ID#{offerMessages?.offer?.id}</span>
										{offerMessages?.offer?.status === 'Pending' && (
											<span className="content-title">
												{isReceiver ? 'Counter offer received' : 'Counter offer sent'}
											</span>
										)}
										{(offerMessages?.offer?.status === 'Accepted' ||
											offerMessages?.offer?.status === 'Rejected') && (
											<span className="content-title">
												Counter offer{' '}
												{offerMessages?.offer?.status === 'Rejected' ? 'Rejected' : 'Accepted'} by{' '}
												{offerMessages?.receiverType}
											</span>
										)}
									</div>
									<div className="d-flex gap-3 flex-wrap mb-2">
										<button className="with-border-btn" onClick={() => handleViewOffer()}>
											Tap to see offer
										</button>
										{(offerMessages?.offer?.status === 'Accepted' ||
											offerMessages?.offer?.status === 'Rejected') &&
											offerMessages?.paymentStatus === 'Paid' && (
												<button
													className="with-bg-btn"
													onClick={(e) => {
														if (offerMessages?.bookingId) {
															navigate(`/booking-details/${offerMessages.bookingId}`);
														} else {
															e.preventDefault();
														}
													}}
												>
													Go to Booking
												</button>
											)}
									</div>
								</div>
							)}
						</>
					</div>
				</>
			) : (
				<div
					className={`${user?.type === offerMessages?.senderType ? 'offer-box' : 'left-side-box'}`}
				>
					<h6 className=" title text-center">Offer ID#{offerMessages?.offer?.id}</h6>
					<div className="d-flex justify-content-between mb-2 align-items-center">
						<h6 className="mb-0 heading">{offerMessages?.offer?.title}</h6>
						<span className="arrow" onClick={() => handleViewOffer()} style={{ cursor: 'pointer' }}>
							<i className="ri-arrow-right-line"></i>
						</span>
					</div>
					<p className="mb-2 description">{offerMessages?.offer?.description}</p>
					<div className="d-flex justify-content-between mb-3 flex-wrap gap-3">
						<div className="d-flex gap-2 align-items-start">
							<span className="icon">
								<i className="ri-money-dollar-circle-fill"></i>
							</span>
							<div className="d-flex flex-column">
								<span className="small-heading">Budget (By {offerMessages?.offer?.offerBy})</span>
								<span className="content">${offerMessages?.offer?.price}</span>
							</div>
						</div>
						<div className="d-flex gap-2 align-items-start">
							<span className="icon">
								<i className="ri-time-fill"></i>
							</span>
							<div className="d-flex flex-column">
								<span className="small-heading">Status of offer</span>
								<span className="content">{offerMessages?.offer?.status}</span>
							</div>
						</div>

						{offerMessages?.offer?.counterPrice && (
							<>
								<div className="d-flex gap-2 align-items-start">
									<span className="icon">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
										>
											<path
												d="M20.5013 12.3473C20.5842 12.3473 20.6637 12.3143 20.7223 12.2557C20.7809 12.1971 20.8139 12.1176 20.814 12.0347C20.814 11.8623 20.6737 11.7221 20.5013 11.7221C20.3289 11.7221 20.1887 11.8624 20.1887 12.0347C20.1887 12.2071 20.3289 12.3473 20.5013 12.3473ZM20.5013 8.25356C20.8434 8.25356 21.1217 7.97522 21.1217 7.63312V6.75H19.8809V7.63308C19.8809 7.97522 20.1592 8.25356 20.5013 8.25356ZM20.5013 13.3786C20.1592 13.3786 19.8809 13.6569 19.8809 13.999C19.8809 14.3411 20.1592 14.6195 20.5013 14.6195C20.8434 14.6195 21.1217 14.3411 21.1217 13.999C21.1217 13.6569 20.8434 13.3786 20.5013 13.3786Z"
												fill="white"
											/>
											<path
												d="M22.1541 6.75V7.63308C22.1541 8.54381 21.4132 9.28477 20.5025 9.28477C19.5917 9.28477 18.8508 8.54381 18.8508 7.63308V6.75H16.6743V17.2661H24.0004V6.75H22.1541ZM20.5025 15.6507C19.5917 15.6507 18.8508 14.9098 18.8508 13.999C18.8508 13.5181 19.0574 13.0847 19.3865 12.7826C19.2377 12.5616 19.1583 12.3012 19.1586 12.0347C19.1586 11.2937 19.7615 10.6909 20.5025 10.6909C21.2435 10.6909 21.8463 11.2937 21.8463 12.0347C21.8466 12.3012 21.7672 12.5617 21.6184 12.7827C21.9474 13.0848 22.1541 13.5182 22.1541 13.9991C22.1541 14.9098 21.4132 15.6507 20.5025 15.6507ZM3.45247 10.4792C3.11037 10.4792 2.83203 10.7575 2.83203 11.0996V12.9165C2.83203 13.2586 3.11037 13.5369 3.45247 13.5369C3.79456 13.5369 4.07291 13.2586 4.07291 12.9165V11.0996C4.07291 10.7575 3.79456 10.4792 3.45247 10.4792Z"
												fill="white"
											/>
											<path
												d="M0 6.75V17.2661H7.25733V6.75H0ZM5.1038 12.9165C5.1038 13.8272 4.36284 14.5682 3.45211 14.5682C2.54137 14.5682 1.80042 13.8272 1.80042 12.9165V11.0996C1.80042 10.1889 2.54137 9.44794 3.45211 9.44794C4.36284 9.44794 5.1038 10.1889 5.1038 11.0996V12.9165ZM8.66358 6.75V17.2661H15.2677V6.75H8.66358ZM13.6517 12.9165C13.6517 13.8272 12.9107 14.5682 12 14.5682C11.0893 14.5682 10.3483 13.8272 10.3483 12.9165V11.0996C10.3483 10.1889 11.0893 9.44794 12 9.44794C12.9107 9.44794 13.6517 10.1889 13.6517 11.0996V12.9165Z"
												fill="white"
											/>
											<path
												d="M12 10.4792C11.6579 10.4792 11.3796 10.7575 11.3796 11.0996V12.9165C11.3796 13.2586 11.6579 13.5369 12 13.5369C12.3421 13.5369 12.6204 13.2586 12.6204 12.9165V11.0996C12.6204 10.7575 12.3421 10.4792 12 10.4792ZM23.2969 20.8125H0.703125C0.314812 20.8125 0 20.4977 0 20.1094V18.6724H24V20.1094C24 20.4977 23.6852 20.8125 23.2969 20.8125ZM24 5.34375H0V3.89062C0 3.50231 0.314812 3.1875 0.703125 3.1875H23.2969C23.6852 3.1875 24 3.50231 24 3.89062V5.34375Z"
												fill="white"
											/>
										</svg>
									</span>

									<div className="d-flex flex-column">
										<span className="small-heading">
											Counter (By {offerMessages?.offer?.counterBy})
										</span>
										<span className="content">${offerMessages?.offer?.counterPrice}</span>
									</div>
								</div>
							</>
						)}

						{offerMessages?.offer?.status === 'Accepted' && (
							<div className="d-flex gap-2 align-items-start">
								<span className="icon">
									<i className="ri-checkbox-circle-fill"></i>
								</span>
								<div className="d-flex flex-column">
									<span className="small-heading">Payment Status</span>
									<span className="content">
										{offerMessages?.offer?.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid'}
									</span>
								</div>
							</div>
						)}
					</div>

					{offerMessages?.offer?.status === 'Pending' && (
						<div className="d-flex gap-3 flex-wrap mb-2">
							{!isReceiver && !offerMessages?.offer?.counterPrice && (
								<button
									className="full-btn"
									onClick={() => handleOfferStatus(offerMessages?.offerId, 'WithDrawn')}
								>
									Withdraw Offer
								</button>
							)}

							{!offerMessages?.offer?.counterPrice && isReceiver && (
								<>
									<button
										className="with-border-btn"
										style={{
											border: '1px solid #F3F3F3',
										}}
										onClick={() => handleOfferStatus(offerMessages?.offerId, 'Rejected')}
									>
										Reject
									</button>
									<button
										className="with-border-btn"
										onClick={() => handleOfferStatus(offerMessages?.offerId, 'Accepted')}
									>
										Accept
									</button>
									<button className=" with-bg-btn" onClick={() => handleCounterOffer()}>
										Counter
									</button>
								</>
							)}

							{offerMessages?.offer?.counterPrice && !isReceiver && (
								<>
									<button
										className="with-border-btn"
										onClick={() => handleOfferStatus(offerMessages?.offerId, 'Rejected')}
									>
										Reject
									</button>
									<button
										className="with-bg-btn"
										onClick={() => handleOfferStatus(offerMessages?.offerId, 'Accepted')}
									>
										Accept
									</button>
								</>
							)}
						</div>
					)}

					{offerMessages?.offer?.paymentStatus === 'Pending' &&
						offerMessages?.offer?.status === 'Accepted' &&
						user?.type === 'BUYER' && (
							<button
								className="with-bg-btn"
								onClick={() => handleBuyService(offerMessages?.offerId)}
							>
								Make Payment
							</button>
						)}

					{offerMessages?.offer?.status === 'Accepted' &&
						offerMessages?.offer?.paymentStatus === 'Paid' && (
							<button
								className="with-bg-btn"
								onClick={(e) => {
									if (offerMessages?.bookingId) {
										navigate(`/booking-details/${offerMessages.bookingId}`);
									} else {
										e.preventDefault();
									}
								}}
							>
								Go to Booking
							</button>
						)}
				</div>
			)}
		</>
	);
};

export default OfferBox;
