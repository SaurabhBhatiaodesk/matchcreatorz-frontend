import { IMAGE_PATH, S3_URL } from 'constants/index';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import useCommonStore from 'store/common';

const ViewDoc: React.FC<any> = () => {
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const [fileArray, setFileArray] = useState(modalConfig?.data?.file || []);

	useEffect(() => {
		if (modalConfig?.data?.file?.length) {
			setFileArray(modalConfig?.data?.file);
		}
	}, []);

	const handleDelete = (index: any, type: any) => {
		const temp = fileArray?.filter((_: any, i: any) => i !== index);
		setFileArray(temp);
		modalConfig?.onClick(temp, type);
		if (temp?.length < 1) {
			hideCommonModal();
		}
	};

	return (
		<div>
			<button onClick={() => hideCommonModal()} className="modal-close-btn border-0 p-0">
				<i className="ri-close-line"></i>
			</button>
			<Modal.Body>
				<div className="modal-subtitle mb-3">
					{modalConfig?.data?.dataType === 'doc' ? 'Documents' : 'Images'}
				</div>
				<div className="d-flex flex-wrap gap-3">
					{fileArray?.length > 0 &&
						fileArray?.map((item: any, index: any) => (
							<>
								<div className="position-relative" style={{ width: '85px' }}>
									<img
										key={index}
										src={
											modalConfig?.data?.dataType === 'doc'
												? IMAGE_PATH.dummyPdf
												: item
													? `${S3_URL + item}`
													: IMAGE_PATH.userprofileImg1
										}
										alt=""
										className="preview-img"
									/>

									<div className="modal-description">
										{item?.name?.length > 10 ? `${item?.name?.slice(0, 10)}...` : item?.name}
									</div>
									<button
										className=" border-0 p-0 delete-btn"
										onClick={() => handleDelete(index, modalConfig?.data?.dataType)}
									>
										<i className="ri-close-fill"></i>
									</button>
								</div>
							</>
						))}
				</div>
			</Modal.Body>
		</div>
	);
};

export default ViewDoc;
