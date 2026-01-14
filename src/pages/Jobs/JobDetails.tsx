import { ViewDetails } from 'components';
import { IMAGE_PATH } from 'constants/imagePaths';
import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetServiceInfoMutation } from 'services';
import useAuthStore from 'store/auth';
import { setModalConfig } from 'store/common';
import { formatRelativeDate, handleViewProfile } from 'utils';
import './style.scss';
import { S3_URL } from 'constants/index';

const JobDetails: React.FC = () => {
	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const { id } = useParams<any>();
	const [jobData, setJobData] = useState<any>();
	const { mutateAsync: getServiceInfoMutation } = useGetServiceInfoMutation({ userType: 'BUYER' });

	useEffect(() => {
		getJobData();
	}, [id]);

	const getJobData = () => {
		getServiceInfoMutation(`${id}?userId=${user?.id}`)
			.then((res: any) => {
				if (res?.success) {
					setJobData(res?.data);
				} else {
					navigate(-1);
				}
			})
			.catch(() => {
				navigate(-1);
			});
	};

	const handleChatRequest = (userId: number) => {
		setModalConfig({
			visible: true,
			id: userId,
			type: 'chatRequest',
		});
	};

	const navigate = useNavigate();

	const handleClick = (itemId: number) => {
		navigate(`/booking-details/${itemId}`);
	};

	const handleOfferRejectAccept = (bidId: string, status: string) => {
		setModalConfig({
			visible: true,
			id: jobData?.id,
			type: 'offerRejectAccept',
			onClick: getJobData,
			data: { bidId, status },
		});
	};

	const onUserProfileClick = (id: string) => {
		handleViewProfile(id, navigate, user?.type);
	};

	return (
		<section className="job-details d-flex flex-column">
			<ViewDetails
				userData={jobData}
				headerTitle={user?.type === 'BUYER' ? 'Job Detail' : 'Service Detail'}
				type=""
				getJobData={getJobData}
			/>
			{user?.type === 'BUYER' ? (
				<>
					{jobData?.recievedBids?.length > 0 && (
						<div className="white-box d-flex flex-column gap-3 bid-section">
							<h4 className="mb-0 main-subtitle">Bids ({jobData?.recievedBid ?? 0} received)</h4>
							<div className="table-responsive">
								<Table>
									<tbody>
										{jobData?.recievedBids?.map((item: any, index: any) => (
											<tr className="align-middle" key={index}>
												<td>
													<div className="d-flex gap-3 align-items-center">
														<img
															src={
																item?.user?.avatar
																	? `${S3_URL + item?.user?.avatar}`
																	: IMAGE_PATH.userIcon
															}
															alt=""
															className="bid-section-profile-img"
															onClick={() => onUserProfileClick(item?.userId)}
														/>
														<div className="d-flex flex-column gap-1">
															<h6
																className="mb-0 bid-section-title"
																onClick={() => onUserProfileClick(item?.userId)}
															>
																{item?.user?.fullName}
															</h6>
															<span className="bid-section-designation">
																{item?.user?.category?.title}
															</span>
														</div>
													</div>
												</td>
												<td className="bid-section-date">
													{formatRelativeDate(item?.created, false)}
												</td>
												<td className="bid-section-price">${item?.bidAmount}</td>
												<td>
													<div className="d-flex gap-2 justify-content-end">
														{item?.type === 'Rejected' && (
															<button
																className={`bid-section-btn red disabled`}
																disabled={true}
																onClick={() => handleOfferRejectAccept(item?.id, 'REJECT')}
															>
																<i className="ri-close-fill me-1"></i>{' '}
																{item?.type === 'Rejected' ? 'Rejected' : 'Reject'}
															</button>
														)}

														{item?.type === 'Accepted' && (
															<button
																className={`bid-section-btn green disabled`}
																disabled={true}
																onClick={() => handleOfferRejectAccept(item?.id, 'ACCEPT')}
															>
																<i className="ri-check-fill me-1"></i>{' '}
																{item?.type === 'Accepted' ? 'Accepted' : 'Accept'}
															</button>
														)}

														{item?.type !== 'Rejected' && item?.type !== 'Accepted' && (
															<>
																<button
																	className={`bid-section-btn red ${jobData?.status === 'Closed' ? 'disabled' : ''}`}
																	disabled={jobData?.status === 'Closed'}
																	onClick={() => handleOfferRejectAccept(item?.id, 'REJECT')}
																>
																	<i className="ri-close-fill me-1"></i> Reject
																</button>

																<button
																	className={`bid-section-btn green ${jobData?.status === 'Closed' ? 'disabled' : ''}`}
																	disabled={jobData?.status === 'Closed'}
																	onClick={() => handleOfferRejectAccept(item?.id, 'ACCEPT')}
																>
																	<i className="ri-check-fill me-1"></i>
																	{jobData?.status === 'Accepted' ? 'Accepted' : 'Accept'}
																</button>
															</>
														)}
														<button
															className={`bid-section-btn red-fill`}
															onClick={() => {
																if (item?.isChatConnected || item?.isChatRequested) {
																	navigate(`/chat-listing`, {
																		state: {
																			id: item?.userId,
																			activeTabType: item?.isChatRequested
																				? 'requestSent'
																				: 'chats',
																		},
																	});
																} else {
																	handleChatRequest(item?.userId);
																}
															}}
														>
															<i className="ri-chat-3-line me-1"></i> Contact
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</Table>
							</div>
						</div>
					)}
				</>
			) : (
				<>
					{jobData?.buyerHistory?.length > 0 && (
						<div className="white-box d-flex flex-column gap-3 bid-section">
							<h4 className="mb-0 main-subtitle">Buyer History</h4>
							<div className="table-responsive">
								<Table>
									<tbody>
										{jobData?.buyerHistory?.map((item: any, index: any) => (
											<tr className="align-middle" key={index}>
												<td>
													<div
														className="d-flex gap-3 align-items-center"
														onClick={() => onUserProfileClick(item?.buyer?.id)}
													>
														<img
															src={
																item?.buyer?.avatar
																	? `${S3_URL + item?.buyer?.avatar}`
																	: IMAGE_PATH.userIcon
															}
															alt=""
															className="bid-section-profile-img"
														/>
														<div className="d-flex flex-column gap-1">
															<h6
																className="mb-0 bid-section-title"
																onClick={() => onUserProfileClick(item?.buyer?.id)}
															>
																{item?.buyer?.fullName}
															</h6>
														</div>
													</div>
												</td>
												<td className="bid-section-date">
													{formatRelativeDate(item?.created, false)}
												</td>
												<td className="bid-section-price">${item?.totalAmount}</td>
												<td>
													<div className="d-flex gap-2 justify-content-end">
														<button
															className="bid-section-btn bg-green"
															onClick={() => handleClick(item?.id)}
														>
															<i className="ri-check-fill me-1"></i> Go to Booking
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</Table>
							</div>
						</div>
					)}
				</>
			)}
		</section>
	);
};

export default JobDetails;
