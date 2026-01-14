import { S3_URL } from 'constants/index';
import React from 'react';
import { Modal } from 'react-bootstrap';
import useCommonStore from 'store/common';

const ImagePreview: React.FC<any> = () => {
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);

	const payload = {
		image: modalConfig?.data?.image,
	};

	return (
		<>
			<button onClick={() => hideCommonModal()} className="modal-close-btn border-0 p-0">
				<i className="ri-close-line"></i>
			</button>
			<Modal.Body>
				<div className="d-flex flex-column gap-4">
					<img
						src={payload?.image ? `${S3_URL}${payload?.image}` : ''}
						alt=""
						className="w-100 h-100"
					/>
				</div>
			</Modal.Body>
		</>
	);
};

export default ImagePreview;
