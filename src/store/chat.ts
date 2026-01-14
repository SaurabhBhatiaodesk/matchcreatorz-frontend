import { create } from 'zustand';

const chatStore = (set: any) => ({
	userList: [],
	chatMessages: [],
	chatUser: [],
	roomId: null,
	isTypingRooms: [],
	chatListKeyword: '',
	newNotificationAlert: false,
	receiverDetails: [],
	userChatList: [],
	refetchChatDetailsQuery: () => {},
	setUserList: (data: any) => set((state: any) => ({ ...state, userList: data })),
	setChatMessages: (data: any) => set((state: any) => ({ ...state, chatMessages: data })),
	setChatUser: (data: any) => set((state: any) => ({ ...state, chatUser: data })),
	setRequestId: (data: any) => set((state: any) => ({ ...state, requestId: data ?? false })),
	setHasMore: (data: any) => set((state: any) => ({ ...state, hasMore: data })),
	setRoomId: (data: number | null) => set((state: any) => ({ ...state, roomId: data })),
	setIsTypingRooms: (roomId: number) =>
		set((state: any) => {
			if (!state.isTypingRooms.includes(Number(roomId))) {
				return { ...state, isTypingRooms: [...state.isTypingRooms, Number(roomId)] };
			}
			return state;
		}),
	removeIsTypingRoom: (roomId: number) =>
		set((state: any) => ({
			...state,
			isTypingRooms: state.isTypingRooms.filter((id: number) => id !== Number(roomId)),
		})),
	setChatListKeyword: (data: string) =>
		set((state: any) => ({ ...state, chatListKeyword: data || '' })),
	setNewNotificationAlert: (data: boolean) =>
		set((state: any) => ({ ...state, newNotificationAlert: data })),
	setReceiverDetails: (data: any) => set((state: any) => ({ ...state, receiverDetails: data })),
	setRefetchChatDetailsQuery: (data: any) =>
		set((state: any) => ({ ...state, refetchChatDetailsQuery: data })),
	setUserChatList: (data: any) => set((state: any) => ({ ...state, userChatList: data })),
});

const useChatStore = create(chatStore);

export const {
	setUserList,
	setChatMessages,
	setChatUser,
	setRoomId,
	setIsTypingRooms,
	setChatListKeyword,
	setNewNotificationAlert,
	setReceiverDetails,
	setRefetchChatDetailsQuery,
	setRequestId,
	setHasMore,
	setUserChatList,
} = useChatStore.getState();

export default useChatStore;
