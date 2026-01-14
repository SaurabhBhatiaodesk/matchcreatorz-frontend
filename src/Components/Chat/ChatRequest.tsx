import { SendChatRequestInterface } from 'constants/interfaces';
import {
	chatSendRequestInitialValues,
	chatSendRequestSchema,
} from 'constants/schemaValidations/chatSchema';
import { useFormik } from 'formik';
import { ReactNode } from 'react';
import { Form, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useSendChatRequestMutation } from 'services';
import useCommonStore from 'store/common';

const ChatRequest: React.FC = () => {
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const { mutateAsync: sendChatRequestMutation } = useSendChatRequestMutation();

	const formik: any = useFormik({
		initialValues: { ...chatSendRequestInitialValues },
		validationSchema: chatSendRequestSchema,
		onSubmit: async (values) => {
			sendChatRequestMutation({ ...values, sellerId: Number(modalConfig?.id) })
				.then((res: any) => {
					if (res?.success) {
						hideCommonModal();
						toast.success(res?.message);
						modalConfig?.onClick();
					}
				})
				.catch(() => {});
		},
	});

	const renderError = <T extends keyof SendChatRequestInterface>(field: T) =>
		formik.touched[field] && formik.errors[field] ? (
			<span className="text-danger f-error">{formik.errors[field] as ReactNode}</span>
		) : null;

	return (
		<Modal.Body>
			<h2 className="seller-chat-modal-title text-center">Send Chat Request</h2>
			<Form onSubmit={formik.handleSubmit}>
				<Form.Group className="mb-4" controlId="exampleForm.ControlTextarea1">
					<Form.Control
						as="textarea"
						name="message"
						rows={10}
						placeholder="Type your message"
						maxLength={251}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.message}
						className={renderError('message') ? 'border-red' : ''}
					/>
					{renderError('message')}
				</Form.Group>
				<div className="d-flex gap-3">
					<button className="primary-btn" onClick={() => hideCommonModal()}>
						Cancel
					</button>
					<button className="secondary-btn" type="submit">
						Send
					</button>
				</div>
			</Form>
		</Modal.Body>
	);
};

export default ChatRequest;
