import React from 'react';
import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useCreateBookingMutation, useProfileListMutation } from 'services';
import useAuthStore, { setUserInfo } from 'store/auth';
import useCommonStore from 'store/common';
import { setProfileData } from 'store/user';

const BuyBooking: React.FC<any> = () => {
	const { token }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const { mutateAsync: createBookingMutation } = useCreateBookingMutation();
	const { mutateAsync: profileListMutation } = useProfileListMutation();
	const payload = {
		serviceId: modalConfig?.id,
	};

	const handleBuyService = () => {
		createBookingMutation(payload).then((res: any) => {
			if (res?.success) {
				toast.success(res?.message);
				profileListMutation().then((res: any) => {
					if (res?.success) {
						setProfileData(res?.data?.user);
						setUserInfo({ token: token, user: res?.data?.user });
					}
				});
				hideCommonModal();
			}
		});
	};
	return (
		<>
			<button onClick={() => hideCommonModal()} className="modal-close-btn border-0 p-0">
				<i className="ri-close-line"></i>
			</button>
			<Modal.Body>
				<div className="d-flex flex-column gap-4">
					<div className="d-flex flex-column gap-2 text-center">
						<h2 className="modal-title mb-0 ">Booking</h2>
						<p className="modal-description mb-0">Are you sure you want to buy this booking</p>
					</div>
					<div className="d-flex gap-2 w-100">
						<button onClick={() => hideCommonModal()} className="primary-btn mw-100">
							NO
						</button>
						<button className="secondary-btn mw-100 " onClick={() => handleBuyService()}>
							YES
						</button>
					</div>
				</div>
			</Modal.Body>
		</>
	);
};

export default BuyBooking;
