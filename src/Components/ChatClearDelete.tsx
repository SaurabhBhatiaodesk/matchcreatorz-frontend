import React from 'react';
import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useChatDeleteMutation } from 'services';
import useCommonStore from 'store/common';
import { clearChat } from 'store/socket';

const ChatClearDelete: React.FC<any> = () => {
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const { mutateAsync: chatDeleteMutation } = useChatDeleteMutation();

	const deleteChat = () => {
		if (modalConfig?.data?.status === 'DELETE') {
			chatDeleteMutation(modalConfig?.id)
				.then((res: any) => {
					if (res?.success) {
						toast.success(res?.message);
						modalConfig?.onClick(true);
						hideCommonModal();
					}
				})
				.catch(() => {});
		} else {
			clearChat();
			hideCommonModal();
		}
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
							Chat {modalConfig?.data?.status === 'DELETE' ? 'Delete' : 'Clear'}
						</h2>
						<p className="modal-description mb-0">
							Are you sure you want to {modalConfig?.data?.status === 'DELETE' ? 'Delete' : 'Clear'}{' '}
							this chat ?
						</p>
					</div>
					<div className="d-flex gap-2 w-100">
						<button onClick={() => hideCommonModal()} className="primary-btn mw-100">
							NO
						</button>
						<button className="secondary-btn mw-100 " onClick={() => deleteChat()}>
							YES
						</button>
					</div>
				</div>
			</Modal.Body>
		</>
	);
};

export default ChatClearDelete;
