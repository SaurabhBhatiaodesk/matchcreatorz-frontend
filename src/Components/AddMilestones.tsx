import { PostBookingMilestoneInterface } from 'constants/interfaces';
import {
	postBookingMilestoneInitialValues,
	postBookingMilestoneSchema,
} from 'constants/schemaValidations';
import { useFormik } from 'formik';
import { ReactNode } from 'react';
import { Col, Form, Modal, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import toast from 'react-hot-toast';
import { usePostBookingMilestoneMutation } from 'services';
import useCommonStore from 'store/common';

const AddMilestone: React.FC<any> = () => {
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const { mutateAsync: addBookingMilestoneMutation } = usePostBookingMilestoneMutation();

	const payload = {
		milestoneId: modalConfig?.data?.id,
		bookingId: modalConfig?.data?.bookingId,
		title: modalConfig?.data?.title,
		description: modalConfig?.data?.description,
		startDate: modalConfig?.data?.startDate,
		endDate: modalConfig?.data?.endDate,
	};
	const formik = useFormik({
		initialValues: { ...postBookingMilestoneInitialValues, ...payload },
		validationSchema: postBookingMilestoneSchema,
		enableReinitialize: true,
		onSubmit: async (values) => {
			const payload = {
				...values,
				bookingId: Number(modalConfig?.id),
			};
			try {
				const res = await addBookingMilestoneMutation(payload);
				if (res?.success) {
					toast.success(res?.message);
					hideCommonModal();
					modalConfig?.onClick();
				}
			} catch (error) {
				toast.error('Failed to add milestone');
			}
		},
	});

	const renderError = <T extends keyof PostBookingMilestoneInterface>(field: T) =>
		formik.touched[field] && formik.errors[field] ? (
			<span className="text-danger f-error">{formik.errors[field] as ReactNode}</span>
		) : null;

	return (
		<>
			<button className="modal-close-btn border-0 p-0" onClick={hideCommonModal}>
				<i className="ri-close-line"></i>
			</button>
			<Modal.Body>
				<h4 className="modal-title mb-30">Add Milestone</h4>
				<Form className="auth-form" onSubmit={formik.handleSubmit}>
					<Form.Group controlId="title" className="mb-30">
						<Form.Control
							type="text"
							name="title"
							placeholder="Title"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.title}
							className={renderError('title') ? 'border-red' : ''}
						/>
						{renderError('title')}
					</Form.Group>
					<Row>
						<Col md={6}>
							<Form.Group className="mb-30">
								<DatePicker
									selected={formik.values.startDate}
									name="startDate"
									showFullMonthYearPicker
									showMonthDropdown
									showYearDropdown
									showIcon
									toggleCalendarOnIconClick
									placeholderText="Start Date"
									dateFormat="yyyy-MM-dd"
									maxDate={formik?.values?.endDate ? formik?.values?.endDate : new Date()}
									onChange={(date: any) =>
										formik.setFieldValue('startDate', date.toLocaleDateString('en-CA'))
									}
									className={`form-control ${renderError('startDate') ? 'border-red' : ''}`}
									onKeyDown={(e) => e.preventDefault()}
								/>
								{renderError('startDate')}
							</Form.Group>
						</Col>
						<Col md={6}>
							<Form.Group className="mb-30">
								<DatePicker
									selected={formik.values.endDate}
									name="endDate"
									showFullMonthYearPicker
									showMonthDropdown
									showYearDropdown
									showIcon
									minDate={formik?.values?.startDate}
									toggleCalendarOnIconClick
									placeholderText="End Date"
									dateFormat="yyyy-MM-dd"
									maxDate={new Date()}
									className={`form-control ${renderError('endDate') ? 'border-red' : ''}`}
									onBlur={formik.handleBlur}
									onChange={(date: any) =>
										formik.setFieldValue('endDate', date.toLocaleDateString('en-CA'))
									}
									onKeyDown={(e) => e.preventDefault()}
								/>
								{renderError('endDate')}
							</Form.Group>
						</Col>
					</Row>
					<Form.Group className="mb-30">
						<Form.Control
							as="textarea"
							rows={4}
							placeholder="Description"
							name="description"
							maxLength={251}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.description}
							className={renderError('description') ? 'border-red' : ''}
						/>
						{renderError('description')}
					</Form.Group>

					<div className="d-flex gap-3 justify-content-center">
						<button type="button" className="primary-btn" onClick={hideCommonModal}>
							Cancel
						</button>
						<button className="secondary-btn" type="submit">
							Save
						</button>
					</div>
				</Form>
			</Modal.Body>
		</>
	);
};

export default AddMilestone;
