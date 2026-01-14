import { ReportInterface } from 'constants/interfaces';
import { reportInitialValues, reportSchema } from 'constants/schemaValidations';
import { useFormik } from 'formik';
import { ReactNode, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import {
	useBookingStatusUpdateMutation,
	usePutBookingCounterProposedMutation,
	useReportMutation,
} from 'services';
import useAuthStore from 'store/auth';
import useCommonStore from 'store/common';
import * as Yup from 'yup';

const CounterAmount: React.FC = () => {
	const { adminData }: Record<string, any> = useAuthStore((state) => state ?? {});
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const [selectedReason, setSelectedReason] = useState<string>('');
	const [customReason, setCustomReason] = useState<string>('');
	const [activeStep, setActiveStep] = useState(1);
	const [settlementAmountProposed, setSettlementAmountProposed] = useState<any>();
	const [counterAmountProposed, setCounterAmountProposed] = useState<any>();
	const [reasonError, setReasonError] = useState<string>('');
	const { mutateAsync: reportMutation } = useReportMutation();
	const { mutateAsync: bookingStatusUpdateMutation } = useBookingStatusUpdateMutation();
	const { mutateAsync: bookingCounterProposedMutation } = usePutBookingCounterProposedMutation();

	const MODAL_TYPES = {
		REPORT: 'Report',
		CANCELLED: 'Cancelled',
		COUNTER_ON_CANCELLATION: 'CounterOnCancellation',
		DISPUTE: 'Dispute',
	};

	const reasons = [
		'Failure to Meet Project Milestones or Deadlines or Poor Quality of Work.',
		'Non-Adherence to Project Requirements & Communication Issues',
		'Freelancer Unavailability or Abandonment',
		'Unauthorized Use of Third-Party Work or Breach of Confidentiality or Contract Terms',
		'Other, I have another reason',
	];

	const minValue =
		(adminData?.minPercentForSettle / 100) * modalConfig?.data?.bookingData?.price || 0;
	const maxValue = Math.max(0, modalConfig?.data?.bookingData?.price - adminData?.platformFee);

	const counterSchema = Yup.object().shape({
		counterAmountProposed: Yup.number()
			.required('Counter amount is required.')
			.min(0, 'Counter amount must be a positive value.'),
	});

	const settlementSchema = Yup.object().shape({
		settlementAmountProposed: Yup.number()
			.required('Settlement amount is required.')
			.max(maxValue, `Settlement amount cannot exceed the maximum value of ${maxValue.toFixed(2)}.`)
			.min(
				minValue,
				`Settlement amount must be at least the minimum value of ${minValue.toFixed(2)}.`,
			),
	});

	const formik = useFormik({
		initialValues: {
			...reportInitialValues,
			settlementAmountProposed: '',
			counterAmountProposed: '',
		},
		validationSchema:
			modalConfig?.data?.type === MODAL_TYPES.COUNTER_ON_CANCELLATION
				? counterSchema
				: modalConfig?.data?.type === MODAL_TYPES.CANCELLED
					? settlementSchema
					: reportSchema,
		onSubmit: handleSubmit,
	});

	function handleSubmit() {
		const reason =
			selectedReason === 'Other, I have another reason' ? customReason : selectedReason;

		switch (modalConfig?.data?.type) {
			case MODAL_TYPES.REPORT:
				handleReport(reason);
				break;
			case MODAL_TYPES.CANCELLED:
				handleStatusUpdate(reason);
				break;
			case MODAL_TYPES.COUNTER_ON_CANCELLATION:
				handleCounterProposed();
				break;
			case MODAL_TYPES.DISPUTE:
				handleDispute(reason);
				break;
			default:
				break;
		}
	}

	function handleReport(reason: string) {
		reportMutation({ userId: Number(modalConfig?.id), reason }).then((res: any) => {
			if (res?.success) {
				hideCommonModal();
				toast.success(res?.message);
				modalConfig?.onClick();
			}
		});
	}

	function handleStatusUpdate(reason: string) {
		bookingStatusUpdateMutation(
			`${modalConfig?.id}?status=Amidst-Cancellation&reason=${reason}&settlementAmountProposed=${settlementAmountProposed}`,
		).then((res: any) => {
			if (res?.success) {
				toast.success(res?.message);
				hideCommonModal();
				modalConfig?.onClick();
			}
		});
	}

	function handleCounterProposed() {
		bookingCounterProposedMutation({
			bookingId: modalConfig?.id,
			amount: counterAmountProposed,
		}).then((res: any) => {
			if (res?.success) {
				toast.success(res?.message);
				hideCommonModal();
				modalConfig?.onClick();
			}
		});
	}

	function handleDispute(reason: string) {
		bookingStatusUpdateMutation(`${modalConfig?.id}?status=In-dispute&reason=${reason}`).then(
			(res: any) => {
				if (res?.success) {
					toast.success(res?.message);
					hideCommonModal();
					modalConfig?.onClick();
				}
			},
		);
	}

	const handleSettlementAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSettlementAmountProposed(e.target.value);
	};

	const handleCombinedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		handleSettlementAmountChange(e);
		formik.handleChange(e);
	};

	const handleCounterAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCounterAmountProposed(e.target.value);
		formik.setFieldValue('counterAmountProposed', e.target.value);
	};

	const handleReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedReason(e.target.value);
		if (e.target.value !== 'Other') {
			setCustomReason('');
		}
		formik.setFieldValue('reason', e.target.value);
	};

	const renderError = <T extends keyof ReportInterface>(field: T) =>
		formik.touched[field] && formik.errors[field] ? (
			<span className="text-danger f-error">{formik.errors[field] as ReactNode}</span>
		) : null;

	return (
		<>
			<button onClick={() => hideCommonModal()} className="modal-close-btn border-0 p-0">
				<i className="ri-close-line"></i>
			</button>

			{modalConfig?.data?.type === MODAL_TYPES.CANCELLED && (
				<>
					<div className="modal-custom-header">
						<div className="d-flex justify-content-between modal-custom-header-data position-relative">
							<div className="d-flex flex-column gap-3 align-items-center">
								<div className={`number ${activeStep === 1 ? 'active' : ''}`}>1</div>
								<span className="title">Cancellation</span>
							</div>
							<div className="d-flex flex-column gap-3 align-items-center ${activeStep === 2 ? 'active' : ''}">
								<div className={`number ${activeStep === 2 ? 'active' : ''}`}>2</div>
								<span className="title">Amount</span>
							</div>
						</div>
					</div>

					<Modal.Body>
						{activeStep === 1 && (
							<div className="d-flex flex-column gap-4">
								<div className="d-flex flex-column gap-2">
									<h2 className="modal-title mb-0 text-start">Cancellation Reason</h2>
									<p className="modal-description mb-0">
										To ensure a fair review process, please select the reason that best describes
										the issue you're experiencing with this project.
									</p>
								</div>

								<Form className="auth-form">
									{reasons.map((reason, index) => (
										<Form.Check
											key={index}
											type="radio"
											label={reason}
											value={reason}
											checked={selectedReason === reason}
											onChange={handleReasonChange}
											name="disputeReason"
											className="mb-4"
										/>
									))}
									{selectedReason === 'Other, I have another reason' && (
										<Form.Group controlId="customReason" className="mt-3">
											<Form.Control
												as="textarea"
												rows={3}
												placeholder="Write a reason"
												value={customReason}
												onChange={(e) => setCustomReason(e.target.value)}
												required
											/>
											{renderError('reason')}
										</Form.Group>
									)}
									{reasonError && <span className="text-danger f-error">{reasonError}</span>}

									<div className="d-flex gap-3 justify-content-center mt-4">
										<button className="primary-btn" onClick={() => hideCommonModal()}>
											Cancel
										</button>
										<button
											className="secondary-btn"
											onClick={(e) => {
												e.preventDefault();
												if (
													!selectedReason ||
													(selectedReason === 'Other, I have another reason' &&
														!customReason &&
														selectedReason)
												) {
													setReasonError('Please select or provide a cancellation reason.');
												} else {
													setReasonError('');
													setActiveStep(2);
												}
											}}
										>
											Continue
										</button>
									</div>
								</Form>
							</div>
						)}

						{activeStep === 2 && (
							<div className="d-flex flex-column gap-4">
								<h4 className="modal-subtitle mb-0">Settlement Amount</h4>
								<div className="amount-display">
									Amount Paid by Buyer: <span>${modalConfig?.data?.bookingData?.price}</span>
								</div>
								<Form className="auth-form" onSubmit={formik.handleSubmit}>
									<Form.Group controlId="customReason" className="mb-2">
										<Form.Label>Settlement amount proposed by buyer</Form.Label>
										<Form.Control
											type="text"
											name="settlementAmountProposed"
											placeholder="Amount ($)"
											value={formik.values.settlementAmountProposed}
											onChange={handleCombinedChange}
											onBlur={formik.handleBlur}
										/>
										{renderError('settlementAmountProposed')}
									</Form.Group>
									<small className="hint-text d-block">
										<b>NOTE:</b> Amount to be refunded after platform charge deduction{' '}
										<b>${modalConfig?.data?.bookingData?.platformFee}</b>
									</small>

									<div className="d-flex gap-3 justify-content-center mt-5">
										<button className="primary-btn" onClick={() => hideCommonModal()}>
											Cancel
										</button>
										<button className="secondary-btn" type="submit">
											Send
										</button>
									</div>
								</Form>
							</div>
						)}
					</Modal.Body>
				</>
			)}

			{modalConfig?.data?.type === MODAL_TYPES.REPORT && (
				<Modal.Body>
					<div className="d-flex flex-column gap-4">
						<div className="d-flex flex-column gap-2">
							<h2 className="modal-title mb-0 text-start">
								{modalConfig?.data?.type === 'Cancelled' ? 'Cancellation Reason' : 'Dispute Reason'}
							</h2>
							<p className="modal-description mb-0">
								To ensure a fair review process, please select the reason that best describes the
								issue you're experiencing with this project.
							</p>
						</div>
						<Form className="auth-form" onSubmit={formik.handleSubmit}>
							{reasons.map((reason, index) => (
								<Form.Check
									key={index}
									type="radio"
									label={reason}
									value={reason}
									checked={selectedReason === reason}
									onChange={handleReasonChange}
									name="disputeReason"
									className="mb-4"
								/>
							))}
							{selectedReason === 'Other, I have another reason' && (
								<Form.Group controlId="customReason" className="mt-3">
									<Form.Control
										as="textarea"
										rows={3}
										placeholder="Write a reason"
										value={customReason}
										onChange={(e) => setCustomReason(e.target.value)}
										required
									/>
								</Form.Group>
							)}
							{renderError('reason')}

							<div className="d-flex gap-3 justify-content-center mt-4">
								<button className="primary-btn" onClick={() => hideCommonModal()}>
									Cancel
								</button>
								<button className="secondary-btn" type="submit">
									Continue
								</button>
							</div>
						</Form>
					</div>
				</Modal.Body>
			)}

			{modalConfig?.data?.type === MODAL_TYPES.COUNTER_ON_CANCELLATION && (
				<Modal.Body>
					<div className="d-flex flex-column gap-4">
						<h4 className="modal-subtitle mb-0">Counter Amount</h4>
						<div className="amount-display">
							Amount Paid by Buyer: <span>$110</span>
						</div>
						<Form className="auth-form" onSubmit={formik.handleSubmit}>
							<Form.Group controlId="settlementAmountProposed" className="mb-2">
								<Form.Label>Settlement amount proposed by buyer</Form.Label>
								<Form.Control
									type="text"
									name="counterAmountProposed"
									placeholder="Amount ($)"
									value={counterAmountProposed}
									onChange={handleCounterAmountChange}
								/>
								{renderError('counterAmountProposed')}
							</Form.Group>

							<div className="d-flex gap-3 justify-content-center mt-4">
								<button className="primary-btn" onClick={() => hideCommonModal()}>
									Cancel
								</button>
								<button className="secondary-btn" type="submit">
									Continue
								</button>
							</div>
						</Form>
					</div>
				</Modal.Body>
			)}

			{modalConfig?.data?.type === MODAL_TYPES.DISPUTE && (
				<Modal.Body>
					<div className="d-flex flex-column gap-4">
						<div className="d-flex flex-column gap-2">
							<h2 className="modal-title mb-0 text-start">
								{modalConfig?.data?.type === 'Cancelled' ? 'Cancellation Reason' : 'Dispute Reason'}
							</h2>
							<p className="modal-description mb-0">
								To ensure a fair review process, please select the reason that best describes the
								issue you're experiencing with this project.
							</p>
						</div>
						<Form className="auth-form" onSubmit={formik.handleSubmit}>
							{reasons.map((reason, index) => (
								<Form.Check
									key={index}
									type="radio"
									label={reason}
									value={reason}
									checked={selectedReason === reason}
									onChange={handleReasonChange}
									name="disputeReason"
									className="mb-4"
								/>
							))}
							{selectedReason === 'Other, I have another reason' && (
								<Form.Group controlId="customReason" className="mt-3">
									<Form.Control
										as="textarea"
										rows={3}
										placeholder="Write a reason"
										value={customReason}
										onChange={(e) => setCustomReason(e.target.value)}
										required
									/>
								</Form.Group>
							)}
							{renderError('reason')}

							<div className="d-flex gap-3 justify-content-center mt-4">
								<button className="primary-btn" onClick={() => hideCommonModal()}>
									Cancel
								</button>
								<button className="secondary-btn" type="submit">
									Continue
								</button>
							</div>
						</Form>
					</div>
				</Modal.Body>
			)}
		</>
	);
};

export default CounterAmount;
