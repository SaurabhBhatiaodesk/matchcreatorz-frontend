import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	FacebookAuthProvider,
	OAuthProvider,
} from 'firebase/auth';

// const firebaseConfig = {
// 	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
// 	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
// 	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
// 	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
// 	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
// 	appId: import.meta.env.VITE_FIREBASE_APP_ID,
// 	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
// };
const firebaseConfig = {
	apiKey: "AIzaSyAdpd-N0xdYrwy_3c-BQkfnvTcAENKxLmA",
	authDomain: "matchcreators-2efcb.firebaseapp.com",
	projectId: "matchcreators-2efcb",
	storageBucket: "matchcreators-2efcb.firebasestorage.app",
	messagingSenderId: "33019990189",
	appId: "1:33019990189:web:0df888f7995f3c3598f624",
	measurementId: "G-S2Q36K0GDW"
};

// Check if required Firebase config values are present
const isFirebaseConfigValid = () => {
	return !!(
		firebaseConfig.apiKey &&
		firebaseConfig.authDomain &&
		firebaseConfig.projectId &&
		firebaseConfig.appId
	);
};

let firebaseApp: any = null;
let messaging: any = null;

if (isFirebaseConfigValid()) {
	try {
		firebaseApp = initializeApp(firebaseConfig);
		// Only initialize messaging if messagingSenderId is provided
		if (firebaseConfig.messagingSenderId) {
			messaging = getMessaging(firebaseApp);
		}
	} catch (error) {
		console.warn('Firebase initialization failed:', error);
	}
} else {
	console.warn(
		'Firebase configuration is missing. Please set the required environment variables (VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID) in your .env file.',
	);
}

export { messaging };

export const getOrRegisterServiceWorker = () => {
	if ('serviceWorker' in navigator) {
		return window.navigator.serviceWorker
			.getRegistration('/firebase-push-notification-scope')
			.then((serviceWorker) => {
				if (serviceWorker) {
					return serviceWorker;
				}
				return window.navigator.serviceWorker.register('../firebase-messaging-sw.js', {
					scope: '/firebase-push-notification-scope',
				});
			});
	}
	throw new Error('This browser does not support service workers.');
};

export const getFirebaseToken = () => {
	if (!messaging) {
		console.warn('Firebase messaging is not initialized. Please configure Firebase environment variables.');
		return Promise.resolve(null);
	}
	return getOrRegisterServiceWorker()
		.then((serviceWorkerRegistration) =>
			getToken(messaging, {
				vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
				serviceWorkerRegistration,
			}),
		)
		.catch((error) => {
			console.error(
				'Failed to retrieve Firebase token. Please check service worker registration or VAPID key configuration.',
				error,
			);
			return null;
		});
};

export const onForegroundMessage = () => {
	if (!messaging) {
		console.warn('Firebase messaging is not initialized.');
		return Promise.resolve(null);
	}
	return new Promise((resolve) =>
		onMessage(messaging, (payload) => {
			resolve(payload);
		}),
	);
};

export const onMessageListener = () => {
	if (!messaging) {
		console.warn('Firebase messaging is not initialized.');
		return Promise.resolve(null);
	}
	return new Promise((resolve) => {
		onMessage(messaging, (payload) => {
			resolve(payload);
		});
	});
};

export const requestPermission = async () => {
	if (!messaging) {
		console.warn('Firebase messaging is not initialized. Please configure Firebase environment variables.');
		return;
	}
	try {
		const permission = await Notification.requestPermission();
		if (permission === 'granted') {
			const token = await getToken(messaging, {
				vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
			});
			if (token) {
				localStorage.setItem('fcmToken', token);
			}
		} else {
			console.error('Notification permission denied by the user.');
		}
	} catch (error) {
		console.error(
			'An error occurred while requesting notification permission or retrieving the Firebase token.',
			error,
		);
	}
};

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
	prompt: 'select_account',
});

export const auth = firebaseApp ? getAuth(firebaseApp) : null;

export const signInWithGooglePopup = () => {
	if (!auth) {
		throw new Error('Firebase Auth is not initialized. Please configure Firebase environment variables.');
	}
	return signInWithPopup(auth, googleProvider);
};

const fbProvider = new FacebookAuthProvider();
fbProvider.setCustomParameters({
	display: 'popup',
});

export const signInWithFacebookPopup = () => {
	if (!auth) {
		throw new Error('Firebase Auth is not initialized. Please configure Firebase environment variables.');
	}
	return signInWithPopup(auth, fbProvider);
};

const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');

export const signInWithApplePopup = () => {
	if (!auth) {
		throw new Error('Firebase Auth is not initialized. Please configure Firebase environment variables.');
	}
	return signInWithPopup(auth, appleProvider);
};

export default firebaseApp;
