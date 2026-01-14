import {
	BookingDetailsAssets,
	BookingDetailsCancellationTerms,
	BookingDetailsCompletionProcess,
	BookingDetailsDisputeDetails,
	BookingDetailsHeader,
	BookingDetailsMilestone,
	BookingDetailsPartyProfile,
	BookingDetailsReview,
	BookingPaymentDetails,
} from 'components';
import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import {
	useBookingRequestUpdateMutation,
	useBookingStatusUpdateMutation,
	useDeleteBookingMilestoneMutation,
	useGetBookingInfoMutation,
} from 'services';
import useAuthStore from 'store/auth';
import { setModalConfig } from 'store/common';

const BookingDetails: React.FC = () => {
	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const navigate = useNavigate();
	const { id } = useParams<any>();
	const [bookingData, setBookingData] = useState<any>();
	const [isReported, setIsReported] = useState<any>(false);
	const { mutateAsync: getBookingInfoMutation } = useGetBookingInfoMutation();
	const { mutateAsync: deleteBookingMilestoneMutation } = useDeleteBookingMilestoneMutation();
	const { mutateAsync: bookingStatusUpdateMutation } = useBookingStatusUpdateMutation();
	const { mutateAsync: bookingRequestUpdateMutation } = useBookingRequestUpdateMutation();

	useEffect(() => {
		handleBookingInfo();
	}, [id]);

	const handleBookingInfo = () => {
		getBookingInfoMutation(id).then((res: any) => {
			if (res?.success) {
				setBookingData(res?.data);
				setIsReported(res?.data?.isReported);
			}
		});
	};

	const handleChatRequest = (userId: number) => {
		setModalConfig({
			visible: true,
			id: userId,
			type: 'chatRequest',
			onClick: handleBookingInfo,
		});
	};

	const handleClickReport = () => {
		setModalConfig({
			visible: true,
			id: user?.type === 'BUYER' ? bookingData?.sellerId : bookingData?.buyerId,
			onClick: reportHandler,
			type: 'addReport',
		});
	};

	const reportHandler = () => {
		setIsReported(true);
		handleBookingInfo();
	};

	const handleCancelBooking = (type: any) => {
		setModalConfig({
			visible: true,
			id: bookingData?.id,
			onClick: handleBookingInfo,
			type: 'counterAmount',
			data: { type, bookingData },
		});
	};

	const handleCompleteBooking = () => {
		setModalConfig({
			visible: true,
			id: bookingData?.id,
			type: 'bookingComplete',
			onClick: handleBookingInfo,
		});
	};

	const handleClickAddMilestone = (data: any) => {
		setModalConfig({
			visible: true,
			id: id,
			onClick: handleBookingInfo,
			type: 'addMilestone',
			data: data,
		});
	};

	const handleClickDeleteMilestone = (id: any) => {
		deleteBookingMilestoneMutation(id).then((res: any) => {
			if (res?.success) {
				toast.success(res?.message);
				handleBookingInfo();
			}
		});
	};

	const handleUpdateStatus = (status: any) => {
		bookingStatusUpdateMutation(`${bookingData?.id}?status=${status}`).then((res: any) => {
			if (res?.success) {
				toast.success(res?.message);
				handleBookingInfo();
			}
		});
	};

	const handleBookingRequestUpdate = (type: any, status: any) => {
		bookingRequestUpdateMutation(`${bookingData?.id}?type=${type}&status=${status}`).then(
			(res: any) => {
				if (res?.success) {
					toast.success(res?.message);
					handleBookingInfo();
				}
			},
		);
	};

	const handleReviewBooking = () => {
		setModalConfig({
			visible: true,
			id: bookingData?.id,
			type: 'bookingReview',
			onClick: handleBookingInfo,
		});
	};

	return (
		<section>
			<h4 className="main-subtitle mb-30">
				<span className="back-arrow" onClick={() => navigate(-1)}>
					<i className="ri-arrow-left-line"></i>
				</span>{' '}
				Booking Details
			</h4>
			<Row>
				<Col lg={8} className="order-mob2">
					<div className="d-flex booking-details flex-column">
						<BookingDetailsHeader
							bookingData={bookingData}
							onCancel={handleCancelBooking}
							onComplete={handleCompleteBooking}
						/>

						{(bookingData?.status === 'Amidst-Cancellation' ||
							bookingData?.status === 'Cancelled') && (
							<BookingDetailsCancellationTerms
								bookingData={bookingData}
								user={user}
								onUpdateStatus={handleUpdateStatus}
								onBookingRequestUpdate={handleBookingRequestUpdate}
								onCancel={handleCancelBooking}
							/>
						)}

						{(bookingData?.status === 'Amidst-Completion-Process' ||
							bookingData?.status === 'Completed') && (
							<BookingDetailsCompletionProcess
								bookingData={bookingData}
								user={user}
								onBookingRequestUpdate={handleBookingRequestUpdate}
							/>
						)}

						{bookingData?.status === 'In-dispute' && (
							<BookingDetailsDisputeDetails
								bookingData={bookingData}
								user={user}
								onUpdateStatus={handleUpdateStatus}
							/>
						)}

						<BookingDetailsPartyProfile
							bookingData={bookingData}
							user={user}
							isReported={isReported}
							onReport={handleClickReport}
							onChatRequest={handleChatRequest}
						/>

						{bookingData?.completionProcess === 'Accepted' &&
						bookingData?.status === 'Completed' &&
						!(user?.type === 'SELLER' && bookingData?.isRated === false) ? (
							<BookingDetailsReview
								bookingData={bookingData}
								user={user}
								onReview={handleReviewBooking}
							/>
						) : null}

						<BookingDetailsAssets bookingData={bookingData} user={user} />

						<BookingDetailsMilestone
							bookingData={bookingData}
							user={user}
							onAdd={handleClickAddMilestone}
							onDelete={handleClickDeleteMilestone}
						/>
					</div>
				</Col>
				<Col lg={4} className="order-mob mb-30">
					<BookingPaymentDetails bookingData={bookingData} user={user} />
				</Col>
			</Row>
		</section>
	);
};

export default BookingDetails;
