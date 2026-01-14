import React from 'react';
import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useBidWithdrawMutation } from 'services';
import useCommonStore from 'store/common';

const BidWithdraw: React.FC<any> = () => {
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const { mutateAsync: bidWithdrawMutation } = useBidWithdrawMutation();

	const payload = {
		bidId: modalConfig?.data?.bidId,
	};

	const withdrawMyBid = () => {
		bidWithdrawMutation(payload).then((res: any) => {
			if (res?.success) {
				toast.success(res?.message);
				modalConfig?.onClick();
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
						<h2 className="modal-title mb-0 ">Withdraw Bid</h2>
						<p className="modal-description mb-0">Are you sure you want to Withdraw your Bid</p>
					</div>
					<div className="d-flex gap-2 w-100">
						<button className="primary-btn mw-100 " onClick={() => withdrawMyBid()}>
							YES
						</button>
						<button onClick={() => hideCommonModal()} className="secondary-btn mw-100">
							NO
						</button>
					</div>
				</div>
			</Modal.Body>
		</>
	);
};

export default BidWithdraw;
