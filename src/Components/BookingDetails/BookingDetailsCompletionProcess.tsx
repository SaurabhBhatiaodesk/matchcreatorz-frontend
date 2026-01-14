import { S3_URL } from 'constants/index';
import React from 'react';

interface BookingDetailsCompletionProcessProps {
	bookingData: any;
	user: any;
	onBookingRequestUpdate: (type: any, status: any) => void;
}

const BookingDetailsCompletionProcess: React.FC<BookingDetailsCompletionProcessProps> = ({
	bookingData,
	user,
	onBookingRequestUpdate,
}) => {
	return (
		<div className="white-box">
			<div className="user-information d-flex flex-column">
				<div className="d-flex gap-2 align-items-center">
					<h6 className="mb-0 user-information-heading">Job Completion Confirmation </h6>
					{bookingData?.completionProcess === 'Accepted' ? (
						<div className="badges">{bookingData?.completionProcess}</div>
					) : bookingData?.completionProcess === 'Rejected' ? (
						<div className="badges red">{bookingData?.completionProcess}</div>
					) : bookingData?.completionProcess === 'Pending' ? (
						<div className="badges yellow">{bookingData?.completionProcess}</div>
					) : null}
				</div>

				{bookingData?.completionProcess === 'Pending' && (
					<>
						{user?.type === 'SELLER' && bookingData?.completeByType === 'BUYER' ? (
							<>
								<div className="red-badges">
									<p className="mb-0 subtitle">Buyer has sent the job completion request.</p>
								</div>
								<div className="d-flex flex-column gap-3">
									<h6 className="mb-0 user-information-heading">
										Proof of Completion (Uploaded from Buyer's side)
									</h6>
									{bookingData?.completionProof?.length > 0 ? (
										<div className="d-flex gap-3 flex-wrap">
											{bookingData?.completionProof.map((item: any, index: number) => (
												<div key={index}>
													<img
														src={`${S3_URL + item.url}`}
														alt={`Image ${item.url}`}
														className="doc-img"
													/>
												</div>
											))}
										</div>
									) : (
										<p>No proof provided</p>
									)}
								</div>
							</>
						) : user?.type === 'BUYER' && bookingData?.completeByType === 'SELLER' ? (
							<>
								<div className="red-badges">
									<p className="mb-0 subtitle">Seller has sent the job completion request.</p>
								</div>
								<div className="d-flex flex-column gap-3">
									<h6 className="mb-0 user-information-heading">
										Proof of Completion (Uploaded from Seller's side)
									</h6>
									{bookingData?.completionProof?.length > 0 ? (
										<div className="d-flex gap-3 flex-wrap">
											{bookingData?.completionProof.map((item: any, index: number) => (
												<div key={index}>
													<img
														src={`${S3_URL + item.url}`}
														alt={`Image ${item.url}`}
														className="doc-img"
													/>
												</div>
											))}
										</div>
									) : (
										<p>No proof provided</p>
									)}
								</div>
							</>
						) : (
							<div className="red-badges">
								<p className="mb-0 subtitle">
									{user?.type === 'SELLER'
										? "Confirmation awaits from buyer's side."
										: "Confirmation awaits from seller's side."}
								</p>
							</div>
						)}

						{(user?.type === 'SELLER' && bookingData?.completeByType === 'BUYER') ||
						(user?.type === 'BUYER' && bookingData?.completeByType === 'SELLER') ? (
							<div className="d-flex gap-3 align-items-center">
								<button
									className="job-details-content-btn red-border"
									onClick={() => onBookingRequestUpdate('Complete', 'Rejected')}
								>
									Reject
								</button>
								<button
									className="job-details-content-btn red-bg"
									onClick={() => onBookingRequestUpdate('Complete', 'Accepted')}
								>
									Accept
								</button>
							</div>
						) : null}
					</>
				)}

				{bookingData?.completionProcess === 'Rejected' && (
					<div className="red-badges">
						<p className="mb-0 subtitle">
							Job confirmation has been rejected from{' '}
							{bookingData?.completeByType === 'BUYER' ? 'seller' : 'buyer'} side. You can raise a
							dispute.
						</p>
					</div>
				)}

				{bookingData?.completionProcess === 'Accepted' && (
					<>
						<div className="red-badges">
							<p className="mb-0 subtitle">
								Job confirmation was accepted from {user?.type === 'SELLER' ? 'buyer' : 'seller'}{' '}
								side.
							</p>
						</div>
						<div className="d-flex flex-column gap-3">
							<h6 className="mb-0 user-information-heading">
								Proof of Completion (Uploaded from {user?.type === 'SELLER' ? 'seller' : 'buyer'}{' '}
								side)
							</h6>
							{bookingData?.completionProof?.length > 0 ? (
								<div className="d-flex gap-3 flex-wrap">
									{bookingData?.completionProof.map((item: any, index: number) => (
										<div key={index}>
											<img
												src={`${S3_URL + item.url}`}
												alt={`Image ${item.url}`}
												className="doc-img"
											/>
										</div>
									))}
								</div>
							) : (
								<p>No proof provided</p>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default BookingDetailsCompletionProcess;
