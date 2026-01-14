import React from 'react';
import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useUpdateStatusJobMutation } from 'services';
import useCommonStore from 'store/common';

const JobClosed: React.FC<any> = () => {
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const { mutateAsync: updateStatusJobMutation } = useUpdateStatusJobMutation();
	const payload = {
		JobId: modalConfig?.id,
		status: modalConfig?.data?.status,
	};

	const handleJobClosed = () => {
		updateStatusJobMutation(payload)
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
						<h2 className="modal-title mb-0 ">Mark as closed</h2>
						<p className="modal-description mb-0">Are you sure you want to closed this job ?</p>
					</div>
					<div className="d-flex gap-2 w-100">
						<button onClick={() => hideCommonModal()} className="primary-btn mw-100">
							NO
						</button>
						<button className="secondary-btn mw-100 " onClick={() => handleJobClosed()}>
							YES
						</button>
					</div>
				</div>
			</Modal.Body>
		</>
	);
};

export default JobClosed;
