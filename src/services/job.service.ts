import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from 'constants/endpoints';
import { del, get, handleError, handleResponse, post, put } from './base.service';

export const usePostJobMutation = () =>
	useMutation({
		mutationFn: (payload: any) => {
			return put(API_ENDPOINTS.ADD_EDIT_SERVICES, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useMyServicesMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_MY_SERVICES + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useDeleteServicesMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return del(API_ENDPOINTS.DELETE_SERVICES + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useBidListMutation = () => {
	return useMutation({
		mutationFn: async (params: any) => {
			return get(API_ENDPOINTS.GET_BID + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const useBidInfoMutation = () => {
	return useMutation({
		mutationFn: async (params: any) => {
			return get(API_ENDPOINTS.GET_BID_INFO + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const useBidWithdrawMutation = () => {
	return useMutation({
		mutationFn: async (payload: any) => {
			return put(API_ENDPOINTS.PUT_WITHDRAW_BID, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const useOfferStatusUpdateMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_OFFER_STATUS_UPDATE + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useUpdateStatusBidMutation = () => {
	return useMutation({
		mutationFn: async (payload: any) => {
			return put(API_ENDPOINTS.PUT_UPDATE_STATUS_BID, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const useUpdateStatusJobMutation = () => {
	return useMutation({
		mutationFn: async (payload: any) => {
			return put(API_ENDPOINTS.PUT_UPDATE_STATUS_JOB, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const useCreateBookingMutation = () => {
	return useMutation({
		mutationFn: async (payload: any) => {
			return post(API_ENDPOINTS.POST_CREATE_BOOKING, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const useGetBookingListMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_BOOKING_LIST + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useGetBookingInfoMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_BOOKING_INFO + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const usePostBookingMilestoneMutation = () =>
	useMutation({
		mutationFn: (payload: any) => {
			return post(API_ENDPOINTS.POST_BOOKING_MILESTONE, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useDeleteBookingMilestoneMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return del(API_ENDPOINTS.DELETE_BOOKING_MILESTONE + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useBookingStatusUpdateMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_BOOKING_STATUS_UPDATE + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const usePostBookingCompleteProcessMutation = () =>
	useMutation({
		mutationFn: (payload: any) => {
			return put(API_ENDPOINTS.PUT_BOOKING_COMPLETE_PROCESS, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useBookingRequestUpdateMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_BOOKING_REQUEST_UPDATE + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const usePutBookingCounterProposedMutation = () =>
	useMutation({
		mutationFn: (payload: any) => {
			return put(API_ENDPOINTS.PUT_BOOKING_COUNTER_PROPOSED, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useGetAdminSettingMutation = (options: any) =>
	useMutation({
		mutationFn: () => {
			return get(API_ENDPOINTS.GET_ADMIN_SETTING, options);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useBookingReviewMutation = () => {
	return useMutation({
		mutationFn: async (payload: any) => {
			return post(API_ENDPOINTS.POST_ADD_REVIEW, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};
