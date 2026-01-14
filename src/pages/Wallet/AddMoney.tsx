import { Loader } from 'components';
import { AddAmountInterface } from 'constants/interfaces';
import { addAmountInitialValues, addAmountSchema } from 'constants/schemaValidations';
import { useFormik } from 'formik';
import React, { ReactNode, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useAddAmountMutation } from 'services';
import useAuthStore from 'store/auth';

const AddMoney: React.FC<any> = () => {
	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const { mutateAsync: addAmountMutation } = useAddAmountMutation();
	const [isLoading, setIsLoading] = useState(false);
	const formik: any = useFormik({
		initialValues: { ...addAmountInitialValues },
		validationSchema: addAmountSchema,
		onSubmit: async (values) => {
			setIsLoading(true);
			addAmountMutation({ ...values, userId: user?.id }).then((res: any) => {
				if (res?.success) {
					setIsLoading(false);
					window.location.href = res?.data?.url;
				}
			});
		},
	});

	const renderError = <T extends keyof AddAmountInterface>(field: T) =>
		formik.touched[field] && formik.errors[field] ? (
			<span className="text-danger f-error">{formik.errors[field] as ReactNode}</span>
		) : null;

	return (
		<div
			className={`d-flex gap-3 flex-column position-relative ${isLoading ? 'loader-display' : ''}`}
		>
			{isLoading && <Loader />}
			<h6 className="content-title mb-0">Amount</h6>
			<Form onSubmit={formik.handleSubmit}>
				<Row>
					<Col lg={6}>
						<Form.Group className="mb-4">
							<Form.Control
								type="number"
								placeholder="Enter Amount ($)"
								name="amount"
								maxLength={11}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.amount}
								className={renderError('amount') ? 'border-red' : ''}
							/>
							{renderError('amount')}
						</Form.Group>
					</Col>
				</Row>
				<button className="wallet-cta" type="submit">
					Checkout
				</button>
			</Form>
		</div>
	);
};

export default AddMoney;
