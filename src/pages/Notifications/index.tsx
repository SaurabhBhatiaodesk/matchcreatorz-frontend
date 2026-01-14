import { NotificationSkeleton, PaginationBox } from 'components';
import NoResultFound from 'components/NoResultFound';
import { IMAGE_PATH } from 'constants/imagePaths';
import { S3_URL } from 'constants/index';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationsMutation } from 'services';
import { setNewNotificationAlert } from 'store/chat';
import { dataLimits, getNotificationURL, notificationFormatTime } from 'utils';
import './style.scss';
import useAuthStore from 'store/auth';

const Notifications: React.FC = () => {
	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const navigate = useNavigate();
	const limit = dataLimits?.notificationsListLimit;
	const { mutateAsync: notificationsMutation, isPending: isNotification } =
		useNotificationsMutation();
	const [notificationList, setNotificationList] = useState<any>({});
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		notificationsMutation(`?pagination=false&skip=${currentPage}&limit=${limit}`)
			.then((res: any) => {
				if (res?.success) {
					setNotificationList(res?.data);
					setNewNotificationAlert(false);
				}
			})
			.catch(() => {});
	}, [currentPage]);

	const handlePageChange = (page: number) => {
		if (currentPage === page) return;
		setCurrentPage(page);
	};

	const handleClick = async (metaData: any, senderId: number) => {
		const { type, serviceId, bidId, bookingId } = metaData;
		const redirectTo = await getNotificationURL(
			navigate,
			type,
			serviceId,
			bidId,
			bookingId,
			senderId,
			user?.type,
		);
		if (redirectTo) navigate(redirectTo);
	};

	return (
		<>
			<h3 className="main-subtitle mb-30">Notification</h3>
			{!isNotification ? (
				<>
					{notificationList?.total > 0 ? (
						<div className="notification-box">
							{notificationList?.records.map((item: any) => (
								<>
									{user?.type !== item?.senderType && (
										<div
											key={item?.id}
											className="notification-box-content d-flex"
											onClick={() => handleClick(item?.metaData, item?.senderId)}
										>
											<div className="notification-box-content-icon d-flex align-items-center justify-content-center position-relative">
												<img
													src={
														item?.sender?.avatar
															? S3_URL + item?.sender?.avatar
															: IMAGE_PATH.smallLogo
													}
													alt=""
												/>
												<span className="active-dot"></span>
											</div>
											<div className="d-flex flex-column gap-2">
												<p className="mb-0 notification-box-content-text">{item?.description}</p>
												<span className="notification-box-content-date">
													{notificationFormatTime(item?.created)}
												</span>
											</div>
										</div>
									)}
								</>
							))}
						</div>
					) : (
						<NoResultFound />
					)}
				</>
			) : (
				<NotificationSkeleton limit={limit} />
			)}
			{notificationList?.total > 0 && (
				<div className="d-flex justify-content-center pt-4">
					<PaginationBox
						totalItems={notificationList?.total ?? 1}
						currentPage={currentPage}
						limit={limit}
						onPageChange={handlePageChange}
					/>
				</div>
			)}
		</>
	);
};

export default Notifications;
