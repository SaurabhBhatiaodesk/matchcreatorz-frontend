import ToolTip from 'components/ToolTip';
import { IMAGE_PATH } from 'constants/imagePaths';
import { S3_URL } from 'constants/index';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleViewProfile } from 'utils';

interface BookingDetailsDisputeDetailsProps {
	bookingData: any;
	user: any;
	onUpdateStatus: (status: any) => void;
}

const BookingDetailsDisputeDetails: React.FC<BookingDetailsDisputeDetailsProps> = ({
	bookingData,
	user,
	onUpdateStatus,
}) => {
	const navigate = useNavigate();
	const [isDisabled, setIsDisabled] = useState(false);

	const onUserProfileClick = () => {
		if (user?.type !== bookingData?.disputeByType) {
			handleViewProfile(
				user?.type === 'SELLER' ? bookingData?.buyerId : bookingData?.sellerId,
				navigate,
				user?.type,
			);
		}
	};

	useEffect(() => {
		const checkTimeLimit = () => {
			if (!bookingData?.updated) return true;

			const updateTime = new Date(bookingData?.updated).getTime();
			const currentTime = new Date().getTime();
			const hoursDifference = (currentTime - updateTime) / (1000 * 60 * 60);

			return hoursDifference >= 96;
		};

		// Initial check
		setIsDisabled(checkTimeLimit());

		const intervalId = setInterval(
			() => {
				setIsDisabled(checkTimeLimit());
			},
			60 * 60 * 1000,
		);

		return () => clearInterval(intervalId);
	}, [bookingData?.updated]);

	return (
		<div className="white-box">
			<div className="user-information d-flex flex-column">
				<div className="d-flex gap-2 align-items-center">
					<h6 className="mb-0 user-information-heading">Dispute Details</h6>
				</div>

				<div className="d-flex gap-3 align-items-center">
					<p className="mb-0 subtitle">
						Dispute By {bookingData?.disputeByType === 'SELLER' ? 'Seller' : 'Buyer'}:
					</p>
					<div
						className="d-flex gap-2 align-items-center"
						style={{
							cursor: bookingData?.disputeByType === user?.type ? 'default' : 'pointer',
						}}
						onClick={() => onUserProfileClick()}
					>
						<img
							src={
								bookingData?.disputeByType === 'SELLER'
									? bookingData?.seller?.avatar
										? `${S3_URL + bookingData?.seller?.avatar}`
										: IMAGE_PATH.userIcon
									: bookingData?.buyer?.avatar
										? `${S3_URL + bookingData?.buyer?.avatar}`
										: IMAGE_PATH.userIcon
							}
							alt=""
							className="profile-img"
						/>
						<span className="subtitle">
							{bookingData?.disputeByType === 'SELLER'
								? bookingData?.seller?.fullName
								: bookingData?.buyer?.fullName}
						</span>
					</div>
				</div>
				<div className="red-badges">
					<p className="mb-0 subtitle">{bookingData?.disputeReason}</p>
				</div>
				{bookingData?.disputeByType === user?.type ? (
					<div className="d-flex gap-3 align-items-center flex-wrap">
						<button
							className={`user-information-btn ${isDisabled ? 'disabled' : ''}`}
							onClick={() => onUpdateStatus('WithDrawn')}
							disabled={isDisabled}
						>
							Withdraw Dispute
						</button>
						<span>
							<ToolTip data={'Post 96 hours this button will become disabled'} />
						</span>
					</div>
				) : (
					<p className="mb-0 subtitle">
						<b>NOTE:</b> Admin will contact you outside the platform and resolve the matter soon.
					</p>
				)}
			</div>
		</div>
	);
};

export default BookingDetailsDisputeDetails;
