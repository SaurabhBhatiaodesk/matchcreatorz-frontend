import React from 'react';

interface BookingDetailsHeaderProps {
	bookingData: any;
	onCancel: (type: string) => void;
	onComplete: () => void;
}

const BookingDetailsHeader: React.FC<BookingDetailsHeaderProps> = ({
	bookingData,
	onCancel,
	onComplete,
}) => {
	return (
		<div className="white-box job-details-content">
			<div className="d-flex gap-2 flex-column">
				<div className="d-flex gap-2 align-items-center">
					<h2 className="mb-0 job-details-content-title1 mb-0">BookingID #{bookingData?.id}</h2>
					<span>
						{bookingData?.status === 'Ongoing' ? (
							<div className="badges">{bookingData?.status}</div>
						) : bookingData?.status === 'Amidst-Cancellation' ? (
							<div className="badges red">{bookingData?.status}</div>
						) : bookingData?.status === 'Amidst-Completion-Process' ? (
							<div className="badges yellow">{bookingData?.status}</div>
						) : bookingData?.status === 'In-dispute' ? (
							<div className="badges blue">{bookingData?.status}</div>
						) : bookingData?.status === 'Cancelled' ? (
							<div className="badges red">{bookingData?.status}</div>
						) : bookingData?.status === 'Completed' ? (
							<div className="badges ">{bookingData?.status}</div>
						) : null}
					</span>
				</div>

				<span className="job-details-content-subtile">{bookingData?.title}</span>
				<span className="job-details-content-designation">{bookingData?.category?.title}</span>
				<span className="job-details-content-location">
					<i className="ri-map-pin-2-line me-1"></i>
					{bookingData?.country?.countryName}
				</span>

				<div className="d-flex flex-wrap gap-3 mt-auto">
					<button
						className={`job-details-content-btn ${
							bookingData?.status === 'Completed' ||
							bookingData?.status === 'Cancelled' ||
							bookingData?.status === 'In-dispute' ||
							bookingData?.status === 'Amidst-Cancellation'
								? 'disabled'
								: ''
						}`}
						disabled={
							bookingData?.status === 'Completed' ||
							bookingData?.status === 'Cancelled' ||
							bookingData?.status === 'Amidst-Cancellation' ||
							bookingData?.status === 'In-dispute'
								? true
								: false
						}
						onClick={() => onCancel('Cancelled')}
					>
						Cancel
					</button>

					<button
						className={`job-details-content-btn red-border ${bookingData?.status === 'Cancelled' || bookingData?.status === 'Completed' || bookingData?.status === 'In-dispute' ? 'disabled' : ''}`}
						disabled={
							bookingData?.status === 'Cancelled' ||
							bookingData?.status === 'Completed' ||
							bookingData?.status === 'In-dispute'
								? true
								: false
						}
						onClick={() => onCancel('Dispute')}
					>
						<i className={`ri-flag-2-line me-2`}></i>Raise Dispute
					</button>

					<button
						className={`job-details-content-btn red-bg ${bookingData?.status === 'Ongoing' ? '' : 'disabled'}`}
						disabled={bookingData?.status === 'Ongoing' ? false : true}
						onClick={() => onComplete()}
					>
						Mark as Complete
					</button>
				</div>
			</div>
		</div>
	);
};

export default BookingDetailsHeader;
