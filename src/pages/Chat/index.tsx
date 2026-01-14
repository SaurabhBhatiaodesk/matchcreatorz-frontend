import { ChatBoxUI, ChatListing } from 'components';
import { IMAGE_PATH } from 'constants/imagePaths';
import React, { useEffect, useRef, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChatListMutation, useChatRequestListMutation } from 'services';
import useAuthStore from 'store/auth';
import useChatStore from 'store/chat';
import useSocketStore from 'store/socket';
import './styles.scss';

const Chat: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { activeTabType, id } = location?.state ?? {};
	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const [requestList, setRequestList] = useState<any>();
	const [totalRecord, setTotalRecord] = useState<any>();
	const [selectedTab, setSelectedTab] = useState<string>(activeTabType ?? 'chats');
	const [selectedItem, setSelectedItem] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

	const { mutateAsync: chatRequestListMutation } = useChatRequestListMutation();
	const { mutateAsync: chatListMutation } = useChatListMutation();

	const { chatUser, chatMessages, hasMore, userChatList } = useChatStore((state) => ({
		chatMessages: state?.chatMessages,
		chatUser: state?.chatUser,
		requestId: state?.requestId,
		hasMore: state?.hasMore,
		userChatList: state?.userChatList,
	}));

	const [hasMoreUpdate, setHasMore] = useState(hasMore || true);
	const { chatInit, getChatHistory, setSenderId, newMessageCount, getUserChatList } =
		useSocketStore((state) => ({
			sendMessage: state.sendMessage,
			chatInit: state.chatInit,
			getChatHistory: state.getChatHistory,
			setSenderId: state.setSenderId,
			newMessageCount: state.newMessageCount,
			getUserChatList: state.getUserChatList,
		}));
	const { setUserChatList } = useChatStore.getState();

	useEffect(() => {
		if (selectedTab === 'chats') {
			getChatList(false);
		} else {
			getChatRequestList();
		}
	}, [newMessageCount, selectedTab]);

	useEffect(() => {
		setHasMore(hasMoreUpdate || false);
	}, [hasMore]);

	useEffect(() => {
		handleChat();
		setHasMore(true);
		setCurrentPage(1);
	}, [selectedItem, user?.type]);

	useEffect(() => {
		if (lastMessageRef.current) {
			lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [chatMessages]);

	const lastMessageRef = useRef<HTMLDivElement | null>(null);

	const getChatRequestList = (skip: number = 1) => {
		chatRequestListMutation(`?pagination=true&skip=${skip}&limit=10`)
			.then((res: any) => {
				if (res?.success) {
					if (requestList?.length > 0 && skip > 1) {
						setRequestList([...requestList, ...res?.data?.records]);
						setTotalRecord(res?.data?.total);
					} else {
						setRequestList(res?.data?.records);
						setTotalRecord(res?.data?.total);
					}
					if (activeTabType !== 'chats' && activeTabType !== undefined) {
						const matchedItem = res?.data?.records?.find(
							(temp: any) => temp.buyerId === id || temp.sellerId === id,
						);
						handleItemClick(matchedItem);
					} else {
						handleItemClick(res?.data?.records[0]);
					}
				}
			})
			.catch(() => {})
			.finally(() => {
				navigate(location.pathname, { replace: true, state: null });
			});
	};

	const getChatList = (isDelete: any) => {
		if ((userChatList?.records?.length > 0 && isDelete) || id) {
			if (activeTabType === 'chats' && activeTabType !== undefined) {
				const matchedItem = userChatList?.records?.find(
					(temp: any) => temp.buyerId === id || temp.sellerId === id,
				);
				handleItemClick(matchedItem);
			}
			getUserChatList(1, 20);
			if (isDelete) {
				handleItemClick(userChatList?.records[0]);
			}
		} else {
			chatListMutation(`?pagination=true&skip=1&limit=20`)
				.then((res: any) => {
					if (res?.success) {
						setUserChatList(res?.data);
						if (activeTabType === 'chats' && activeTabType !== undefined) {
							const matchedItem = res?.data?.records?.find(
								(temp: any) => temp.buyerId === id || temp.sellerId === id,
							);
							handleItemClick(matchedItem);
						} else {
							handleItemClick(res?.data?.records[0]);
						}
					}
				})
				.catch(() => {});
		}
	};

	const handleTabSelect = (eventKey: string) => {
		setSelectedTab(eventKey);
		if (eventKey === 'requestSent' || eventKey === 'requestRecieved') {
			handleItemClick(requestList?.[0]);
		} else {
			handleItemClick(userChatList?.records[0]);
		}
		navigate(location.pathname, { replace: true, state: null });
	};

	const handleItemClick = (item: any) => {
		setSelectedItem(item);
	};

	const handleChat = () => {
		if (selectedItem) {
			const messageTo = user?.type === 'BUYER' ? selectedItem?.sellerId : selectedItem?.buyerId;
			setSenderId(messageTo);
			chatInit();
			getChatHistory(currentPage, 20);
		}
	};

	return (
		<div className="chat-page-section">
			<h4 className="main-subtitle mb-30">
				<span className="back-arrow" onClick={() => navigate(-1)}>
					<i className="ri-arrow-left-line"></i>
				</span>{' '}
				Chats
			</h4>
			<Row>
				<Col lg={3}>
					<ChatListing
						onTabSelect={handleTabSelect}
						userType={user?.type}
						selectedTab={selectedTab}
						requestList={requestList}
						onItemClick={handleItemClick}
						setSelectedTab={setSelectedTab}
						chatUser={chatUser}
						handleChatRequestList={getChatRequestList}
						totalRecord={totalRecord}
					/>
				</Col>

				<Col lg={9}>
					<>
						{(selectedTab === 'chats' && userChatList?.records?.length > 0) ||
						(selectedTab !== 'chats' && requestList?.length > 0) ? (
							<ChatBoxUI
								chatUser={chatUser}
								onTabSelect={handleTabSelect}
								chatMessages={chatMessages}
								requestList={requestList}
								selectedTab={selectedTab}
								selectedItem={selectedItem}
								getChatList={getChatList}
								getChatRequestList={getChatRequestList}
								handleChat={handleChat}
							/>
						) : (
							<div className="chat-not-found d-flex flex-column bg-white justify-content-center align-items-center h-100 gap-4">
								<img src={IMAGE_PATH.noChatImage} alt="" />
								<h4 className="main-subtitle mb-0">Welcome to chat</h4>
								<p className="main-description text-center">
									Once you connect with a {user?.type === 'BUYER' ? 'seller' : 'buyer'}, you’ll be
									able to chat and collaborate here
								</p>
							</div>
						)}
					</>
				</Col>
			</Row>
		</div>
	);
};

export default Chat;
