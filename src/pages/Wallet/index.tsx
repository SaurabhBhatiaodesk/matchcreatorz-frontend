import { IMAGE_PATH } from 'constants/imagePaths';
import { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useProfileListMutation, useWalletAmountMutation } from 'services';
import useAuthStore, { setUserInfo } from 'store/auth';
import { setProfileData } from 'store/user';
import AddMoney from './AddMoney';
import './styles.scss';
import Transactions from './Transactions';
import WithdrawMoney from './WithdrawMoney';
import WithdrawRequest from './WithdrawRequest';

const Wallet: React.FC = () => {
	const { user, token }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const { mutateAsync: walletAmountMutation } = useWalletAmountMutation();
	const { mutateAsync: profileListMutation } = useProfileListMutation();
	const queryString = window.location.search;
	const queryParams = new URLSearchParams(queryString);
	const mobileToken = queryParams.getAll('token').toString();
	const type = queryParams.getAll('type').toString();
	const [activeStatus, setActiveStatus] = useState(type || 'addMoney');

	useEffect(() => {
		profileListMutation().then((res: any) => {
			if (res?.success) {
				setProfileData(res?.data?.user);
				setUserInfo({ token: token, user: res?.data?.user });
			}
		});
	}, []);

	useEffect(() => {
		if (mobileToken) {
			setUserInfo({
				token: mobileToken,
			});
			walletAmountMutation()
				.then((res: any) => {
					if (res?.success) {
						setUserInfo({
							token: mobileToken,
							user: { ...user, walletAmount: res?.data?.walletAmount },
						});
					}
				})
				.catch(() => {});
		}
	}, [token]);

	const handleTabSelect = (key: any) => {
		setActiveStatus(key);
	};

	return (
		<div className={`wallet-section d-flex flex-column ${token ? 'px-3' : ''}`}>
			{!token && <h4 className={`wallet-section-title mb-0`}>Wallet</h4>}
			<div className="wallet-section-amount d-flex gap-3 align-items-center">
				<div className="wallet-icon d-flex justify-content-center align-items-center">
					<img src={IMAGE_PATH.walletIcon} alt="" className="w-100" />
				</div>
				<div className="d-flex flex-column gap-2">
					<h5 className="mb-0 title">Current Amount in Wallet </h5>
					<h6 className="mb-0 amount">${user?.walletAmount?.toFixed(2)}</h6>
				</div>
			</div>
			<Tabs
				defaultActiveKey={activeStatus}
				className="custom-tabs"
				onSelect={(key) => handleTabSelect(key)}
			>
				<Tab eventKey="addMoney" title="Add Money">
					<AddMoney />
				</Tab>

				<Tab eventKey="withdrawMoney" title="Withdraw Money">
					<WithdrawMoney remainingAmount={user?.walletAmount} />
				</Tab>

				{!mobileToken && (
					<Tab eventKey="withdrawRequest" title="Withdraw Request">
						<WithdrawRequest />
					</Tab>
				)}
				{!mobileToken && (
					<Tab eventKey="transactions" title="Transactions">
						<Transactions />
					</Tab>
				)}
			</Tabs>
		</div>
	);
};

export default Wallet;
