import 'styles/auth.scss';
import { Tab, Tabs } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import LoginBuyer from './LoginBuyer';
import LoginSeller from './LoginSeller';
import { useNavigate } from 'react-router-dom';
import SocialLogin from '../SocialLogin/SocialLogin';

const Login: React.FC = () => {
	const [userStatus, setUserStatus] = useState('BUYER');
	const navigate = useNavigate();

	useEffect(() => {
		localStorage.setItem('userType', userStatus);
	}, [userStatus]);

	const handleTabSelect = (key: any) => {
		setUserStatus(key);
	};

	return (
		<section className="auth-page d-flex justify-content-center align-item-center">
			<div className="auth-page-card d-flex flex-column">
				<h2 className="auth-page-main-title mb-0">
					Login to{' '}
					<span>
						Match<span>Creatorz</span>
					</span>
				</h2>
				<Tabs
					activeKey={userStatus}
					id="uncontrolled-tab-example"
					className="auth-page-tabs"
					onSelect={handleTabSelect}
				>
					<Tab eventKey="BUYER" title="Login as Buyer">
						<SocialLogin type={userStatus} />
						<LoginBuyer />
					</Tab>
					<Tab eventKey="SELLER" title="Login as Seller">
						<SocialLogin type={userStatus} />
						<LoginSeller />
					</Tab>
				</Tabs>
				<p className="mb-0 text-center auth-page-text">
					Don't have an account?{' '}
					<span onClick={() => navigate('/register')} className="auth-page-link">
						Register Now
					</span>
				</p>
			</div>
		</section>
	);
};

export default Login;
