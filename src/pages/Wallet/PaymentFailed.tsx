import React from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PaymentFailed: React.FC<any> = () => {
	const navigate = useNavigate();

	return (
		<section className="d-flex align-items-center h-100">
			<Container>
				<div className="payment-page  w-100 d-flex flex-column gap-4">
					<div className="d-flex flex-column gap-2">
						<div className="payment-page-icon red d-flex align-items-center">
							<i className="ri-check-fill"></i>
						</div>
						<h2 className="payment-page-title red mb-0">Payment Failed</h2>
						<p className="payment-page-description">
							Sorry but we couldn’t completed the transaction.
						</p>
					</div>
					<div className="payment-page-box d-flex flex-column">
						<button className="payment-page-box-btn border-0" onClick={() => navigate('/wallets')}>
							Go to Wallet{' '}
						</button>
					</div>
				</div>
			</Container>
		</section>
	);
};

export default PaymentFailed;
