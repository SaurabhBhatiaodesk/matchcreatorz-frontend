import React, { useEffect, useState } from 'react';
import { Badge, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { usePaymentSuccessMutation } from 'services';
import useAuthStore, { setUserInfo } from 'store/auth';
import { formatDateTime } from 'utils';

const PaymentSuccess: React.FC<any> = () => {
	const navigate = useNavigate();
	const { user, token }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const { mutateAsync: paymentSuccessMutation } = usePaymentSuccessMutation();
	const [successData, setSuccessData] = useState<any>();

	const queryString = window.location.search;

	const queryParams = new URLSearchParams(queryString);

	const temp = queryParams.toString();

	useEffect(() => {
		if (!temp) return;
		paymentSuccessMutation(`?${temp}`)
			.then((res: any) => {
				if (res?.success) {
					setUserInfo({
						token: token,
						user: {
							...user,
							walletAmount: user?.walletAmount + res?.data?.amount,
						},
					});
					setSuccessData(res?.data);
				}
			})
			.catch(() => {});
	}, []);

	return (
		<section className="d-flex align-items-center h-100">
			<Container>
				<div className="payment-page  w-100 d-flex flex-column gap-4">
					<div className="d-flex flex-column gap-2">
						<div className="payment-page-icon green d-flex align-items-center">
							<i className="ri-check-fill"></i>
						</div>
						<h2 className="payment-page-title green mb-0">Payment successful</h2>
						<p className="payment-page-description">
							Amount is already has been credited to your wallet
						</p>
					</div>
					<div className="payment-page-box d-flex flex-column">
						<h3 className="title">Transaction Details</h3>
						<div className="d-flex flex-column gap-2">
							<div className="d-flex justify-content-between gap-3 detail">
								Order ID <b>{successData?.orderId}</b>
							</div>
							<div className="d-flex justify-content-between gap-3 detail">
								Amount <b>${successData?.amount?.toFixed(2)}</b>
							</div>
							<div className="d-flex justify-content-between gap-3 detail">
								Created Time <b>{formatDateTime(successData?.created, false)}</b>
							</div>
							<div className="d-flex justify-content-between gap-3 detail">
								Payment Status
								<Badge bg="success text-capitalize">{successData?.paymentStatus}</Badge>
							</div>
						</div>
						<button className="payment-page-box-btn border-0" onClick={() => navigate('/wallets')}>
							Go to Wallet
						</button>
					</div>
				</div>
			</Container>
		</section>
	);
};

export default PaymentSuccess;
