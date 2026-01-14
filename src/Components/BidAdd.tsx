import { useQueryClient } from '@tanstack/react-query';
import { addBidInitialValues, BidInterface, bidSchema } from 'constants/index';
import { useFormik } from 'formik';
import React, { ReactNode } from 'react';
import { Form, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useAddBidMutation } from 'services';
import useAuthStore, { setUserInfo } from 'store/auth';
import useCommonStore from 'store/common';

const BidAdd: React.FC<any> = () => {
	const { user, token }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const { mutateAsync: addBidMutation } = useAddBidMutation();
	const queryClient = useQueryClient();

	const formik = useFormik({
		initialValues: { ...addBidInitialValues },
		validationSchema: bidSchema,
		onSubmit: async (values) => {
			let payload;
			if (modalConfig?.id) {
				payload = { ...values, serviceId: Number(modalConfig.id) };
			} else if (modalConfig?.data) {
				payload = {
					...values,
					bidId: modalConfig.data.bidId,
					serviceId: modalConfig.data.serviceId,
				};
			}
			const res = await addBidMutation(payload);
			if (res?.success) {
				toast.success(res?.message);
				hideCommonModal();
				modalConfig?.onClick();
				queryClient.invalidateQueries({ queryKey: ['connect-transactions'] });
				setUserInfo({
					token: token,
					user: {
						...user,
						totalConnects: user?.totalConnects - modalConfig?.data?.connectForBid || 20,
					},
				});
			}
		},
	});

	const renderError = <T extends keyof BidInterface>(field: T) =>
		formik.touched[field] && formik.errors[field] ? (
			<span className="text-danger f-error">{formik.errors[field] as ReactNode}</span>
		) : null;

	return (
		<>
			<button onClick={() => hideCommonModal()} className="modal-close-btn border-0 p-0">
				<i className="ri-close-line"></i>
			</button>
			<Modal.Body>
				<div className="d-flex flex-column gap-4">
					<div className="d-flex flex-column gap-2 text-center">
						<h2 className="modal-title mb-0 ">Bidding Amount</h2>
						<p className="modal-description mb-0">
							Please enter your bidding amount on this
							<br /> <b>JobID#{modalConfig?.id || modalConfig?.data?.serviceId}</b>
						</p>
					</div>
					<Form className="auth-form" onSubmit={formik.handleSubmit}>
						<Form.Group controlId="customReason">
							<Form.Control
								className={`${renderError('bidAmount') ? 'border-red' : ''}`}
								type="text"
								name="bidAmount"
								placeholder="Amount ($)"
								maxLength={11}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.bidAmount}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										formik.handleSubmit();
										e.preventDefault();
									}
								}}
							/>
							{renderError('bidAmount')}
						</Form.Group>

						<div className="d-flex gap-3 justify-content-center mt-4">
							<button className="primary-btn" onClick={() => hideCommonModal()}>
								Cancel
							</button>
							<button className="secondary-btn" type="submit">
								Send
							</button>
						</div>
					</Form>
				</div>
			</Modal.Body>
		</>
	);
};

export default BidAdd;
