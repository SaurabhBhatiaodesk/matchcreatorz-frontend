import { CustomToast } from 'components';
import { onMessage } from 'firebase/messaging';
import { useEffect, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { HelmetProvider } from 'react-helmet-async';
import toast, { Toaster } from 'react-hot-toast';
import 'remixicon/fonts/remixicon.css';
import { useGetAdminSettingMutation } from 'services';
import { getFirebaseToken, messaging, requestPermission } from 'services/firebaseSDK';
import useAuthStore, { setAdminData } from 'store/auth';
import { setNewNotificationAlert } from 'store/chat';
import { connect, disconnect, setToken } from 'store/socket';
import Routing from './routes';

function App() {
	const { token: isAuthenticated } = useAuthStore((state) => state.userInfo ?? {});
	const { mutateAsync: getAdminSettingMutation } = useGetAdminSettingMutation({
		userType: 'ADMIN',
	});

	const [hasToken, setHasToken] = useState<boolean>(() => {
		return !!localStorage.getItem('fcmToken');
	});

	useEffect(() => {
		const handleWindowLoad = () => {
			if (Notification.permission !== 'granted') {
				toast(() => 'Enable notifications to receive important updates and alerts in real-time.', {
					icon: '🔔',
					duration: 5000,
					position: 'top-right',
				});
			}
		};

		window.addEventListener('load', handleWindowLoad);

		return () => {
			window.removeEventListener('load', handleWindowLoad);
		};
	}, []);

	useEffect(() => {
		if (isAuthenticated) {
			setToken(isAuthenticated);
			connect();

			return () => {
				disconnect();
			};
		}
		getAdminSettingMutation().then((res: any) => {
			if (res?.success) {
				setAdminData(res?.data);
			}
		});
	}, [isAuthenticated]);

	useEffect(() => {
		const fetchFirebaseToken = async () => {
			try {
				const firebaseToken = await getFirebaseToken();
				if (firebaseToken) {
					localStorage.setItem('fcmToken', firebaseToken);
					setHasToken(true);
				}
			} catch (err) {
				console.error('An error occurred while retrieving firebase token.', err);
			}
		};

		if (!hasToken) {
			requestPermission();
			fetchFirebaseToken();
		} else if (!isAuthenticated) {
			fetchFirebaseToken();
		}
	}, [hasToken, isAuthenticated]);

	useEffect(() => {
		if (messaging) {
			onMessage(messaging, (payload: any) => {
				setNewNotificationAlert(true);
				toast.custom((t: any) => <CustomToast t={t} payload={payload} />, {
					duration: 5000,
				});
			});
		}
	}, []);

	return (
		<HelmetProvider>
			<Routing />
			<Toaster position={isMobileOnly ? 'bottom-center' : 'top-center'} />
		</HelmetProvider>
	);
}

export default App;
