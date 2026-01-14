import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from 'constants/endpoints';
import { del, get, handleError, handleResponse, post, put } from './base.service';

export const useSendChatRequestMutation = () =>
	useMutation({
		mutationFn: (payload: any) => {
			return post(API_ENDPOINTS.POST_SEND_CHAT_REQUEST, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useChatRequestListMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_REQUEST_LIST + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useChatListMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_CHAT_LIST + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useChatStatusUpdateMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_CHAT_REQUEST_STATUS_UPDATE + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useChatWithdrawRequestMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_WITHDRAW_CHAT_REQUEST + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useAddUpdateOfferMutation = () =>
	useMutation({
		mutationFn: (payload: any) => {
			return put(API_ENDPOINTS.PUT_ADD_UPDATE_OFFER, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useChatDeleteMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return del(API_ENDPOINTS.DELETE_CHAT + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useOfferInfoMutation = () =>
	useMutation({
		mutationFn: (params: any) => {
			return get(API_ENDPOINTS.GET_OFFER_INFO + params);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});

export const useOfferCounterMutation = () =>
	useMutation({
		mutationFn: (payload: any) => {
			return put(API_ENDPOINTS.PUT_OFFER_COUNTER, payload);
		},
		onSuccess: handleResponse,
		onError: handleError,
	});
