import { useMutation, useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from 'constants/endpoints';
import { get, handleError, handleResponse, post, put } from './base.service';

export const useLoginMutation = () =>
	useMutation({
		mutationFn: (payload: any) => {
			return post(API_ENDPOINTS.AUTH_LOGIN, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useSignUpMutation = () =>
	useMutation({
		mutationFn: (payload: any) => {
			return post(API_ENDPOINTS.AUTH_SIGNUP, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useForgotPasswordMutation = () =>
	useMutation({
		mutationFn: (payload: any) => {
			return post(API_ENDPOINTS.AUTH_FORGOT_PASSWORD, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useVerifyOTPMutation = () =>
	useMutation({
		mutationFn: (payload: any) => {
			return post(API_ENDPOINTS.AUTH_VERIFY_OTP, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useRequestOTPMutation = () =>
	useMutation({
		mutationFn: (payload: any) => {
			return post(API_ENDPOINTS.AUTH_REQUEST_OTP, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useResetPasswordMutation = () =>
	useMutation({
		mutationFn: (payload: any) => {
			return post(API_ENDPOINTS.AUTH_RESET_PASSWORD, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useProfileMutation = () =>
	useMutation({
		mutationFn: (payload: any) => {
			return put(API_ENDPOINTS.UPDATE_PROFILE_STEP, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useFaqMutation = () =>
	useMutation({
		mutationFn: (payload: any) => {
			return put(API_ENDPOINTS.UPDATE_FAQ, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const usePortfolioMutation = () =>
	useMutation({
		mutationFn: (payload: any) => {
			return put(API_ENDPOINTS.PUT_PORTFOLIO, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useLogoutMutation = () =>
	useMutation({
		mutationFn: () => {
			return get(API_ENDPOINTS.GET_LOGOUT);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useCountryListQuery = () =>
	useQuery({
		queryFn: async () => {
			try {
				const response = await get(`${API_ENDPOINTS.GET_COUNTRY_LIST}`);
				return handleResponse(response);
			} catch (err) {
				handleError(err);
			}
		},
		queryKey: ['countryList'],
		staleTime: Infinity,
	});

export const useStateListMutation = () => {
	return useMutation({
		mutationFn: async (params: any) => {
			return get(API_ENDPOINTS.GET_STATE_LIST + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const useCityListMutation = () => {
	return useMutation({
		mutationFn: async (params: any) => {
			return get(API_ENDPOINTS.GET_CITY_LIST + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const useCategoryListQuery = () =>
	useQuery({
		queryFn: async () => {
			try {
				const response = await get(`${API_ENDPOINTS.GET_CATEGORY_LIST}`);
				return handleResponse(response);
			} catch (err) {
				handleError(err);
			}
		},
		queryKey: ['categoryList'],
		staleTime: Infinity,
	});

export const useTagListMutation = () => {
	return useMutation({
		mutationFn: async (params: any) => {
			return get(API_ENDPOINTS.GET_TAGS_LIST + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const useTagListQuery = () =>
	useQuery({
		queryFn: async () => {
			try {
				const response = await get(`${API_ENDPOINTS.GET_TAGS_LIST}`);
				return handleResponse(response);
			} catch (err) {
				handleError(err);
			}
		},
		queryKey: ['tagList'],
		staleTime: Infinity,
	});

export const useFaqQuery = () => {
	return useQuery({
		queryFn: async () => {
			try {
				const response = await get(`${API_ENDPOINTS.GET_FAQ}`);
				return handleResponse(response);
			} catch (err) {
				handleError(err);
			}
		},
		queryKey: ['get-faq'],
	});
};

export const useProfileQuery = () => {
	return useQuery({
		queryFn: async () => {
			try {
				const response = await get(`${API_ENDPOINTS.GET_PROFILE}`);
				return handleResponse(response);
			} catch (err) {
				handleError(err);
			}
		},
		queryKey: ['get-profile'],
	});
};

export const useProfileListMutation = () => {
	return useMutation({
		mutationFn: async () => {
			return get(API_ENDPOINTS.GET_PROFILE);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const useGetPortfolioListMutation = () => {
	return useQuery({
		queryFn: async () => {
			try {
				const response = await get(API_ENDPOINTS.GET_PORTFOLIO);
				return handleResponse(response);
			} catch (err) {
				handleError(err);
			}
		},
		queryKey: ['get-portfolio'],
	});
};

export const useBucketUrlMutation = () => {
	return useMutation({
		mutationFn: (payload: any) => {
			return get(API_ENDPOINTS.S3_UPLOAD + payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const useChangePasswordMutation = () => {
	return useMutation({
		mutationFn: (payload: any) => {
			return put(API_ENDPOINTS.CHANGE_PASSWORD, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const useReportMutation = () =>
	useMutation({
		mutationFn: (payload: any) => {
			return put(API_ENDPOINTS.PUT_REPORT, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useUpdateEmailPhoneMutation = () =>
	useMutation({
		mutationFn: (payload: any) => {
			return put(API_ENDPOINTS.PUT_UPDATE_EMAIL_PHONE, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useSocialLoginMutation = () =>
	useMutation({
		mutationFn: (payload: any) => {
			return post(API_ENDPOINTS.AUTH_SOCIAL_LOGIN, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
