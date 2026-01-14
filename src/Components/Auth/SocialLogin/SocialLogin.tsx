import { Button, Image } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getBrowserID } from 'utils';
import { useSocialLoginMutation } from 'services';
import { IMAGE_PATH } from 'constants/imagePaths';
import {
	signInWithApplePopup,
	signInWithFacebookPopup,
	signInWithGooglePopup,
} from 'services/firebaseSDK';
import useAuthStore from 'store/auth';
import './SocialLogin.scss';

const SocialLogin: React.FC<any> = ({ type }) => {
	const { mutateAsync: socialLoginMutation } = useSocialLoginMutation();
	const setUserInfo = useAuthStore((state) => state.setUserInfo);
	const { pathname } = useLocation();
	console.log('SocialLogin pathname:', pathname);
	const navigate = useNavigate();
	const loginGoogleUser = async () => {
		const response: any = await signInWithGooglePopup();
		const email = response?._tokenResponse?.email ?? response?.user?.email;
		const payload = {
			type: type,
			fullName: response?._tokenResponse?.fullName,
			socialType: 'GOOGLE',
			socialId: response?._tokenResponse?.localId,
			deviceToken: getBrowserID(),
		};
		const emailPayload = { email: email, ...payload };
		socialLogin(email ? emailPayload : payload);
	};

	const socialLogin = (payload: any) => {
		socialLoginMutation(payload).then((result: Record<string, any>) => {
			if (result?.success) {
				toast.success(result?.message);
				setUserInfo({ ...result?.data });
				if (type === 'BUYER') {
					navigate('/dashboard');
				} else if (result?.data?.user?.step === 1) {
					navigate('/profile', {
						state: {
							fullName: `${result?.data?.user?.fullName}`,
							countryCode: `${result?.data?.user?.countryCode}`,
							phone: `${result?.data?.user?.phone}`,
						},
					});
				} else if (result?.data?.user?.step === 2) {
					navigate('/faq');
				} else if (result?.data?.user?.step === 3) {
					navigate('/portfolio');
				} else {
					navigate('/dashboard');
				}
			} else {
				navigate('/login');
			}
		});
	};

	const loginFacebookUser = async () => {
		const response: any = await signInWithFacebookPopup();
		const email = response?._tokenResponse?.email ?? response?.user?.email;
		const payload = {
			type: type,
			fullName: response?._tokenResponse?.fullName,
			socialType: 'FACEBOOK',
			socialId: response?._tokenResponse?.localId,
			deviceToken: getBrowserID(),
		};
		const emailPayload = { email: email, ...payload };
		socialLogin(email ? emailPayload : payload);
	};

	const loginAppleUser = async () => {
		try {
			const response: any = await signInWithApplePopup();
			const email = response?._tokenResponse?.email ?? response?.user?.email;
			const payload = {
				type: type,
				fullName: response?._tokenResponse?.fullName,
				socialType: 'APPLE',
				socialId: response?._tokenResponse?.localId,
				deviceToken: getBrowserID(),
			};
			const emailPayload = { email: email, ...payload };
			socialLogin(email ? emailPayload : payload);
		} catch (error: any) {
			console.error('Error during Apple login:', error);
		}
	};

	return (
		<>
			<div
				className="d-flex flex-column gap-3 mb-3 p-4 rounded"
				style={{ backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0' }}
			>
				<Button onClick={loginGoogleUser} variant="outline-secondary" className="social-btn">
					<img
						src={IMAGE_PATH.google}
						alt="Google"
						loading="lazy"
						style={{ width: '24px', height: '24px' }}
					/>
					<p>Continue with Google</p>
				</Button>
				<Button onClick={loginAppleUser} variant="outline-secondary" className="social-btn">
					<img
						src={IMAGE_PATH.apple}
						alt="Apple"
						loading="lazy"
						style={{ width: '24px', height: '24px' }}
					/>
					<p>Continue with Apple</p>
				</Button>
				<Button onClick={loginFacebookUser} variant="outline-secondary" className="social-btn">
					<Image
						src={IMAGE_PATH.facebookNew}
						alt="FacebookIcon"
						loading="lazy"
						style={{ width: '24px', height: '24px' }}
					/>
					<p>Continue with Facebook</p>
				</Button>
			</div>

			<div className="d-flex align-items-center my-3">
				<hr className="flex-grow-1" style={{ borderColor: '#ddd' }} />
				<span className="px-3 text-muted">
					<strong>Or {pathname === '/login' ? 'Login' : 'Register'} Below</strong>
				</span>
				<hr className="flex-grow-1" style={{ borderColor: '#ddd' }} />
			</div>
		</>
	);
};

export default SocialLogin;
