import { IMAGE_PATH } from 'constants/imagePaths';
import { S3_URL } from 'constants/index';
import { useNavigate } from 'react-router-dom';
import useAuthStore from 'store/auth';
import { setModalConfig } from 'store/common';
import { formatRelativeDate, handleViewProfile } from 'utils';
interface BookingListProps {
	bookingData: any;
	activeTab: string;
	handleBookingData: any;
}
const BookingCard: React.FC<BookingListProps> = ({ bookingData, activeTab, handleBookingData }) => {
	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const navigate = useNavigate();

	const handleClick = (itemId: number) => {
		navigate(`/booking-details/${itemId}`);
	};

	const handleCancelBooking = (type: any) => {
		setModalConfig({
			visible: true,
			id: bookingData?.id,
			type: 'counterAmount',
			onClick: handleBookingData,
			data: { type, bookingData },
		});
	};

	const handleCompleteBooking = () => {
		setModalConfig({
			visible: true,
			id: bookingData?.id,
			type: 'bookingComplete',
			onClick: handleBookingData,
		});
	};

	const handleReviewBooking = () => {
		setModalConfig({
			visible: true,
			id: bookingData?.id,
			type: 'bookingReview',
			onClick: handleBookingData,
		});
	};

	const onUserProfileClick = () => {
		handleViewProfile(
			user?.type === 'SELLER' ? bookingData?.buyerId : bookingData?.sellerId,
			navigate,
			user?.type,
		);
	};
	return (
		<div className="job-posted">
			<div
				className="white-box d-flex flex-column gap-3 h-100"
				onClick={() => handleClick(bookingData?.id)}
			>
				<h6 className="job-posted-id mb-0">
					BookingID <span>#{bookingData?.id}</span>
				</h6>
				<div className="d-flex justify-content-between align-items-center">
					<h5 className="job-posted-title mb-0">{bookingData?.title}</h5>
					{activeTab === 'Active' ? (
						<>
							{bookingData?.status === 'Ongoing' ? (
								<div className="badges">{bookingData?.status}</div>
							) : bookingData?.status === 'Amidst-Cancellation' ? (
								<div className="badges red">{bookingData?.status}</div>
							) : bookingData?.status === 'Amidst-Completion-Process' ? (
								<div className="badges yellow">{bookingData?.status}</div>
							) : bookingData?.status === 'In-dispute' ? (
								<div className="badges blue">{bookingData?.status}</div>
							) : null}
						</>
					) : null}
				</div>
				<p className="job-posted-description ">
					{bookingData?.description.length > 35 ? (
						<>
							{`${bookingData?.description.slice(0, 35)}`}
							<a className="more-link">...</a>
						</>
					) : (
						bookingData?.description
					)}
				</p>
				<div className="d-flex flex-wrap gap-3 job-posted-details  ">
					<span>
						<i className="ri-map-pin-2-line"></i>
						{bookingData?.country?.countryName?.length > 9 ? (
							<>
								{bookingData?.country?.countryName.slice(0, 9)}
								<a className="more-link">...</a>
							</>
						) : (
							bookingData?.country?.countryName
						)}
					</span>
					<span>
						<i className="ri-calendar-line"></i>
						{formatRelativeDate(bookingData?.created, false)}
					</span>
					<span>
						<i className="ri-money-dollar-circle-line"></i>${bookingData?.totalAmount}
					</span>
				</div>
				<div className="user-detail d-flex gap-2 align-items-center ">
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
						className="user-detail-images"
						onClick={(event) => {
							event.stopPropagation();
							onUserProfileClick();
						}}
					/>
					<p
						className="name mb-0"
						onClick={(event) => {
							event.stopPropagation();
							onUserProfileClick();
						}}
					>
						{user?.type === 'BUYER' ? (
							<>{bookingData?.seller?.fullName}</>
						) : (
							<>{bookingData?.buyer?.fullName}</>
						)}
					</p>
				</div>
				<div className="d-flex gap-2 flex-wrap mt-auto">
					{activeTab === 'Active' ? (
						<>
							<button
								className={`primary-btn ${bookingData?.status === 'In-dispute' || bookingData?.status === 'Amidst-Cancellation' ? 'disabled' : ' '}`}
								disabled={
									bookingData?.status === 'In-dispute' ||
									bookingData?.status === 'Amidst-Cancellation'
										? true
										: false
								}
								onClick={(e) => {
									e.stopPropagation();
									handleCancelBooking('Cancelled');
								}}
							>
								Cancel
							</button>
							<button
								className={`secondary-btn ${bookingData?.status !== 'Ongoing' ? 'disabled' : ' '}`}
								disabled={bookingData?.status === 'Ongoing' ? false : true}
								onClick={(e) => {
									e.stopPropagation();
									handleCompleteBooking();
								}}
							>
								Mark as complete
							</button>
						</>
					) : activeTab === 'Completed' && user?.type === 'BUYER' ? (
						<button
							className={`secondary-btn mw-100 ${bookingData?.isRated === true ? 'disabled' : ' '}`}
							disabled={bookingData?.isRated === true ? true : false}
							onClick={(e) => {
								e.stopPropagation();
								handleReviewBooking();
							}}
						>
							{bookingData?.isRated === true ? 'Review Submitted' : 'Write a Review'}
						</button>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default BookingCard;
