import toast from 'react-hot-toast';
import { setUserInfo } from 'store/auth';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const activeLanguage = 'en';
const appBaseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:4001';

// Log API URL for debugging (only in development)
if (import.meta.env.DEV) {
	console.log('API Base URL:', BASE_URL);
	console.log('APP Base URL:', appBaseUrl);

}

const request = async (url: string, options: any = {}) => {
	const storageData = localStorage.getItem('auth')
		? JSON.parse(localStorage.getItem('auth')!)
		: sessionStorage.getItem('auth')
			? JSON.parse(sessionStorage.getItem('auth')!)
			: {};
	const token = storageData?.state?.userInfo?.token ?? '';
	const userType = localStorage.getItem('userType');
	try {
		options.headers = {
			...options.headers,
			'accept': '*/*',
			'accept-language': options?.language ?? activeLanguage,
			'x-market-place-platform': options?.platform ?? 'web',
			'x-market-place-version': options?.version ?? '1.0.0',
			'user-type': options?.userType ?? userType ?? 'SELLER',
		};

		if (token) {
			options.headers = {
				...options.headers,
				Authorization: `Bearer ${token}`,
			};
		}

		const response = await fetch(url, options);

		// Check if response is ok (status 200-299)
		if (!response.ok) {
			// Try to parse error response
			const contentType = response.headers.get('content-type');
			if (contentType && contentType.includes('application/json')) {
				const errorData = await response.json();
				handleError({ status: response.status, ...errorData });
			} else {
				// If not JSON, it's likely an HTML error page
				const text = await response.text();
				console.error(`API Error (${response.status}):`, text.substring(0, 200));
				toast.error(`API request failed: ${response.status} ${response.statusText}`);
			}
			throw new Error(`API request failed: ${response.status} ${response.statusText}`);
		}

		// Check content-type before parsing JSON
		const contentType = response.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			return response.json();
		} else {
			// If response is not JSON, log and throw error
			const text = await response.text();
			console.error('Expected JSON but received:', contentType, text.substring(0, 200));
			throw new Error('API returned non-JSON response');
		}
	} catch (error: any) {
		console.error('Request error:', error);
		throw error;
	}
};

export const get = (url: string, options: any = {}) => request(`${BASE_URL}${url}`, options);

export const post = (
	url: string,
	data?: any,
	options: any = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	},

) => {
	const payload = {
		...data,
	};
	return request(`${BASE_URL}${url}`, {
		...options,
		body: JSON.stringify(payload),
	});
};

export const put = (
	url: string,
	data?: any,
	options: any = {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
	},
) => {
	const payload = {
		...data,
	};
	return request(`${BASE_URL}${url}`, {
		...options,
		body: JSON.stringify(payload),
	});
};

export const del = (
	url: string,
	data?: any,
	options: any = {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
	},
) => {
	const payload = {
		...data,
	};
	return request(`${BASE_URL}${url}`, {
		...options,
		body: JSON.stringify(payload),
	});
};

export const handleResponse = (response: any) => {
	if (!response?.success) {
		handleError(response);
		return;
	}
	return response?.data ?? response;
};

export const handleError = (response: any) => {
	const status = response?.status;
	const message = response?.message;

	// Handle unauthorized (401) error
	if (status === 401) {
		toast.error(message ?? 'Session expired. Please log in again to continue.');

		localStorage.clear();
		sessionStorage.clear();

		// Redirect user to login after a short delay
		setTimeout(() => {
			window.location.href = `${appBaseUrl || ''}/login`;
			setUserInfo({});
		}, 2000);
	}
	// Handle other errors
	else if (message) {
		toast.error(`${message}`);
	} else {
		console.error('An unexpected error occurred.', response);
	}
};
