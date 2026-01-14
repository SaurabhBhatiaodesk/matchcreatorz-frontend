import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
import useChatStore from './chat';

interface SocketState {
	newMessageCount: any;
	socket: Socket | null;
	token: string | null;
	senderId: number | null;
	roomId: number | null;
	connect: () => void;
	disconnect: () => void;
	setToken: (token: string) => void;
	setSenderId: (senderId: number) => void;
	setRoomId: (roomId: number) => void;
	sendMessage: (messageTo: number, messageValue: any, messageType: string) => void;
	sendSupportMessage: (messageTo: number, messageValue: any, messageType: string) => void;
	saveSocketId: (socketId: string) => void;
	getChatHistory: (page: number, limit: number) => void;
	getSupportChatHistory: (page: number, limit: number) => void;
	getUserChatList: (page: number, limit: number) => void;
	setReadChat: () => void;
	clearChat: () => void;
	chatInit: () => void;
}

const storageData = localStorage.getItem('auth')
	? JSON.parse(localStorage.getItem('auth')!)
	: sessionStorage.getItem('auth')
		? JSON.parse(sessionStorage.getItem('auth')!)
		: {};
const tokenFromStorage = storageData?.state?.userInfo?.token ?? '';
const senderIdFromStorage = storageData?.state?.userInfo?.id ?? null;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const userType = storageData?.state?.userInfo?.user?.type;

