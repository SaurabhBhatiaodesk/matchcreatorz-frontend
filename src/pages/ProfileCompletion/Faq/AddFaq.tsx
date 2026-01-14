import { useQueryClient } from '@tanstack/react-query';
import { FaqStep1Interface } from 'constants/interfaces';
import { faqSchema, faqStepInitialValues } from 'constants/schemaValidations';
import { useFormik } from 'formik';
import React, { ReactNode } from 'react';
import { Form, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useFaqMutation } from 'services';
import useAuthStore, { setUserInfo } from 'store/auth';
import useCommonStore from 'store/common';
import { updateAddOrDeleteObject } from 'utils';

const AddFaq: React.FC = () => {
	const queryClient = useQueryClient();
	const { token, user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const { mutateAsync: faqStep1Mutation } = useFaqMutation();
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);

	const initialFaqValues = {
		question: modalConfig?.data?.question,
		answer: modalConfig?.data?.answer,
	};

	const formik: any = useFormik({
		initialValues: { ...faqStepInitialValues, ...initialFaqValues },
		enableReinitialize: true,
		validationSchema: faqSchema,
		onSubmit: async (values) => {
			const newValues = modalConfig?.data?.id
				? { ...values, id: modalConfig?.data?.id }
				: { ...values };
			faqStep1Mutation({ ...newValues }).then((res: any) => {
				if (res?.success) {
					toast.success(res?.message);
					const updatedData = updateAddOrDeleteObject(user?.faqs ?? [], res?.data, null);
					setUserInfo({ token: token, user: { ...user, faqs: updatedData } });
					queryClient.invalidateQueries({ queryKey: ['get-faq'] });
					hideCommonModal();
				} else {
					toast.error(res?.message);
				}
			});
		},
	});

	const renderError = <T extends keyof FaqStep1Interface>(field: T) =>
		formik.touched[field] && formik.errors[field] ? (
			<span className="text-danger f-error">{formik.errors[field] as ReactNode}</span>
		) : null;
	return (
		<>
			<button onClick={() => hideCommonModal()} className="modal-close-btn border-0 p-0">
				<i className="ri-close-line"></i>
			</button>
			<Modal.Body>
				<h2 className="modal-title mb-30">{modalConfig?.data?.id ? 'Edit FAQ' : 'Add FAQ'} </h2>
				<Form className="auth-form" onSubmit={formik.handleSubmit}>
					<Form.Group className="mb-30">
						<Form.Control
							type="text"
							placeholder="Question"
							name="question"
							maxLength={100}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.question}
							className={renderError('question') ? 'border-red' : ''}
						/>
						{renderError('question')}
					</Form.Group>
					<Form.Group className="mb-30">
						<Form.Control
							as="textarea"
							rows={3}
							placeholder="Answer"
							name="answer"
							maxLength={250}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.answer}
							className={renderError('answer') ? 'border-red' : ''}
						/>
						{renderError('answer')}
					</Form.Group>
					<div className="d-flex gap-3 justify-content-center">
						<button className="primary-btn" onClick={() => hideCommonModal()}>
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

export default AddFaq;
