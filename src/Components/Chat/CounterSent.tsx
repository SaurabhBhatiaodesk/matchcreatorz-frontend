import { counterOfferInitialValues, CounterOfferInterface, counterOfferSchema } from 'constants';
import { useFormik } from 'formik';
import { ReactNode } from 'react';
import { Form, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useOfferCounterMutation } from 'services';
import useCommonStore from 'store/common';

const CounterSent: React.FC = () => {
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const { mutateAsync: offerCounterMutation } = useOfferCounterMutation();

	const formik: any = useFormik({
		initialValues: counterOfferInitialValues,
		validationSchema: counterOfferSchema,
		onSubmit: async (values) => {
			offerCounterMutation({ ...values, id: modalConfig?.id })
				.then((res: any) => {
					if (res?.success) {
						toast.success(res?.message);
						hideCommonModal();
					}
				})
				.catch(() => {})
				.finally(() => modalConfig?.onClick());
		},
	});
	const renderError = <T extends keyof CounterOfferInterface>(field: T) =>
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
					<h4 className="modal-title mb-0 text-center">Counter Amount</h4>
					<div className="modal-description mb-0 text-center">
						Please enter your counter price on this
						<span className="d-block" style={{ color: '#E73232' }}>
							Offer ID <b style={{ color: '#000' }}>#{modalConfig?.id}</b>
						</span>
					</div>
					<Form className="auth-form" onSubmit={formik.handleSubmit}>
						<Form.Group controlId="customReason" className="mb-2">
							<Form.Control
								className={renderError('price') ? 'border-red' : ''}
								type="text"
								name="price"
								maxLength={11}
								placeholder="Amount ($)"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.price}
							/>
							{renderError('price')}
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

export default CounterSent;
