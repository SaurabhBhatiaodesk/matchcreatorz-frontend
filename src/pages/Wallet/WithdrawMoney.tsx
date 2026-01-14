import { useQueryClient } from '@tanstack/react-query';
import {
	withdrawMoneyInitialValues,
	WithdrawMoneyInterface,
	withdrawMoneySchema,
} from 'constants/index';
import { useFormik } from 'formik';
import React, { ReactNode } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import ReactSelect from 'react-select';
import { useCountryListQuery, useWithdrawMoneyMutation } from 'services';
import useAuthStore, { setUserInfo } from 'store/auth';

interface WithdrawMoneyProps {
	remainingAmount: number;
}

const WithdrawMoney: React.FC<WithdrawMoneyProps> = ({ remainingAmount }) => {
	const { user, token }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const { mutateAsync: withdrawMoneyMutation } = useWithdrawMoneyMutation();
	const { data: countryList = [] } = useCountryListQuery();
	const queryClient = useQueryClient();

	const formik = useFormik({
		initialValues: { ...withdrawMoneyInitialValues },
		validationSchema: withdrawMoneySchema,
		onSubmit: async (values: any, { resetForm }) => {
			const res = await withdrawMoneyMutation({ ...values });
			if (res?.success) {
				toast.success(res?.message);
				setUserInfo({
					token: token,
					user: {
						...user,
						walletAmount: user?.walletAmount - values?.amount,
					},
				});
				queryClient.invalidateQueries({ queryKey: ['get-withdraw-request'] });
				resetForm();
			}
		},
	});

	const renderError = <T extends keyof WithdrawMoneyInterface>(field: T) =>
		formik.touched[field] && formik.errors[field] ? (
			<span className="text-danger f-error">{formik.errors[field] as ReactNode}</span>
		) : null;

	const handleCountrySelect = (countryId: string) => {
		formik.setFieldValue('countryId', countryId);
	};

	return (
		<div className="d-flex gap-3 flex-column">
			<h6 className="content-title mb-0">Amount</h6>
			<Form onSubmit={formik.handleSubmit}>
				<Row>
					<Col lg={6}>
						<Form.Group className="mb-4">
							<Form.Control
								type="number"
								placeholder="Amount ($)"
								name="amount"
								maxLength={11}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.amount}
								className={renderError('amount') ? 'border-red' : ''}
							/>
							{renderError('amount')}
							<p className="hint-text mb-0 mt-2">
								<small>Remaining</small> ${remainingAmount?.toFixed(2)}
							</p>
						</Form.Group>
					</Col>
				</Row>

				<h6 className="content-title mb-30">Bank Details</h6>
				<Row>
					<Col lg={6}>
						<Form.Group className="mb-4">
							<Form.Control
								type="text"
								placeholder="Account Number"
								name="accountNumber"
								maxLength={21}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.accountNumber}
								className={renderError('accountNumber') ? 'border-red' : ''}
							/>
							{renderError('accountNumber')}
						</Form.Group>
					</Col>
					<Col lg={6}>
						<Form.Group className="mb-4">
							<Form.Control
								type="text"
								placeholder="IBAN"
								name="iban"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.iban}
								className={renderError('iban') ? 'border-red' : ''}
							/>
							{renderError('iban')}
						</Form.Group>
					</Col>
					<Col lg={6}>
						<Form.Group className="mb-4">
							<Form.Control
								type="text"
								placeholder="BIC/Swift"
								name="swift"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.swift}
								className={renderError('swift') ? 'border-red' : ''}
							/>
							{renderError('swift')}
						</Form.Group>
					</Col>
					<Col lg={6}>
						<Form.Group className="mb-4">
							<ReactSelect
								className={`form-react-select ${renderError('countryId') ? 'border-red' : ''}`}
								classNamePrefix="form-react-select"
								isSearchable
								placeholder="Country"
								name="countryId"
								options={countryList?.country ?? []}
								getOptionLabel={(option: any) => option?.countryName}
								getOptionValue={(option: any) => option?.id}
								onChange={(value: any) => handleCountrySelect(value?.id)}
								value={countryList?.country?.find(
									(item: any) => item.id === formik.values.countryId,
								)}
							/>
							{renderError('countryId')}
						</Form.Group>
					</Col>
					<Col lg={6}>
						<Form.Group className="mb-4">
							<Form.Control
								type="text"
								placeholder="First Name"
								name="firstName"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.firstName}
								className={renderError('firstName') ? 'border-red' : ''}
							/>
							{renderError('firstName')}
						</Form.Group>
					</Col>
					<Col lg={6}>
						<Form.Group className="mb-4">
							<Form.Control
								type="text"
								placeholder="Last Name"
								name="lastName"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.lastName}
								className={renderError('lastName') ? 'border-red' : ''}
							/>
							{renderError('lastName')}
						</Form.Group>
					</Col>
				</Row>
				<button className="wallet-cta" type="submit">
					Send Request
				</button>
			</Form>
		</div>
	);
};

export default WithdrawMoney;
