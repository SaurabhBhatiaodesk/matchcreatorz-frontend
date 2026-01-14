import { ChatBoxUI } from 'components';
import React, { useEffect, useRef } from 'react';
import useAuthStore from 'store/auth';
import useChatStore from 'store/chat';
import { getSupportChatHistory } from 'store/socket';

const SupportChats: React.FC = () => {
	const { adminData }: Record<string, any> = useAuthStore((state) => state ?? {});
	const lastMessageRef = useRef<HTMLDivElement | null>(null);

	const { chatMessages } = useChatStore((state: any) => ({
		chatMessages: state.chatMessages,
		chatUser: state.chatUser,
		requestId: state.requestId,
		hasMore: state.hasMore,
		userChatList: state.userChatList,
	}));

	useEffect(() => {
		setTimeout(() => {
			getSupportChatHistory(1, 20);
		}, 100);
	}, []);

	useEffect(() => {
		if (lastMessageRef.current) {
			lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [chatMessages]);

	return (
		<div>
			<h4 className="main-subtitle mb-30">Chats</h4>
			<ChatBoxUI
				chatUser={adminData}
				selectedTab={'chats'}
				chatMessages={chatMessages}
				isSupportChat={true}
			/>
		</div>
	);
};

export default SupportChats;
