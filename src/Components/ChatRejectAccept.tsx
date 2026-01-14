import React from 'react';
import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useChatStatusUpdateMutation } from 'services';
import useCommonStore from 'store/common';

const ChatRejectAccept: React.FC<any> = () => {
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const { mutateAsync: chatStatusUpdateMutation } = useChatStatusUpdateMutation();

	const payload = {
		id: modalConfig?.id,
		status: modalConfig?.data?.status,
	};

	const handleChatStatusUpdate = () => {
		chatStatusUpdateMutation(`${payload?.id}?status=${payload?.status}`)
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
						<h2 className="modal-title mb-0 ">
							Chat {payload?.status === 'Rejected' ? 'Reject' : 'Accept'}
						</h2>
						<p className="modal-description mb-0">
							Are you sure you want to {payload?.status === 'Rejected' ? 'reject' : 'accept'} this
							chat ?
						</p>
					</div>
					<div className="d-flex gap-2 w-100">
						<button onClick={() => hideCommonModal()} className="primary-btn mw-100">
							NO
						</button>
						<button className="secondary-btn mw-100 " onClick={() => handleChatStatusUpdate()}>
							YES
						</button>
					</div>
				</div>
			</Modal.Body>
		</>
	);
};

export default ChatRejectAccept;
