import { useQueryClient } from '@tanstack/react-query';
import { AddImage, Loader } from 'components';
import { PortfolioInterface } from 'constants/interfaces';
import { portfolioInitialValues, portfolioSchema } from 'constants/schemaValidations';
import { useFormik } from 'formik';
import React, { ReactNode, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { usePortfolioMutation } from 'services';
import useAuthStore, { setUserInfo } from 'store/auth';
import useCommonStore from 'store/common';
import { updateAddOrDeleteObject } from 'utils';

const AddPortfolio: React.FC = () => {
	const queryClient = useQueryClient();
	const { token, user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const [isUploading, setIsUploading] = useState(false);
	const [buttonStatus, setButtonStatus] = useState<any>(isUploading);

	const { mutateAsync: portfolioMutation } = usePortfolioMutation();
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);

	const initialPortfolioValues = {
		title: modalConfig?.data?.title,
		image: modalConfig?.data?.image,
	};

	const formik: any = useFormik({
		initialValues: { ...portfolioInitialValues, ...initialPortfolioValues },
		enableReinitialize: true,
		validationSchema: portfolioSchema,
		onSubmit: async (values) => {
			setButtonStatus(true);
			const newValues = modalConfig?.data?.id
				? { ...values, id: modalConfig?.data?.id }
				: { ...values };
			portfolioMutation({ ...newValues }).then((res: any) => {
				if (res?.success) {
					const updatedData = updateAddOrDeleteObject(user?.portfolios ?? [], res?.data, null);
					setUserInfo({ token: token, user: { ...user, portfolios: updatedData } });
					queryClient.invalidateQueries({ queryKey: ['get-portfolio'] });
					setTimeout(() => {
						toast.success(res?.message);
						hideCommonModal();
						setButtonStatus(false);
					}, 1000);
				} else {
					toast.error(res?.message);
				}
			});
		},
	});

	const updateImageData = (imgPath: any) => {
		formik.setFieldValue('image', imgPath);
	};

	const renderError = <T extends keyof PortfolioInterface>(field: T) =>
		formik.touched[field] && formik.errors[field] ? (
			<span className="text-danger f-error">{formik.errors[field] as ReactNode}</span>
		) : null;

	return (
		<>
			<button onClick={() => hideCommonModal()} className="modal-close-btn border-0 p-0">
				<i className="ri-close-line"></i>
			</button>
			<Modal.Body>
				<h2 className="modal-title mb-30">Add Portfolio</h2>
				<Form className="auth-form" onSubmit={formik.handleSubmit}>
					<Form.Group controlId="formTitle" className="mb-30">
						<Form.Control
							type="text"
							placeholder="Title"
							name="title"
							maxLength={15}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.title}
							className={renderError('title') ? 'border-red' : ''}
						/>
						{renderError('title')}
					</Form.Group>
					<Form.Group controlId="formImage" className="mb-20 position-relative resume-input">
						<div className="form-control d-flex justify-content-between align-items-center">
							<span>{formik.values.image ? 'Portfolio.png' : 'Upload Image'}</span>
							{isUploading ? (
								<Loader style={{ float: 'right' }} />
							) : (
								<i className="ri-export-line ml-2"></i>
							)}
						</div>
						<AddImage
							updateImageData={updateImageData}
							setIsUploading={setIsUploading}
							isMultiple={false}
						/>
						{renderError('image')}
					</Form.Group>
					<div className="d-flex gap-3 justify-content-center">
						<button className="primary-btn" onClick={() => hideCommonModal()}>
							Cancel
						</button>
						<button className="secondary-btn" disabled={isUploading || buttonStatus} type="submit">
							Save
						</button>
					</div>
				</Form>
			</Modal.Body>
		</>
	);
};

export default AddPortfolio;
