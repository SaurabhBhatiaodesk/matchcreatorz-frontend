import { useMutation, useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from 'constants/endpoints';
import { del, get, handleError, handleResponse, put } from './base.service';

export const useSearchSuggestionMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_SEARCH_SUGGESTION + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useServicesMutation = (options: any) =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_SERVICES + params, options);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useTopSellerMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_TOP_SELLER + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useHomeTopSellerListMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_HOME_TOP_SELLER_LIST + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useAddFavUserMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.ADD_FAVORITE_USER + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useAddAvatarUserMutation = () =>
	useMutation({
		mutationFn: (payload: any) => {
			return put(API_ENDPOINTS.PUT_UPDATE_AVATAR, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useRemoveFavUserMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.REMOVE_FAVORITE_USER + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useDashboardQuery = () => {
	return useQuery({
		queryFn: async () => {
			try {
				const response = await get(`${API_ENDPOINTS.GET_USER_DASHBOARD}`);
				return handleResponse(response);
			} catch (err) {
				handleError(err);
			}
		},
		queryKey: ['get-dashboard'],
		staleTime: Infinity,
	});
};

export const useGetUserInfoMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_USER_INFO + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useGetPublicUserInfoMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_PUBLIC_INFO + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useGetServiceInfoMutation = (options: any) =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_SERVICE_INFO + params, options);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const usePriceRangeMutation = () => {
	return useMutation({
		mutationFn: async () => {
			return get(API_ENDPOINTS.GET_PRICE_RANGE);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const useProfileListQuery = () =>
	useQuery({
		queryFn: async () => {
			try {
				const response = await get(`${API_ENDPOINTS.GET_PRICE_RANGE}`);
				return handleResponse(response);
			} catch (err) {
				handleError(err);
			}
		},
		queryKey: ['priceList'],
		staleTime: Infinity,
	});

export const useResponseTimeMutation = () => {
	return useMutation({
		mutationFn: async () => {
			return get(API_ENDPOINTS.GET_RESPONSE_TIME);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const useResponseListQuery = () =>
	useQuery({
		queryFn: async () => {
			try {
				const response = await get(`${API_ENDPOINTS.GET_RESPONSE_TIME}`);
				return handleResponse(response);
			} catch (err) {
				handleError(err);
			}
		},
		queryKey: ['responseList'],
		staleTime: Infinity,
	});

export const useDeleteFaqMutation = () => {
	return useMutation({
		mutationFn: async (params: any) => {
			return del(API_ENDPOINTS.DELETE_FAQ + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const useDeletePortfolioMutation = () => {
	return useMutation({
		mutationFn: async (params: any) => {
			return del(API_ENDPOINTS.DELETE_PORTFOLIO + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const useAddBidMutation = () => {
	return useMutation({
		mutationFn: async (payload: any) => {
			return put(API_ENDPOINTS.PUT_ADD_BID, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const useFavouriteSellerListMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_FAVOURITE_LIST + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useBannerListMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_BANNER_LIST + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useTestimonialListMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_TESTIMONIAL_LIST + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useNotificationsMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_NOTIFICATIONS + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
