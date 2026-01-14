import { IMAGE_PATH } from 'constants/imagePaths';
import { S3_URL } from 'constants/index';
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import useAuthStore from 'store/auth';
import useChatStore from 'store/chat';
import { setModalConfig } from 'store/common';
import './style.scss';

interface ChatHeaderProps {
	chatUser: any;
	getChatList: any;
	getChatRequestList: any;
	selectedItem: any;
	selectedTab: any;
	requestList: any;
	isSupportChat: boolean;
	onTabSelect: any;
	handleChat: any;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
	chatUser,
	getChatRequestList,
	getChatList,
	selectedItem,
	selectedTab,
	requestList,
	isSupportChat,
	onTabSelect,
}) => {
	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const { chatMessages, requestId } = useChatStore((state: any) => ({
		chatMessages: state.chatMessages,
		requestId: state.requestId,
		userChatList: state.userChatList,
	}));

	const handleSendOffer = (receiverId: any) => {
		setModalConfig({
			visible: true,
			id: receiverId,
			type: 'sendOffer',
			onClick: getChatList,
		});
	};

	const handleAction = () => {
		getChatRequestList();
		if (requestList?.length === 1) {
			onTabSelect('chats');
		}
	};

	const handleWithdrawRequest = (id: any) => {
		setModalConfig({
			visible: true,
			id: id,
			onClick: getChatRequestList,
			type: 'chatWithdrawRequest',
		});
	};
	const handleChatStatusUpdate = (id: any, status: any) => {
		setModalConfig({
			visible: true,
			id: id,
			data: { status },
			onClick: handleAction,
			type: 'chatRejectAccept',
		});
	};

	const handleChatClearDelete = (id: any, status: any) => {
		setModalConfig({
			visible: true,
			id: id,
			data: { status },
			type: 'chatClearDelete',
			onClick: getChatList,
		});
	};

	return (
		<div className="chat-box-user-name d-flex justify-content-between">
			<div className="d-flex gap-3 align-items-center">
				<div className="position-relative">
					<img
						src={chatUser?.avatar ? `${S3_URL + chatUser?.avatar}` : IMAGE_PATH.userIcon}
						alt=""
						className="profile"
					/>
					<span className={`${chatUser?.isOnline === true ? 'online-dot' : ''}`}></span>
				</div>
				<div className="d-flex flex-column gap-1">
					<h6 className="name mb-0">{chatUser?.fullName}</h6>
					{chatUser?.isOnline && (
						<span className="status">{chatUser?.isOnline === true ? 'Online' : 'Offline'}</span>
					)}
				</div>
			</div>

			{!isSupportChat && (
				<div className="d-flex gap-3 align-items-center">
					{selectedTab === 'chats' ? (
						<button
							className="chat-box-offer-btn"
							onClick={() =>
								handleSendOffer(
									user?.type === 'BUYER' ? selectedItem?.sellerId : selectedItem?.buyerId,
								)
							}
						>
							+ Offer
						</button>
					) : selectedTab === 'requestSent' ? (
						<button
							className="chat-box-offer-btn"
							onClick={() => handleWithdrawRequest(selectedItem?.id)}
						>
							Withdraw
						</button>
					) : requestList?.length > 0 ? (
						<>
							<button
								className="chat-box-common-btn bg-transparent"
								onClick={() => handleChatStatusUpdate(selectedItem?.id, 'Reject')}
							>
								<i className="ri-close-fill"></i> Reject
							</button>
							<button
								className="chat-box-common-btn bg-transparent red-border"
								onClick={() => handleChatStatusUpdate(selectedItem?.id, 'Accept')}
							>
								<i className="ri-check-fill"></i> Accept
							</button>
						</>
					) : null}
					{selectedTab === 'chats' ? (
						<Dropdown className="chat-box-dropdown">
							<Dropdown.Toggle className="bg-transparent border-0 p-0 " id="dropdown-basic">
								<i className="ri-more-2-fill"></i>
							</Dropdown.Toggle>

							<Dropdown.Menu className="chat-box-dropdown-menu">
								<Dropdown.Item
									onClick={() => handleChatClearDelete(chatUser?.id, 'CLEAR')}
									disabled={chatMessages?.length > 0 ? false : true}
								>
									<i className="ri-chat-off-fill me-2 disabled"></i>
									Clear Chat
								</Dropdown.Item>
								<Dropdown.Item onClick={() => handleChatClearDelete(requestId, 'DELETE')}>
									<i className="ri-delete-bin-7-line me-2"></i>
									Delete Chat
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					) : null}
				</div>
			)}
		</div>
	);
};
export default ChatHeader;
