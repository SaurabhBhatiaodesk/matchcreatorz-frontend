import {
	AddMilestone,
	BidAdd,
	BidWithdraw,
	BookingComplete,
	BookingReview,
	BuyBooking,
	ChatClearDelete,
	ChatRejectAccept,
	ChatRequest,
	ChatWithdrawRequest,
	CounterSent,
	ImagePreview,
	JobClosed,
	Logout,
	OfferRejectAccept,
	SendOffer,
	ServiceDelete,
	UpdatePhoneEmail,
	VerifyOtp,
	ViewDoc,
	ViewOfferDetails,
} from 'components';
import { AddFaq, AddPortfolio, AddReport, CounterAmount } from 'pages';
import { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import useCommonStore from 'store/common';
import './styles.scss';

const CommonModal = () => {
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const location = useLocation();
	const modalBodyContent: any = {
		verifyOTP: <VerifyOtp />,
		addFaq: <AddFaq />,
		addPortfolio: <AddPortfolio />,
		logout: <Logout />,
		addReport: <AddReport />,
		addBid: <BidAdd />,
		bidWithdraw: <BidWithdraw />,
		updatePhoneEmail: <UpdatePhoneEmail />,
		counterAmount: <CounterAmount />,
		sendOffer: <SendOffer />,
		viewOfferDetails: <ViewOfferDetails />,
		chatRequest: <ChatRequest />,
		addMilestone: <AddMilestone />,
		bookingComplete: <BookingComplete />,
		bookingReview: <BookingReview />,
		buyBooking: <BuyBooking />,
		jobClosed: <JobClosed />,
		serviceDelete: <ServiceDelete />,
		offerRejectAccept: <OfferRejectAccept />,
		viewDoc: <ViewDoc />,
		chatWithdrawRequest: <ChatWithdrawRequest />,
		chatRejectAccept: <ChatRejectAccept />,
		chatClearDelete: <ChatClearDelete />,
		counterSent: <CounterSent />,
		imagePreview: <ImagePreview />,
	};

	useEffect(() => {
		if (modalConfig?.visible) {
			hideCommonModal();
		}
	}, [location?.pathname]);

	return (
		<Modal
			className=""
			show={modalConfig?.visible}
			backdrop="static"
			centered
			dialogClassName={modalConfig?.type === 'viewOfferDetails' ? 'modal-lg' : ''}
		>
			{modalBodyContent[modalConfig?.type]}
		</Modal>
	);
};

export default CommonModal;
