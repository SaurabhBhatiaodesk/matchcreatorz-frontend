import React from 'react';
import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useChatWithdrawRequestMutation } from 'services';
import useCommonStore from 'store/common';

const ChatWithdrawRequest: React.FC<any> = () => {
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const { mutateAsync: chatWithdrawRequestMutation } = useChatWithdrawRequestMutation();

	const handleWithdrawRequest = () => {
		chatWithdrawRequestMutation(modalConfig?.id)
			.then((res: any) => {
				if (res?.success) {
					toast.success(res?.message);
					hideCommonModal();
					modalConfig?.onClick();
				}
			})
			.catch(() => {});
	};
	return (
		<>
			<button onClick={() => hideCommonModal()} className="modal-close-btn border-0 p-0">
				<i className="ri-close-line"></i>
			</button>
			<Modal.Body>
				<div className="d-flex flex-column gap-4">
					<div className="d-flex flex-column gap-2 text-center">
						<h2 className="modal-title mb-0 ">Request Withdraw</h2>
						<p className="modal-description mb-0">
							Are you sure you want to withdraw this request ?
						</p>
					</div>
					<div className="d-flex gap-2 w-100">
						<button className="secondary-btn mw-100 " onClick={() => handleWithdrawRequest()}>
							YES
						</button>
						<button onClick={() => hideCommonModal()} className="primary-btn mw-100">
							NO
						</button>
					</div>
				</div>
			</Modal.Body>
		</>
	);
};

export default ChatWithdrawRequest;
