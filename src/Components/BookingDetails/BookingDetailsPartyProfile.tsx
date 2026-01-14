import { FavoriteBtn } from 'components/Common';
import { IMAGE_PATH } from 'constants/imagePaths';
import { S3_URL } from 'constants/index';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleViewProfile } from 'utils';

interface BookingDetailsPartyProfileProps {
	bookingData: any;
	user: any;
	isReported: any;
	onReport: () => void;
	onChatRequest: (userId: number) => void;
}

const BookingDetailsPartyProfile: React.FC<BookingDetailsPartyProfileProps> = ({
	bookingData,
	user,
	isReported,
	onReport,
	onChatRequest,
}) => {
	const navigate = useNavigate();
	const onUserProfileClick = () => {
		handleViewProfile(
			user.type === 'SELLER' ? bookingData?.buyerId : bookingData?.sellerId,
			navigate,
			user.type,
		);
	};

	return (
		<div className="white-box d-flex gap-4 flex-column job-details-content">
			<h4 className="mb-0 sub-heading">
				{user?.type === 'BUYER' ? 'Seller Details' : 'Buyer Details'}
			</h4>
			<div className="seller-profile d-flex gap-3">
				<img
					src={
						user?.type === 'BUYER'
							? bookingData?.seller?.avatar
								? `${S3_URL + bookingData.seller.avatar}`
								: IMAGE_PATH.userIcon
							: bookingData?.buyer?.avatar
								? `${S3_URL + bookingData.buyer.avatar}`
								: IMAGE_PATH.userIcon
					}
					alt=""
					className="profile-img"
					onClick={() => onUserProfileClick()}
				/>
				<div className="d-flex flex-column gap-2 w-100">
					<div className="d-flex gap-2 align-items-center">
						<h4 className="job-details-content-name mb-0" onClick={() => onUserProfileClick()}>
							{user?.type === 'BUYER' ? (
								<>{bookingData?.seller?.fullName}</>
							) : (
								<>{bookingData?.buyer?.fullName}</>
							)}
						</h4>
						{user?.type === 'BUYER' && bookingData?.seller?.avgRating > 0 && (
							<div className="job-details-content-rating">
								<i className="ri-star-fill"></i>
								{bookingData?.seller?.avgRating}
							</div>
						)}
					</div>
					<span className="job-details-content-designation">
						{user?.type === 'BUYER' ? (
							<>{bookingData?.seller?.category?.title}</>
						) : (
							<>{bookingData?.buyer?.category?.title}</>
						)}
					</span>
					<span className="job-details-content-location">
						<i className="ri-map-pin-2-line"></i>
						{user?.type === 'BUYER' ? (
							<>
								{bookingData?.seller?.state?.stateName},{bookingData?.seller?.country?.countryName}
							</>
						) : (
							<>
								{bookingData?.buyer?.state?.stateName},{bookingData?.buyer?.country?.countryName}
							</>
						)}
					</span>
					<div className="d-flex flex-wrap gap-3">
						<button
							className={`job-details-content-btn ${isReported === true ? 'disabled' : ''}`}
							disabled={isReported === true ? true : false}
							onClick={() => onReport()}
						>
							<i className={`ri-flag-2-line me-2`}></i> Report
						</button>
						{user?.type === 'BUYER' && (
							<>
								{bookingData && (
									<FavoriteBtn
										isEnabled={bookingData.isFavourite}
										userId={bookingData.seller?.id}
										isButton={true}
									/>
								)}

								<button
									className="job-details-content-btn red-bg"
									onClick={() => {
										if (bookingData?.isChatRequested || bookingData?.isChatConnected) {
											navigate('/chat-listing', {
												state: {
													id: bookingData?.sellerId,
													activeTabType:
														bookingData?.isChatRequested && !bookingData?.isChatConnected
															? 'requestSent'
															: 'chats',
												},
											});
										} else {
											onChatRequest(bookingData?.sellerId);
										}
									}}
								>
									Contact
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookingDetailsPartyProfile;
