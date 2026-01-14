import React from 'react';
import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDeleteServicesMutation } from 'services';
import useAuthStore from 'store/auth';
import useCommonStore from 'store/common';

const ServiceDelete: React.FC<any> = () => {
	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const { mutateAsync: deleteServicesMutation } = useDeleteServicesMutation();
	const navigate = useNavigate();

	const handleDeleteService = () => {
		deleteServicesMutation(modalConfig?.id)
			.then((res: any) => {
				if (res?.success) {
					toast.success(res?.message);
					if (user?.type === 'BUYER') {
						navigate('/job-list');
					} else {
						navigate('/my-service-list');
					}
					modalConfig?.onClick();
					hideCommonModal();
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
						<h2 className="modal-title mb-0 ">Service Delete</h2>
						<p className="modal-description mb-0">Are you sure you want to delete this service ?</p>
					</div>
					<div className="d-flex gap-2 w-100">
						<button onClick={() => hideCommonModal()} className="primary-btn mw-100">
							NO
						</button>
						<button className="secondary-btn mw-100 " onClick={() => handleDeleteService()}>
							YES
						</button>
					</div>
				</div>
			</Modal.Body>
		</>
	);
};

export default ServiceDelete;
