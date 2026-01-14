import ToolTip from 'components/ToolTip';
import { IMAGE_PATH } from 'constants/imagePaths';
import { S3_URL } from 'constants/index';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleViewProfile } from 'utils';

interface BookingDetailsCancellationTermsProps {
	bookingData: any;
	user: any;
	onUpdateStatus: (status: any) => void;
	onBookingRequestUpdate: (type: any, status: any) => void;
	onCancel: (type: string) => void;
}

const BookingDetailsCancellationTerms: React.FC<BookingDetailsCancellationTermsProps> = ({
	bookingData,
	user,
	onUpdateStatus,
	onBookingRequestUpdate,
	onCancel,
}) => {
	const navigate = useNavigate();
	const onUserProfileClick = () => {
		if (user.type !== bookingData?.cancelByType) {
			handleViewProfile(
				user.type === 'SELLER' ? bookingData?.buyerId : bookingData?.sellerId,
				navigate,
				user.type,
			);
		}
	};

	return (
		<div className="white-box">
			<div className="user-information d-flex flex-column">
				<div className="d-flex gap-2 align-items-center">
					<h6 className="mb-0 user-information-heading">Cancellation Terms</h6>
					{bookingData?.settlementStatus === 'Accepted' ? (
						<div className="badges">{bookingData?.settlementStatus}</div>
					) : bookingData?.settlementStatus === 'Rejected' ? (
						<div className="badges red">{bookingData?.settlementStatus}</div>
					) : bookingData?.settlementStatus === 'Pending' ? (
						<div className="badges yellow">{bookingData?.settlementStatus}</div>
					) : null}
				</div>

				<div className="d-flex gap-3 align-items-center">
					<p className="mb-0 subtitle">
						Cancelled By {bookingData?.cancelByType === 'SELLER' ? 'Seller' : 'Buyer'}:
					</p>
					<div
						className="d-flex gap-2 align-items-center"
						style={{
							cursor: bookingData?.cancelByType === user?.type ? 'default' : 'pointer',
						}}
						onClick={() => onUserProfileClick()}
					>
						<img
							src={
								bookingData?.cancelByType === 'SELLER'
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
							{bookingData?.cancelByType === 'SELLER'
								? bookingData?.seller?.fullName
								: bookingData?.buyer?.fullName}
						</span>
					</div>
				</div>

				<div className="d-flex flex-column gap-3">
					<h6 className="mb-0 user-information-heading">Cancellation Reason</h6>
					<p className="mb-0 main-description">{bookingData?.reason}</p>
				</div>

				{bookingData?.counterAmountProposed > 0 &&
				bookingData?.cancelByType === 'SELLER' &&
				bookingData?.settlementStatus === 'Pending' ? (
					<div className="red-badges">
						<p className="mb-0 subtitle">Confirmation awaits from seller's end</p>
					</div>
				) : null}

				<div className="d-flex flex-column gap-3">
					<h6 className="mb-0 user-information-heading">Total Amount</h6>
					<p className="mb-0 subtitle">
						<i className="ri-money-dollar-circle-line me-2"></i> ${bookingData?.totalAmount}
					</p>
				</div>

				<div className="d-flex flex-column gap-3">
					<h6 className="mb-0 user-information-heading">Settlement Proposal</h6>
					<div className="d-flex gap-5">
						<div className="d-flex flex-column gap-2">
							<p className="mb-0 subtitle">
								Settlement Amount By {bookingData?.cancelByType === 'SELLER' ? 'Seller' : 'Buyer'}
							</p>
							<p className="mb-0 subtitle">
								<i className="ri-money-dollar-circle-line me-2"></i> $
								{bookingData?.settlementAmountProposed}
							</p>
						</div>
						<div className="d-flex flex-column gap-2">
							<p className="mb-0 subtitle">
								Refund Amount{' '}
								<ToolTip data={'Amount to be refunded after platform charge deduction $20'} />
							</p>
							<p className="mb-0 subtitle">
								<i className="ri-money-dollar-circle-line me-2"></i> ${bookingData?.refundAmount}
							</p>
						</div>
					</div>
				</div>

				{bookingData?.counterAmountProposed > 0 ? (
					<div className="d-flex flex-column gap-3">
						<h6 className="mb-0 user-information-heading">Counter Proposal</h6>
						<div className="d-flex gap-5">
							<div className="d-flex flex-column gap-2">
								<p className="mb-0 subtitle">
									Counter Settlement Amount By{' '}
									{bookingData?.cancelByType === 'SELLER' ? 'Buyer' : 'Seller'}
								</p>
								<p className="mb-0 subtitle">
									<i className="ri-money-dollar-circle-line me-2"></i> $
									{bookingData?.counterAmountProposed}
								</p>
							</div>
							<div className="d-flex flex-column gap-2">
								<p className="mb-0 subtitle">
									Refund Amount{' '}
									<ToolTip data={'Amount to be refunded after platform charge deduction $20'} />
								</p>
								<p className="mb-0 subtitle">
									<i className="ri-money-dollar-circle-line me-2"></i> ${bookingData?.refundAmount}
								</p>
							</div>
						</div>
					</div>
				) : null}

				{bookingData?.settlementStatus === 'Pending' && (
					<p className="mb-0 subtitle">
						<b>NOTE:</b> In case you don't take an action in next 48 hours this offer will be
						accepted by default
					</p>
				)}

				{bookingData?.cancelByType === user?.type && bookingData?.settlementStatus === 'Pending' ? (
					<div className="d-flex gap-3 align-items-center flex-wrap">
						<button className="user-information-btn" onClick={() => onUpdateStatus('WithDrawn')}>
							Withdraw Cancellation
						</button>
						<span>
							<ToolTip data={'Post 96 hours this button will become disabled'} />
						</span>
					</div>
				) : bookingData?.settlementStatus !== 'Accepted' ? (
					<div className="d-flex gap-3 align-items-center flex-wrap">
						<button
							className="job-details-content-btn red-border"
							onClick={() => onBookingRequestUpdate('Cancel', 'Rejected')}
						>
							Reject
						</button>
						<button
							className="job-details-content-btn"
							onClick={() => onBookingRequestUpdate('Cancel', 'Accepted')}
						>
							Accept
						</button>

						{bookingData?.counterAmountProposed === 0 && (
							<button
								className="job-details-content-btn red-bg"
								onClick={() => onCancel('CounterOnCancellation')}
							>
								Counter
							</button>
						)}
					</div>
				) : null}

				{bookingData?.settlementStatus === 'Rejected' && (
					<p className="mb-0 subtitle">Note: You may raise a dispute to solve this matter.</p>
				)}
			</div>
		</div>
	);
};

export default BookingDetailsCancellationTerms;