const socketStore: any = (set: any, get: any) => ({
	socket: null,
	token: tokenFromStorage,
	senderId: senderIdFromStorage,
	roomId: null,
	newMessageCount: 0,
	connect: () => {
		const newSocket = io(SOCKET_URL, {
			query: {
				token: get().token,
			},
		});
		set({ socket: newSocket });
		newSocket.on('connect', () => {
			const { token, senderId } = get();
			if (token && senderId) {
				newSocket.emit('chatInit', { token, senderId });
			}
		});

		newSocket.on('new-message', (message: any) => {
			const { chatMessages, setChatMessages, chatUser } = useChatStore.getState();
			if (message?.sender?.id === chatUser?.id) {
				const updatedMessages: any = [
					...(Array.isArray(chatMessages) ? chatMessages : []),
					message,
				];
				setReadChat();
				setChatMessages(updatedMessages);
				getChatHistory(1, 20);
			}
			set((state: any) => ({
				newMessageCount: state.newMessageCount + 1,
			}));
			if (message) {
				getUserChatList(1, 20);
			}
		});

		newSocket.on('update-message', () => {
			getChatHistory(1, 20);
		});

		newSocket.on('new-support', (message: any) => {
			const { chatMessages, setChatMessages } = useChatStore.getState();
			const updatedMessages: any = [...(Array.isArray(chatMessages) ? chatMessages : []), message];
			setChatMessages(updatedMessages);
			set((state: any) => ({
				newMessageCount: state.newMessageCount + 1,
			}));
			if (message) {
				getSupportChatHistory(1, 20);
			}
		});
	},

	disconnect: () => {
		set((state: any) => {
			state.socket?.off();
			state.socket?.disconnect();
			return { socket: null };
		});
	},

	setToken: (token: string) => {
		set({ token });
	},

	setSenderId: (senderId: number) => {
		set({ senderId });
	},

	setRoomId: (roomId: number) => {
		set({ roomId });
	},

	saveSocketId: (socketId: string) => {
		set((state: any) => {
			const { socket, token } = state;
			if (socket && token) {
				socket.emit('saveSocketId', { socketId, headers: { Authorization: `Bearer ${token}` } });
			}
			return state;
		});
	},

	getChatHistory: (page: number, limit: number) => {
		set((state: any) => {
			const { socket, token, senderId } = state;
			if (socket && token && senderId) {
				socket.emit('chatHistory', { token, senderId, page, limit }, (response: any) => {
					const { setChatUser, setRequestId, setChatMessages, setHasMore, chatMessages } =
						useChatStore.getState();
					const updateChatUser =
						chatMessages?.length > 0 && page !== 1
							? [...chatMessages, ...(response?.data?.messages ?? {})]
							: (response?.data?.messages ?? []);
					setChatUser(response?.data?.senderInfo);
					setRequestId(response?.data?.chatRequestId);
					setHasMore(response?.data?.hasMore);
					setChatMessages(updateChatUser?.reverse());
				});
			}
			return state;
		});
	},

	getUserChatList: (page: number, limit: number) => {
		set((state: any) => {
			const { socket, token, senderId } = state;
			if (socket && token && senderId) {
				socket.emit('chatList', { token, senderId, page, limit }, (response: any) => {
					const { setUserChatList, userChatList } = useChatStore.getState();
					if (userChatList.total > 0 && page > 1) {
						setUserChatList({
							...response?.data,
							records: [...userChatList?.records, ...response?.data?.records],
						});
					} else {
						setUserChatList(response?.data);
					}
				});
			}
			return state;
		});
	},

	setReadChat: () => {
		set((state: any) => {
			const { socket, token, senderId } = state;
			if (socket && token && senderId) {
				socket.emit('readChat', { token, senderId }, () => {});
			}
			return state;
		});
	},

	getSupportChatHistory: (page: number, limit: number) => {
		set((state: any) => {
			const { socket, token } = state;
			const { id } = storageData?.state?.adminData ?? '';
			const senderId = id;
			if (socket && token && id) {
				socket.emit(
					'supportHistory',
					{ token, userType, senderId, page, limit },
					(response: any) => {
						const { setChatMessages } = useChatStore.getState();
						setChatMessages(response?.data?.messages?.reverse() ?? []);
					},
				);
			}
			return state;
		});
	},

	sendMessage: (messageTo: number, messageValue: string, messageType: string) => {
		set((state: any) => {
			const { socket, token, senderId } = state;
			if (socket && token && senderId) {
				socket.emit(
					'sendMessage',
					{
						token,
						messageTo,
						messageValue,
						messageType,
					},
					(response: any) => {
						if (response?.success) {
							getUserChatList(1, 20);
						}
					},
				);
			}
			return state;
		});
	},

	sendSupportMessage: (messageTo: number, messageValue: string, messageType: string) => {
		set((state: any) => {
			const { socket, token } = state;
			if (socket && token) {
				socket.emit('sendSupport', {
					token,
					messageTo,
					messageValue,
					messageType,
					userType,
				});
			}
			return state;
		});
	},

	clearChat: async () => {
		set((state: any) => {
			const { socket, token, senderId } = state;
			if (socket && token && senderId) {
				socket.emit(
					'clearChat',
					{
						token,
						senderId,
					},
					(response: any) => {
						getUserChatList(1, 20);
						getChatHistory(1, 20);
						toast.success(response?.message);
					},
				);
			}
			return state;
		});

		await getChatHistory(1, 50);
	},

	chatInit: () => {
		set((state: any) => {
			const { socket, token, senderId } = state;
			if (socket && token && senderId) {
				socket.emit('chatInit', { token, senderId }, (response: any) => {
					set((prevState: any) => ({
						...prevState,
						chatInitResponse: response,
					}));
					get().getUserChatList(1, 20);
					const { setChatMessages, setChatUser } = useChatStore.getState();
					setChatUser(response);
					setChatMessages([]);
					if (response?.success) {
						getChatHistory(1, 20);
					}
				});
			}
			return state;
		});
	},
});

const useSocketStore = create<SocketState>(socketStore);

export const {
	connect,
	disconnect,
	sendMessage,
	sendSupportMessage,
	saveSocketId,
	setToken,
	setSenderId,
	setRoomId,
	getChatHistory,
	clearChat,
	chatInit,
	getUserChatList,
	getSupportChatHistory,
	setReadChat,
	newMessageCount,
} = useSocketStore.getState();

export default useSocketStore;
