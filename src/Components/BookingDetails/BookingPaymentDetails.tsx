import ToolTip from 'components/ToolTip';
import React from 'react';
import { formatDate, formatTime } from 'utils';

interface BookingPaymentDetailsProps {
	bookingData: any;
	user: string;
}

const BookingPaymentDetails: React.FC<BookingPaymentDetailsProps> = ({ bookingData, user }) => {
	return (
		<div className="white-box">
			<h4 className="mb-30 sub-heading ">Payment Details</h4>
			<div className="d-flex justify-content-between payment-text">
				Status<span>{bookingData?.walletTransaction?.paymentStatus || 'N/A'}</span>
			</div>
			<hr />
			<div className="d-flex flex-column gap-3">
				<div className="d-flex justify-content-between payment-text">
					Payment Method
					<span>
						{bookingData?.walletTransaction?.addAmountBy
							? bookingData?.walletTransaction?.addAmountBy
							: 'Wallet'}
					</span>
				</div>
				<div className="d-flex justify-content-between payment-text">
					Transaction ID
					<span>{bookingData?.walletTransaction?.transactionId || 'N/A'}</span>
				</div>
			</div>
			<hr />
			<div className="d-flex flex-column gap-3">
				<div className="d-flex justify-content-between payment-text">
					Transaction Date
					<span>
						{bookingData?.walletTransaction?.created
							? formatDate(bookingData.walletTransaction.created)
							: 'N/A'}
					</span>
				</div>
				<div className="d-flex justify-content-between payment-text">
					Transaction Time
					<span>
						{bookingData?.walletTransaction?.created
							? formatTime(bookingData.walletTransaction.created)
							: 'N/A'}
					</span>
				</div>
			</div>
			<hr />
			<div className="d-flex justify-content-between payment-text">
				<div>
					{user?.type === 'BUYER' ? (
						<>
							Total Amount
							<ToolTip
								data={
									<>
										{`Seller fee: $${bookingData?.walletTransaction?.amount - bookingData?.platformFee}`}
										<br />
										{`Platform charges (10 USD): $${bookingData?.platformFee}`}
									</>
								}
							/>
						</>
					) : (
						<>
							Amount to be received in wallets (after job completion)
							<ToolTip
								data={
									<>
										{`Seller fee: $${bookingData?.walletTransaction?.amount - bookingData?.platformFee}`}
										<br />
										{`Platform charges (10 USD): $${bookingData?.platformFee}`}
									</>
								}
							/>
						</>
					)}
				</div>
				<span>
					{bookingData?.walletTransaction?.amount
						? `$${bookingData.walletTransaction.amount}`
						: 'N/A'}
				</span>
			</div>
		</div>
	);
};

export default BookingPaymentDetails;
