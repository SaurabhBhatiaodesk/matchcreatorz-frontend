import { useMutation, useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from 'constants/endpoints';
import { get, handleError, handleResponse, post, put } from './base.service';

export const useAddAmountMutation = () => {
	return useMutation({
		mutationFn: async (payload: any) => {
			return put(API_ENDPOINTS.WALLET_ADD_AMOUNT, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const useWithdrawRequestQuery = () => {
	return useQuery({
		queryFn: async () => {
			try {
				const response = await get(`${API_ENDPOINTS.GET_WITHDRAW_REQUEST}`);
				return handleResponse(response);
			} catch (err) {
				handleError(err);
			}
		},
		queryKey: ['get-withdraw-request'],
		staleTime: Infinity,
	});
};

export const useWithdrawTransactionQuery = () => {
	return useQuery({
		queryFn: async () => {
			try {
				const response = await get(`${API_ENDPOINTS.GET_WITHDRAW_TRANSACTION}`);
				return handleResponse(response);
			} catch (err) {
				handleError(err);
			}
		},
		queryKey: ['get-withdraw-transaction'],
		staleTime: Infinity,
	});
};

export const useWithdrawTransactionMutation = () => {
	return useMutation({
		mutationFn: async (params: any) => {
			return get(`${API_ENDPOINTS.GET_WITHDRAW_TRANSACTION + params}`);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const usePaymentSuccessMutation = () => {
	return useMutation({
		mutationFn: async (params: any) => {
			return get(`${API_ENDPOINTS.GET_WALLET_SUCCESS + params}`);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const useConnectListQuery = () =>
	useQuery({
		queryFn: async () => {
			try {
				const response = await get(`${API_ENDPOINTS.GET_CONNECT_INFO}`);
				return handleResponse(response);
			} catch (err) {
				handleError(err);
			}
		},
		queryKey: ['connect-list'],
		staleTime: Infinity,
	});

export const useTotalConnectsListQuery = () =>
	useQuery({
		queryFn: async () => {
			try {
				const response = await get(`${API_ENDPOINTS.GET_TOTAL_CONNECTS}`);
				return handleResponse(response);
			} catch (err) {
				handleError(err);
			}
		},
		queryKey: ['total-connects-list'],
		staleTime: Infinity,
	});

export const useWalletAmountMutation = () => {
	return useMutation({
		mutationFn: async () => {
			return get(API_ENDPOINTS.GET_WALLET);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const useBuyConnectsMutation = () => {
	return useMutation({
		mutationFn: async (payload: any) => {
			return put(API_ENDPOINTS.BUY_CONNECTS, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};

export const useConnectTransactionsListQuery = () =>
	useQuery({
		queryFn: async () => {
			try {
				const response = await get(`${API_ENDPOINTS.GET_CONNECT_TRANSACTIONS}`);
				return handleResponse(response);
			} catch (err) {
				handleError(err);
			}
		},
		queryKey: ['connect-transactions'],
		staleTime: Infinity,
	});

export const useWithdrawMoneyMutation = () => {
	return useMutation({
		mutationFn: async (payload: any) => {
			return post(API_ENDPOINTS.POST_WITHDRAW_REQUEST, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
};
