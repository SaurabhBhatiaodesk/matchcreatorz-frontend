import { useMutation } from '@tanstack/react-query';
import Compressor from 'compressorjs';
import { API_ENDPOINTS } from 'constants/endpoints';
import { get, handleError, handleResponse } from './base.service';

export const useUploadFileMutation = () =>
	useMutation({
		mutationFn: (payload: any) => {
			return fetch(payload?.url, payload?.requestOptions);
		},
		onSuccess: handleResponse,
	});

export const compressFileSize = async (file: File): Promise<void> => {
	const baseSize = 1 * 1024 * 1024;
	let quality: number = 1;
	if (file.size > baseSize) {
		quality = baseSize / file.size;
	}

	return new Promise((resolve, reject) => {
		new Compressor(file, {
			quality: quality,
			success: async (result: any) => {
				const pngBlob: any = new File([result], `image_${Date.now()}.png`, { type: 'image/png' });
				resolve(pngBlob);
			},
			error(err) {
				reject(err);
			},
		});
	});
};

export const useStaticPagesMutation = () => {
	return useMutation({
		mutationFn: async (params: any) => {
			return get(`${API_ENDPOINTS.GET_STATIC_PAGES + params}/info`);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};
