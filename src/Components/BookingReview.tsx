import {
	addBookingReviewInitialValues,
	bookingRatingSchema,
	BookingReviewInterface,
} from 'constants/index';
import { useFormik } from 'formik';
import React, { ReactNode } from 'react';
import { Form, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { Rating } from 'react-simple-star-rating';
import { useBookingReviewMutation } from 'services';
import useCommonStore from 'store/common';

const BookingReview: React.FC<any> = () => {
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const { mutateAsync: addBookingReviewMutation } = useBookingReviewMutation();

	const formik = useFormik({
		initialValues: { ...addBookingReviewInitialValues },
		validationSchema: bookingRatingSchema,
		onSubmit: async (values) => {
			let payload;
			if (modalConfig?.id) {
				payload = { ...values, bookingId: Number(modalConfig.id) };
			}
			const res = await addBookingReviewMutation(payload);
			if (res?.success) {
				toast.success(res?.message);
				hideCommonModal();
				modalConfig?.onClick();
			}
		},
	});

	const handleRating = (rate: number) => {
		formik.setFieldValue('rating', rate);
	};

	const renderError = <T extends keyof BookingReviewInterface>(field: T) =>
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
						<h2 className="modal-title mb-0 ">Booking Review</h2>
					</div>
					<Form className="auth-form" onSubmit={formik.handleSubmit}>
						<Form.Group className="mt-3 d-flex flex-column gap-2">
							<Rating onClick={handleRating} />
							{renderError('rating')}
						</Form.Group>

						<Form.Group className="mt-3">
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Write a review"
								name="review"
								maxLength={251}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.review}
								className={renderError('review') ? 'border-red' : ''}
							/>
							{renderError('review')}
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

export default BookingReview;
