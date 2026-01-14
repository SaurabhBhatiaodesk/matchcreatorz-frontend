import { S3_URL } from 'constants/index';
import { PostBookingCompleteProofInterface } from 'constants/interfaces';
import {
	postBookingCompleteProofInitialValues,
	postBookingCompleteProofSchema,
} from 'constants/schemaValidations';
import { useFormik } from 'formik';
import { ReactNode, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { usePostBookingCompleteProcessMutation } from 'services';
import useCommonStore from 'store/common';
import AddImage from './AddImage';
import { Loader } from './Common';
const BookingComplete: React.FC = () => {
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const { mutateAsync: addBookingMilestoneMutation } = usePostBookingCompleteProcessMutation();
	const [isUploading, setIsUploading] = useState(false);

	const formik = useFormik({
		initialValues: { ...postBookingCompleteProofInitialValues },
		validationSchema: postBookingCompleteProofSchema,
		enableReinitialize: true,
		onSubmit: async (values) => {
			const payload = {
				...values,
				bookingId: Number(modalConfig?.id),
				status: 'Amidst-Completion-Process',
			};
			const res = await addBookingMilestoneMutation(payload);
			if (res?.success) {
				toast.success(res?.message);
				hideCommonModal();
				modalConfig?.onClick();
			}
		},
	});

	const renderError = <T extends keyof PostBookingCompleteProofInterface>(field: T) =>
		formik.touched[field] && formik.errors[field] ? (
			<span className="text-danger f-error">{formik.errors[field] as ReactNode}</span>
		) : null;

	const updateImageData = (imgPath: any) => {
		const temp = formik?.values?.images || [];
		if (imgPath) {
			temp.push(imgPath);
		}
		formik.setFieldValue('images', temp);
	};

	return (
		<>
			<button className="modal-close-btn border-0 p-0" onClick={hideCommonModal}>
				<i className="ri-close-line"></i>
			</button>
			<Modal.Body>
				<div className="d-flex flex-column gap-4">
					<div className="d-flex flex-column gap-2 text-center">
						<h2 className="modal-title mb-0 ">Proof of Completion</h2>
						<p className="modal-description mb-0">
							In order to mark the job as <b className="text-dark">”complete”</b> attach some
							screenshots as proof of completion of job
						</p>
					</div>
					<Form className="auth-form" onSubmit={formik.handleSubmit}>
						<Form.Group className="mb-30 position-relative resume-input">
							<div className="form-control">
								{formik?.values?.images?.length > 0
									? `${formik?.values?.images?.length} Attachment`
									: 'Upload Images'}
								{isUploading ? (
									<Loader style={{ float: 'right' }} />
								) : (
									<i className="ri-image-line" style={{ float: 'right' }}></i>
								)}
							</div>

							<AddImage
								updateImageData={updateImageData}
								setIsUploading={setIsUploading}
								isMultiple={false}
							/>
							{renderError('images')}
						</Form.Group>

						{formik?.values?.images?.length > 0 ? (
							<div className="d-flex align-items-center gap-2 mb-4 flex-wrap">
								{formik.values.images.map((file: any, index: any) => {
									const handleRemoveImage = (index: number) => {
										const updatedImages = formik.values.images.filter(
											(_: any, i: any) => i !== index,
										);
										formik.setFieldValue('images', updatedImages);
									};

									return (
										<div key={index} className="uploaded-file-item d-flex gap-1 position-relative">
											<img
												src={`${S3_URL + file}`}
												alt=""
												className="uploaded-file-item-preview-img"
											/>
											<button
												type="button"
												onClick={() => handleRemoveImage(index)}
												className=" border-0 p-0 uploaded-file-item-close-btn"
											>
												<i className="ri-close-line"></i>
											</button>
										</div>
									);
								})}
							</div>
						) : null}

						<div className="d-flex gap-3 justify-content-center mt-4">
							<button className="primary-btn" onClick={hideCommonModal}>
								Cancel
							</button>
							<button className="secondary-btn" type="submit">
								Submit
							</button>
						</div>
					</Form>
				</div>
			</Modal.Body>
		</>
	);
};
export default BookingComplete;
