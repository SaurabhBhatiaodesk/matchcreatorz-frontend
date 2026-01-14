import { S3_URL } from 'constants/index';
import toast from 'react-hot-toast';

type ObjectType = {
	id: number;
};

export const getFileExtension = (fileName: string) => {
	return fileName.split('.').pop() ?? '';
};

export const imageBucketUrl = async (
	file: any,
	fileType: string,
	fileSize: number,
	bucketUrlMutation: any,
	uploadFileMutation: any,
) => {
	const maxSize = fileSize * 1024 * 1024;
	if (!file || !file?.type || !file?.size) {
		return '';
	}
	if (file && !file.type.startsWith(fileType)) {
		toast.error('Invalid file type. Please upload an image with a valid format.');
		return false;
	} else if (file && file.size > maxSize) {
		toast.error('Image size exceeds the limit. Please upload an image smaller than 5 MB.');
		return false;
	}

	const response = await bucketUrlMutation(`?location=users&type=png&count=1`);

	const signedUrlData = response?.data?.length && response?.data?.[0];
	if (signedUrlData) {
		const requestOptions = {
			method: 'PUT',
			headers: {
				'Content-Type': 'png',
			},
			body: file,
		};

		await uploadFileMutation({
			url: signedUrlData?.url,
			requestOptions,
		});
		return signedUrlData?.filename;
	}
	toast.error('Please Try Again');
	return '';
};

export const isValidFileType = (
	file: File,
	validTypes = [
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	],
) => {
	if (validTypes.includes(file.type)) {
		return true;
	} else {
		toast.error('Please upload a valid file type');
		return false;
	}
};

export const isValidFileSize = (file: File, maxSize = 10 * 1024 * 1024) => {
	if (file.size <= maxSize) {
		return true;
	} else {
		toast.error(`Image size should be less than ${(maxSize / (1024 * 1024)).toFixed(2)} MB.`);
		return false;
	}
};

export const handleFileChange = async (
	event: any,
	setIsUploading: any,
	formik: any,
	bucketUrlMutation: any,
	uploadFileMutation: any,
) => {
	setIsUploading(true);
	const file: any = event.target.files?.[0];
	formik.setFieldValue('resumeName', file?.name ?? '');
	if (file) {
		if (!isValidFileType(file) || !isValidFileSize(file)) {
			setIsUploading(false);
			return;
		}
		const response = await bucketUrlMutation(`?location=users&type=pdf&count=1`);
		if (response?.data?.length > 0) {
			const signedUrlData = response?.data[0];
			setIsUploading(true);
			if (file && signedUrlData) {
				const requestOptions = {
					method: 'PUT',
					headers: {
						'Content-Type': 'pdf',
					},
					body: file,
				};

				await uploadFileMutation({
					url: signedUrlData?.url,
					requestOptions,
				});
			}

			formik.setFieldValue('resume', signedUrlData?.filename ?? '');
		}
	}
	setIsUploading(false);
};

export const updateAddOrDeleteObject = (
	arr: ObjectType[],
	newObj: ObjectType | null,
	idToDelete: number | null,
): ObjectType[] => {
	if (idToDelete !== null) {
		return arr.filter((obj) => obj.id !== idToDelete);
	}
	if (newObj !== null) {
		const newArray = arr.map((obj) => (obj.id === newObj.id ? { ...obj, ...newObj } : obj));
		const isFound = arr.some((obj) => obj.id === newObj.id);
		return isFound ? newArray : [newObj, ...newArray];
	}
	return arr;
};

export const formatRelativeDate = (date: any, isChatFormat: boolean): string => {
	const now: Date = new Date();
	const updatedDate: Date = new Date(date);
	const differenceInDays: number = Math.floor(
		(now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24),
	);
	const newDate = updatedDate.toLocaleDateString('en-CA');

	if (differenceInDays < 1) {
		return 'Today';
	} else if (isChatFormat) {
		return date;
	} else {
		return newDate;
	}
};

export const formatDateTime = (isoDate: string, chatFormate: any): string => {
	const date = new Date(isoDate);
	let hours = date.getHours();
	const minutes = date.getMinutes().toString().padStart(2, '0');
	if (chatFormate) {
		const timePeriod = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12 || 12;
		const formattedHours = hours.toString().padStart(2, '0');
		return `${formattedHours}:${minutes} ${timePeriod}`;
	}
	const day = date.getDate().toString().padStart(2, '0');
	const month = date.toLocaleString('default', { month: 'short' });
	const year = date.getFullYear().toString();
	const localTime = `${hours}:${minutes} - ${day} ${month}, ${year}`;
	return localTime;
};

