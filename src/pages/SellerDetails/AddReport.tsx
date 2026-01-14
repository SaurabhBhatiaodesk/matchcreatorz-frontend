import { ReportInterface } from 'constants/interfaces';
import { reportInitialValues, reportSchema } from 'constants/schemaValidations';
import { useFormik } from 'formik';
import React, { ReactNode, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useReportMutation } from 'services';
import useCommonStore from 'store/common';

const AddReport: React.FC<any> = () => {
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const [selectedReason, setSelectedReason] = useState<string>('');
	const [customReason, setCustomReason] = useState<string>('');
	const { mutateAsync: reportMutation } = useReportMutation();

	const reasons = [
		'Reason 1, I am not available.',
		'Reason 2, The second cancellation reason will get listed here.',
		'Reason 3, I am not available.',
		'Reason 4, The second cancellation reason will get listed here.',
		'Other, I have another reason',
	];

	const handleReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedReason(e.target.value);
		if (e.target.value !== 'Other') {
			setCustomReason('');
		}
		formik.setFieldValue('reason', e.target.value);
	};

	const formik: any = useFormik({
		initialValues: { ...reportInitialValues },
		validationSchema: reportSchema,
		onSubmit: async () => {
			const reason =
				selectedReason === 'Other, I have another reason' ? customReason : selectedReason;
			reportMutation({ userId: Number(modalConfig?.id), reason }).then((res: any) => {
				if (res?.success) {
					hideCommonModal();
					toast.success(res?.message);
					modalConfig?.onClick();
				}
			});
		},
	});

	const renderError = <T extends keyof ReportInterface>(field: T) =>
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
					<div className="d-flex flex-column gap-2">
						<h2 className="modal-title mb-0 text-start">Dispute Reason </h2>
						<p className="modal-description mb-0">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
							incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.
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
		</>
	);
};

export default AddReport;
