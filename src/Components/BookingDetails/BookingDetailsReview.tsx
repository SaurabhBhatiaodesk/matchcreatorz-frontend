import React from 'react';
import { Rating } from 'react-simple-star-rating';

interface BookingDetailsReviewProps {
	bookingData: any;
	user: any;
	onReview: () => void;
}

const BookingDetailsReview: React.FC<BookingDetailsReviewProps> = ({
	bookingData,
	user,
	onReview,
}) => {
	return (
		<div className="white-box">
			<div className="user-information d-flex flex-column">
				<div className="d-flex flex-column gap-3">
					{bookingData?.isRated === true ? (
						<>
							<h6 className="mb-0 user-information-heading">Review</h6>
							<Rating
								initialValue={bookingData?.review?.totalStar}
								allowHover={false}
								disableFillHover={false}
							/>
							<p className="mb-0 main-description">{bookingData?.review?.reviewMessage}</p>
						</>
					) : user?.type === 'BUYER' ? (
						<>
							<h6 className="mb-0 user-information-heading">Review</h6>
							<button
								className="job-details-content-btn red-bg"
								onClick={(e) => {
									e.stopPropagation();
									onReview();
								}}
							>
								Write a Review
							</button>
						</>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default BookingDetailsReview;