export const dataLimits = {
	beforeSearchLimit: 10,
	afterSearchLimit: 10,
	postedJobLimit: 6,
	sellerServiceLimit: 6,
	topSellerLimit: 5,
	favouriteUserList: 15,
	activeBookingList: 9,
	myJobsServicesList: 9,
	bidListLimit: 9,
	notificationsListLimit: 10,
};

export const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	const day = date.toLocaleDateString('en-GB', { day: 'numeric' });
	const month = date.toLocaleDateString('en-GB', { month: 'long' });
	const year = date.toLocaleDateString('en-GB', { year: 'numeric' });

	return `${day} ${month}, ${year}`;
};

export const formatTime = (dateString: any) => {
	const date = new Date(dateString);
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

export const handleDownload = async (documentUrl: any) => {
	if (documentUrl) {
		try {
			const response = await fetch(`${S3_URL}${documentUrl}`);
			if (!response.ok) {
				throw new Error(
					`Failed to fetch the file from ${S3_URL}${documentUrl}. Status: ${response.status}`,
				);
			}
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', documentUrl.split('/').pop());
			link.style.display = 'none';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error downloading the file:', error);
		}
	}
};

export const getNotificationURL = async (
	navigate: (path: string, options?: object) => void,
	type: any,
	serviceId: number | null = null,
	bidId: number | null = null,
	bookingId: number | null = null,
	senderId: number | null = null,
	userType: any = 'BUYER',
) => {
	switch (type) {
		case 'CHAT':
			navigate('/chat-listing', { state: { id: senderId, activeTabType: 'chats' } });
			break;
		case 'OFFER':
			navigate('/chat-listing', { state: { id: senderId, activeTabType: 'chats' } });
			break;
		case 'REQUEST':
			navigate('/chat-listing', {
				state: {
					id: senderId,
					activeTabType: userType === 'SELLER' ? 'requestRecieved' : 'requestSent',
				},
			});
			break;
		case 'BID_UPDATE':
			return `/job-details/${serviceId}`;
		case 'BID_SUBMIT':
			return `/job-details/${serviceId}`;
		case 'BID':
			return `/bid-detail/${bidId}`;
		case 'BOOKING':
			return `/booking-details/${bookingId}`;
		default:
			return '';
	}
};

export const notificationFormatTime = (dateString: string) => {
	const date = new Date(dateString);
	const today = new Date();
	const isToday = date.toDateString() === today.toDateString();
	return isToday
		? `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`
		: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const handleViewProfile = (id: any, navigate: any, userType: any) => {
	if (userType === 'SELLER') {
		navigate(`/buyer-details/${id}`, { state: { activeTabType: 'BUYER' } });
	} else {
		navigate(`/seller-details/${id}`, { state: { activeTabType: 'SELLER' } });
	}
};

export const generateUUID = () => {
	const cryptoObj = window.crypto || (window as any).msCrypto; // Support for older IE
	const bytes = new Uint8Array(16);
	cryptoObj.getRandomValues(bytes);

	// Set the UUID version to 4 and the variant bits (per RFC 4122)
	bytes[6] = (bytes[6] & 0x0f) | 0x40;
	bytes[8] = (bytes[8] & 0x3f) | 0x80;

	// Convert the byte array to a UUID string format
	return Array.from(bytes)
		.map((b, i) => ([4, 6, 8, 10].includes(i) ? '-' : '') + b.toString(16).padStart(2, '0'))
		.join('');
};

export const setCookie = (name: string, value: any, days: any = '') => {
	let expires = '';
	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = '; expires=' + date.toUTCString();
	}
	document.cookie = name + '=' + (value ?? '') + expires + '; path=/';
};

export const getCookie = (name: string): string | null => {
	const nameEQ = name + '=';
	const ca = document.cookie.split(';');

	for (const cRaw of ca) {
		let c = cRaw.trim(); // replaces the while loop for trimming spaces
		if (c.startsWith(nameEQ)) {
			return c.substring(nameEQ.length);
		}
	}

	return null;
};

export const getBrowserID = () => {
	let browserID = getCookie('browserID');
	if (!browserID) {
		browserID = generateUUID();
		setCookie('browserID', generateUUID(), 15);
		return browserID;
	}
	return browserID;
};
