import { IMAGE_PATH } from 'constants/imagePaths';
import { S3_URL } from 'constants/index';
import { useEffect, useState } from 'react';
import { Form, Tab, Tabs } from 'react-bootstrap';
import ReactSelect from 'react-select';
import { setModalConfig } from 'store/common';
import './styles.scss';
import useChatStore from 'store/chat';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getUserChatList } from 'store/socket';
import { Loader } from 'components/Common';

interface ChatListingProps {
	onTabSelect: (eventKey: string) => void;
	userType: string;
	requestList: any;
	onItemClick: any;
	handleChatRequestList: any;
	selectedTab: string;
	setSelectedTab: any;
	chatUser: any;
	totalRecord: any;
}

const ChatListing: React.FC<ChatListingProps> = ({
	onTabSelect,
	userType,
	requestList,
	onItemClick,
	handleChatRequestList,
	selectedTab,
	setSelectedTab,
	chatUser,
	totalRecord,
}) => {
	const [keyword, setKeyword] = useState('');
	const [requestListData, setRequestListData] = useState<any>(requestList || []);
	const [filteredRequestList, setFilteredRequestList] = useState<any[]>(requestList || []);
	const [keywordRequestList, setKeywordRequestList] = useState('');
	const { userChatList } = useChatStore((state: { userChatList: any }) => ({
		userChatList: state.userChatList,
	}));

	const [chatData, setChatData] = useState(userChatList?.records || []);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMoreUpdate, setHasMore] = useState(userChatList?.hasMore || true);

	const [filteredChatList, setFilteredChatList] = useState<any[]>(userChatList?.records || []);

	useEffect(() => {
		setRequestListData(requestList);
		setFilteredChatList(userChatList?.records);
		setFilteredRequestList(requestList);
		setChatData(userChatList?.records);
	}, [onItemClick, requestList, userChatList]);

	const loadMoreFunc = () => {
		setCurrentPage((prev: any) => prev + 1);
		if (hasMoreUpdate && selectedTab === 'chats') {
			getUserChatList(currentPage + 1, 20);
		} else {
			handleChatRequestList(currentPage + 1);
		}
		setHasMore(false);
	};

	const handleSelect = (eventKey: string | null) => {
		if (eventKey) {
			setSelectedTab(eventKey);
			onTabSelect(eventKey);
			setKeyword('');
			setKeywordRequestList('');
			setCurrentPage(1);
		}
	};

	const handleAction = () => {
		handleChatRequestList();
		if (requestList?.length === 1) {
			setSelectedTab('chats');
			onTabSelect('chats');
		}
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

	const formatTime = (isoDate: string) => {
		if (!isoDate) return;
		const date = new Date(isoDate);
		return new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true,
		}).format(date);
	};

	return (
		<div className="chat-listing ">
			<Tabs
				defaultActiveKey="chats"
				className="custom-tabs justify-content-center mb-4 w-100"
				activeKey={selectedTab}
				onSelect={handleSelect}
			>
				<Tab eventKey="chats" title="Chats">
					<Form className="header-search mb-4">
						<i className="ri-search-2-line search"></i>
						<ReactSelect
							isSearchable
							placeholder="Search"
							menuIsOpen={false}
							onInputChange={(newInputValue, action) => {
								if (action.action === 'input-change') setKeyword(newInputValue);
							}}
							inputValue={keyword}
							components={{
								DropdownIndicator: () =>
									keyword ? (
										<i
											className="ri-close-circle-line close"
											onClick={() => {
												setKeyword('');
												setChatData(userChatList?.records);
											}}
											onTouchEnd={() => {
												setKeyword('');
												setChatData(userChatList?.records);
											}}
										></i>
									) : null,
								IndicatorSeparator: () => null,
							}}
							className="form-react-select"
							classNamePrefix="form-react-select"
							autoFocus
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();

									const filteredData = chatData.filter((item: any) => {
										const name =
											(userType === 'BUYER' ? item?.seller?.fullName : item?.buyer?.fullName) || '';

										return name.toLowerCase().includes(keyword.toLowerCase());
									});

									setFilteredChatList(filteredData);
								}
							}}
						/>
					</Form>
					{filteredChatList?.length > 0 ? (
						<div
							id="infiniteDiv-msg-list"
							className="chat-listing-result"
							style={{
								width: '100%',
								overflowY: 'auto',
								margin: 'auto',
								display: 'flex',
							}}
						>
							<InfiniteScroll
								dataLength={filteredChatList?.length}
								next={loadMoreFunc}
								hasMore={hasMoreUpdate}
								loader={
									filteredChatList?.length >= 1 && (
										<div className="d-flex justify-content-center align-items-center">
											<Loader />
										</div>
									)
								}
								scrollableTarget="infiniteDiv-msg-list"
							>
								{filteredChatList?.map((item: any, index: any) => (
									<div
										className="chat-listing-result-person d-flex gap-3 align-items-center w-100"
										key={index}
										onClick={() => selectedTab === 'chats' && onItemClick(item, true)}
									>
										<img
											src={
												item && (userType === 'BUYER' ? item?.seller?.avatar : item?.buyer?.avatar)
													? `${S3_URL}${userType === 'BUYER' ? item?.seller?.avatar : item?.buyer?.avatar}`
													: IMAGE_PATH?.userIcon
											}
											alt=""
											className="profile"
										/>
										<div className="d-flex flex-column gap-2 w-100 ">
											<h6 className="name d-flex gap-2 mb-0 align-items-center">
												{userType === 'BUYER' ? item?.seller?.fullName : item?.buyer?.fullName}
												<span className="time">{formatTime(item?.updated)}</span>
											</h6>
											{item?.latestMessageCount > 0 ? (
												<p className="description new mb-0 d-flex justify-content-between">
													{item?.messageType === 'TEXT' ? (
														<>
															{item?.latestMessage?.length > 30 ? (
																<>{item?.latestMessage.slice(0, 30)}...</>
															) : (
																item?.latestMessage
															)}
														</>
													) : (
														<div className="d-flex gap-1 align-items-center">
															<i
																className={
																	item?.messageType === 'DOCUMENT'
																		? 'ri-file-text-line'
																		: 'ri-image-2-fill'
																}
															></i>
															{item?.messageType === 'DOCUMENT' ? 'Document' : 'Image'}
														</div>
													)}

													{item?.unreadCount > 0 &&
														item?.buyerId !== chatUser?.id &&
														item?.sellerId !== chatUser?.id && (
															<span className="new-chat">{item?.unreadCount}</span>
														)}
												</p>
											) : null}
										</div>
									</div>
								))}
							</InfiniteScroll>
						</div>
					) : (
						<div className="chat-listing-result">
							<span className="">No Result Found</span>
						</div>
					)}
				</Tab>

				<Tab
					eventKey={userType === 'BUYER' ? 'requestSent' : 'requestRecieved'}
					title={userType === 'BUYER' ? 'Request Sent' : 'Request Received'}
				>
					<Form className="header-search mb-4">
						<i className="ri-search-2-line search"></i>
						<ReactSelect
							isSearchable
							placeholder="Search"
							menuIsOpen={false}
							onInputChange={(newInputValue, action) => {
								if (action.action === 'input-change') setKeywordRequestList(newInputValue);
							}}
							inputValue={keywordRequestList}
							components={{
								DropdownIndicator: () =>
									keywordRequestList ? (
										<i
											className="ri-close-circle-line close"
											onClick={() => {
												setKeywordRequestList('');
												setFilteredRequestList(requestListData);
											}}
											onTouchEnd={() => {
												setKeywordRequestList('');
												setFilteredRequestList(requestListData);
											}}
										></i>
									) : null,
								IndicatorSeparator: () => null,
							}}
							className="form-react-select"
							classNamePrefix="form-react-select"
							autoFocus
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();

									const filteredData = requestListData.filter((item: any) => {
										const name =
											(userType === 'BUYER' ? item?.seller?.fullName : item?.buyer?.fullName) || '';

										return name.toLowerCase().includes(keywordRequestList.toLowerCase());
									});
									setFilteredRequestList(filteredData);
								}
							}}
						/>
					</Form>
					{filteredRequestList?.length > 0 ? (
						<div
							id="infiniteDiv-request-list"
							className="chat-listing-result"
							style={{
								width: '100%',
								overflowY: 'auto',
								margin: 'auto',
								display: 'flex',
							}}
						>
							<InfiniteScroll
								dataLength={filteredRequestList?.length}
								next={loadMoreFunc}
								hasMore={filteredRequestList.length < totalRecord ? true : false}
								loader={
									filteredRequestList?.length >= 1 && (
										<div className="d-flex justify-content-center align-items-center">
											<Loader />
										</div>
									)
								}
								scrollableTarget="infiniteDiv-request-list"
							>
								{filteredRequestList?.map((item: any, index: any) => (
									<div
										className="chat-listing-result-person d-flex gap-3 align-items-center w-100"
										key={index}
										onClick={() => onItemClick(item)}
									>
										<img
											src={
												item && (userType === 'BUYER' ? item?.seller?.avatar : item?.buyer?.avatar)
													? `${S3_URL}${userType === 'BUYER' ? item?.seller?.avatar : item?.buyer?.avatar}`
													: IMAGE_PATH.userIcon
											}
											alt=""
											className="profile"
										/>
										<div className="d-flex flex-column gap-2 w-100">
											<div className="d-flex justify-content-between">
												<h6 className="name d-flex gap-2 mb-0 align-items-center">
													{userType === 'BUYER' ? item?.seller?.fullName : item?.buyer?.fullName}
													<span className="time">{formatTime(item?.updated)}</span>
												</h6>
												{userType === 'BUYER' && <span className="green-text">{item?.status}</span>}
											</div>
											<p className="description mb-0">{item?.latestMessage}</p>
											{userType !== 'BUYER' && (
												<div className="d-flex gap-3 mt-2">
													<button
														className="chat-box-common-btn bg-transparent"
														onClick={() => handleChatStatusUpdate(item?.id, 'Reject')}
													>
														<i className="ri-close-fill"></i> Reject
													</button>
													<button
														className="chat-box-common-btn bg-transparent red-border"
														onClick={() => handleChatStatusUpdate(item?.id, 'Accept')}
													>
														<i className="ri-check-fill"></i> Accept
													</button>
												</div>
											)}
										</div>
									</div>
								))}
							</InfiniteScroll>
						</div>
					) : (
						<div className="chat-listing-result">
							<p>{userType === 'BUYER' ? 'No Request Sent' : 'No Request Received'}</p>
						</div>
					)}
				</Tab>
			</Tabs>
		</div>
	);
};

export default ChatListing;
