import { AddAmountInterface, WithdrawMoneyInterface } from 'constants/interfaces';
import * as Yup from 'yup';

export const addAmountInitialValues: AddAmountInterface = {
	amount: '',
};

export const withdrawMoneyInitialValues: WithdrawMoneyInterface = {
	amount: '',
	accountNumber: '',
	iban: '',
	swift: '',
	countryId: null,
	firstName: '',
	lastName: '',
};

// Add Amount Schema
export const addAmountSchema = () =>
	Yup.object().shape({
		amount: Yup.number()
			.required('Amount is required.')
			.positive('Amount must be greater than 0.')
			.min(1, 'Amount must be at least 1.')
			.max(9999999999, 'Amount cannot exceed 10 digits.'),
	});

// Withdraw Money Schema
export const withdrawMoneySchema = () =>
	Yup.object().shape({
		amount: Yup.number()
			.required('Amount is required.')
			.positive('Amount must be greater than 0.')
			.min(1, 'Amount must be at least 1.')
			.max(9999999999, 'Amount cannot exceed 10 digits.'),
		accountNumber: Yup.string()
			.required('Account number is required.')
			.max(20, 'Account number cannot exceed 20 digits.')
			.matches(/^\d+$/, 'Account number must contain only digits.'),
		iban: Yup.string()
			.required('IBAN is required.')
			.matches(/^[A-Za-z0-9]+$/, 'IBAN must contain only alphanumeric characters.'),
		swift: Yup.string()
			.required('SWIFT code is required.')
			.matches(/^[A-Za-z0-9]+$/, 'SWIFT code must contain only alphanumeric characters.'),
		countryId: Yup.number().nullable().required('Country is required.'),
		firstName: Yup.string()
			.required('First name is required.')
			.matches(/^[A-Za-z]+$/, 'First name must contain only alphabetic characters.'),
		lastName: Yup.string()
			.required('Last name is required.')
			.matches(/^[A-Za-z]+$/, 'Last name must contain only alphabetic characters.'),
	});
