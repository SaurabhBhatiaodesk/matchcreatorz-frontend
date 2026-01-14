import { Loader } from 'components/Common';
import { S3_URL } from 'constants/index';
import React, { useMemo, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import useAuthStore from 'store/auth';
import useChatStore from 'store/chat';
import useSocketStore, { sendSupportMessage } from 'store/socket';
import './style.scss';
import {
	formatDateTime,
	formatRelativeDate,
	handleDownload,
	imageBucketUrl,
	isValidFileSize,
	isValidFileType,
} from 'utils';
import OfferBox from '../OfferBox';
import { compressFileSize, useBucketUrlMutation, useUploadFileMutation } from 'services';
import ChatHeader from './ChatHeader';
import { setModalConfig } from 'store/common';

interface ChatBoxUIProps {
	requestList?: any;
	chatUser: any;
	selectedItem?: any;
	selectedTab: string;
	getChatRequestList?: any;
	getChatList?: any;
	isSupportChat: boolean;
	onTabSelect?: any;
	handleChat?: any;
	chatMessages?: any;
}

const ChatBoxUI: React.FC<ChatBoxUIProps> = ({
	isSupportChat,
	selectedTab,
	chatUser,
	requestList,
	selectedItem,
	getChatRequestList,
	getChatList,
	onTabSelect,
	handleChat,
}) => {
	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const { chatMessages, hasMore } = useChatStore((state) => ({
		chatMessages: state.chatMessages,
		requestId: state.requestId,
		hasMore: state.hasMore,
		userChatList: state.userChatList,
	}));
	const { sendMessage, getChatHistory } = useSocketStore((state) => ({
		sendMessage: state.sendMessage,
		chatInit: state.chatInit,
		getChatHistory: state.getChatHistory,
		setSenderId: state.setSenderId,
		newMessageCount: state.newMessageCount,
		getUserChatList: state.getUserChatList,
	}));

	const [currentPage, setCurrentPage] = useState(1);
	const [hasMoreUpdate, setHasMore] = useState(hasMore || true);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [messageValue, setMessageValue] = useState('');

	const { mutateAsync: bucketUrlMutation } = useBucketUrlMutation();
	const { mutateAsync: uploadFileMutation } = useUploadFileMutation();

	const messageTo = user?.type === 'BUYER' ? selectedItem?.sellerId : selectedItem?.buyerId;

	const loadMoreFunc = () => {
		if (hasMoreUpdate) {
			setCurrentPage((prev: any) => prev + 1);
			getChatHistory(currentPage + 1, 20);
			setHasMore(false);
		}
	};

	function readFile(file: File): Promise<string> {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.addEventListener('load', () => resolve(reader.result as string), false);
			reader.readAsDataURL(file);
		});
	}

	const triggerFileInput = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
			const fileExtension = file.name.split('.').pop()?.toLowerCase();

			if (fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'jpeg') {
				const currentMessageType = 'IMAGE';
				await handleImgMessage(event, currentMessageType);
			} else if (fileExtension === 'pdf') {
				const currentMessageType = 'DOCUMENT';
				await handleDocMessage(event, currentMessageType);
			} else {
				console.log('Unsupported file type');
			}
		}
	};

	const handleDocMessage = async (
		event: React.ChangeEvent<HTMLInputElement>,
		messageType: string,
	) => {
		const file: any = event.target.files?.[0];

		if (file) {
			if (!isValidFileType(file) || !isValidFileSize(file)) {
				return;
			}

			const response = await bucketUrlMutation(`?location=users&type=pdf&count=1`);
			if (response?.data?.length > 0) {
				const signurlData = response?.data[0];

				if (file && signurlData) {
					const requestOptions = {
						method: 'PUT',
						headers: {
							'Content-Type': 'pdf',
						},
						body: file,
					};

					await uploadFileMutation({
						url: signurlData?.url,
						requestOptions,
					});
				}

				if (signurlData) {
					const fileName = signurlData?.filename;

					const newMessage = {
						message: fileName,
						messageType,
						senderType: user.type,
						receiverType: user.type === 'BUYER' ? 'SELLER' : 'BUYER',
						created: new Date().toISOString(),
					};

					setMessageValue(fileName);

					if (isSupportChat) {
						sendSupportMessage(chatUser?.id, fileName, messageType);
					} else {
						sendMessage(messageTo, fileName, messageType);
					}

					const { setChatMessages } = useChatStore.getState();
					const updatedMessages: any = [
						...(Array.isArray(chatMessages) ? chatMessages : []),
						newMessage,
					];
					setChatMessages(updatedMessages);
					setMessageValue('');
				}
			}
		}
	};

	const handleImgMessage = async (
		event: React.ChangeEvent<HTMLInputElement>,
		messageType: string,
	) => {
		const file = event.target.files?.[0];

		if (file) {
			try {
				const imageDataUrl = await readFile(file);
				const response = await fetch(imageDataUrl);
				const blobData = await response.blob();
				const compressedFile = await compressFileSize(blobData);

				const imgPath = await imageBucketUrl(
					compressedFile,
					'image/png',
					compressedFile.size,
					bucketUrlMutation,
					uploadFileMutation,
				);

				if (imgPath) {
					const newMessage = {
						message: imgPath,
						messageType: messageType,
						senderType: user.type,
						receiverType: user.type === 'BUYER' ? 'SELLER' : 'BUYER',
						created: new Date().toISOString(),
					};

					setMessageValue(imgPath);

					if (isSupportChat) {
						sendSupportMessage(chatUser?.id, imgPath, messageType);
					} else {
						sendMessage(messageTo, imgPath, messageType);
					}

					const { setChatMessages } = useChatStore.getState();
					const updatedMessages: any = [
						...(Array.isArray(chatMessages) ? chatMessages : []),
						newMessage,
					];
					setChatMessages(updatedMessages);
					setMessageValue('');
				}
			} catch (error) {
				console.error('Error uploading image:', error);
			}
		}
	};

	const handleSendMessage = async (
		e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>,
		messageType: string,
	) => {
		e?.preventDefault();
		if (messageValue.trim() && (messageTo || chatUser?.id)) {
			const newMessage = {
				message: messageValue,
				messageType,
				senderType: user.type,
				receiverType: user.type === 'BUYER' ? 'SELLER' : 'BUYER',
				created: new Date().toISOString(),
			};
			if (isSupportChat) {
				sendSupportMessage(chatUser?.id, messageValue, messageType);
			} else {
				sendMessage(messageTo, messageValue, messageType);
			}
			const { setChatMessages } = useChatStore.getState();
			const updatedMessages: any = [
				...(Array.isArray(chatMessages) ? chatMessages : []),
				newMessage,
			];
			setChatMessages(updatedMessages);
			setMessageValue('');
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSendMessage(e, 'TEXT');
		}
	};

	const groupedMessages = useMemo(() => {
		if (!chatMessages || chatMessages.length === 0) return {};
		const sortedMessages = chatMessages?.sort(
			(a: any, b: any) => new Date(a.created).getTime() - new Date(b.created).getTime(),
		);

		const groups = sortedMessages.reduce((acc: any, message: any) => {
			const messageDate = new Date(message.created).toDateString();
			if (!acc[messageDate]) {
				acc[messageDate] = [];
			}
			acc[messageDate].push(message);
			return acc;
		}, {});

		return groups;
	}, [chatMessages]);

	const handleImagePreview = (image: any) => {
		setModalConfig({
			visible: true,
			type: 'imagePreview',
			data: { image },
		});
	};

	return (
		<div className="chat-box d-flex flex-column">
			<ChatHeader
				chatUser={chatUser}
				getChatRequestList={getChatRequestList}
				getChatList={getChatList}
				selectedItem={selectedItem}
				selectedTab={selectedTab}
				requestList={requestList}
				isSupportChat={isSupportChat}
				onTabSelect={onTabSelect}
				handleChat={handleChat}
			/>

			<div className="chat-box-detail pb-0">
				{chatMessages?.length > 0 ? (
					<div
						id="infiniteDiv-msg-list"
						className="chat-box-detail"
						style={{
							width: '100%',
							overflowY: 'auto',
							margin: 'auto',
							display: 'flex',
							flexDirection: 'column-reverse',
						}}
					>
						<InfiniteScroll
							dataLength={chatMessages?.length}
							next={loadMoreFunc}
							hasMore={hasMoreUpdate}
							loader={
								chatMessages?.length >= 1 && (
									<div className="d-flex justify-content-center align-items-center">
										<Loader />
									</div>
								)
							}
							scrollableTarget="infiniteDiv-msg-list"
							inverse={true}
						>
							{groupedMessages &&
								Object.keys(groupedMessages).map((groupLabel): any => (
									<React.Fragment key={groupLabel}>
										<div className="chat-day text-center">
											<p className="mb-0">{formatRelativeDate(groupLabel, true)}</p>
										</div>
										{groupedMessages[groupLabel]?.map((message: any, index: any) => (
											<div key={index}>
												<div
													className={`${user?.type === message?.senderType ? 'right-div' : 'left-div'} mb-3`}
												>
													<div
														className={`${user?.type === message?.senderType ? 'right-div-content' : 'left-div-content'} d-flex gap-2 flex-column`}
													>
														<span className="text position-relative">
															{message?.messageType === 'IMAGE' ? (
																<div
																	className="image-box position-relative"
																	style={{ cursor: 'pointer' }}
																	onClick={() => handleImagePreview(message.message)}
																>
																	<img
																		src={`${S3_URL + message.message}`}
																		alt=""
																		className="w-100 h-100"
																	/>
																	<small className="chat-time">
																		{formatDateTime(message.created, true)}
																	</small>
																</div>
															) : message?.messageType === 'DOCUMENT' ? (
																<div className="document-div">
																	<div className="document-box position-relative">
																		<div className="d-flex gap-2 align-items-center">
																			<div className="document-icon">
																				<i className="ri-file-text-line"></i>
																			</div>
																			<p className="mb-0">File.pdf</p>
																		</div>
																		<button
																			className="border-0 p-0 document-info"
																			onClick={() => handleDownload(message.message)}
																		>
																			<i className="ri-download-fill"></i>
																		</button>
																	</div>
																	<small className="chat-time">
																		{formatDateTime(message.created, true)}
																	</small>
																</div>
															) : message?.messageType === 'OFFER' ? (
																<div className="position-relative offer-div">
																	<OfferBox offerMessages={message} page={currentPage} />
																	<small className="chat-time">
																		{formatDateTime(message.created, true)}
																	</small>
																</div>
															) : (
																<>
																	{message.message}
																	<small className="chat-time-text">
																		{formatDateTime(message.created, true)}
																	</small>
																</>
															)}
														</span>
													</div>
												</div>
											</div>
										))}
									</React.Fragment>
								))}
						</InfiniteScroll>
					</div>
				) : (
					<div className="no-chat">No messages yet. Send a message to start the conversation.</div>
				)}
			</div>

			<div className="chat-box-input bg-color1 w-100">
				{selectedTab === 'chats' ? (
					<Form>
						<div className="d-flex w-100 align-items-center">
							<input
								type="file"
								ref={fileInputRef}
								style={{ display: 'none' }}
								accept=".png,.jpg,.jpeg,.pdf"
								onChange={handleFileChange}
							/>
							<button
								type="button"
								className="p-0 border-0 bg-transparent"
								onClick={triggerFileInput}
							>
								<i className="ri-link"></i>
							</button>
							<Form.Group className="w-100">
								<Form.Control
									as="textarea"
									placeholder="Write here..."
									className="text-area"
									value={messageValue}
									onChange={(e) => setMessageValue(e.target.value)}
									onKeyDown={handleKeyPress}
								/>
							</Form.Group>

							<button
								className="p-0 border-0 bg-transparent"
								type="submit"
								onClick={(e) => handleSendMessage(e, 'TEXT')}
							>
								<i className="ri-send-plane-fill"></i>
							</button>
						</div>
					</Form>
				) : (
					<div className="d-flex w-100 align-items-center disabled">
						<button className="p-0 border-0 bg-transparent " type="button">
							<i className="ri-link"></i>
						</button>
						<div className="w-100 request-msg">
							{user?.type === 'BUYER' && selectedTab === 'requestSent'
								? 'You cannot send messages until the seller accepts the request'
								: 'Accept the request to start chat with the buyer'}
						</div>
						<button className="p-0 border-0 bg-transparent " type="button">
							<i className="ri-send-plane-fill"></i>
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default ChatBoxUI;
