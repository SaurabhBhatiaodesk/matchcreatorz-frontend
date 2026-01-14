import {
	AddUpdateOfferInterface,
	CounterOfferInterface,
	SendChatRequestInterface,
} from 'constants/interfaces';
import * as Yup from 'yup';

export const chatSendRequestInitialValues: SendChatRequestInterface = {
	sellerId: null,
	message: '',
};

export const addUpdateOfferInitialValues: AddUpdateOfferInterface = {
	title: '',
	categoryId: null,
	countryId: null,
	price: null,
	description: '',
	tagIds: [],
	documents: [],
	images: [],
};

export const counterOfferInitialValues: CounterOfferInterface = {
	price: null,
};

// Chat Send Request Schema
export const chatSendRequestSchema = Yup.object().shape({
	message: Yup.string()
		.nullable()
		.required('Message is required.')
		.min(1, 'Message must be at least 1 character long.')
		.max(250, 'Message cannot exceed 250 characters.'),
});

// Add/Update Offer Schema
export const addUpdateOfferSchema = Yup.object().shape({
	title: Yup.string()
		.required('Project title is required.')
		.max(50, 'Project title cannot exceed 50 characters.'),
	categoryId: Yup.number().nullable().required('Category is required.'),
	countryId: Yup.number().nullable().required('Country is required.'),
	price: Yup.number()
		.required('Budget is required.')
		.positive('Budget must be greater than 0.')
		.min(1, 'Budget must be at least 1.')
		.max(9999999999, 'Budget cannot exceed 10 digits.'),
	description: Yup.string()
		.required('Description is required.')
		.max(250, 'Description cannot exceed 250 characters.'),
	tagIds: Yup.array().of(Yup.number()).min(1, 'At least one tag is required.'),
	documents: Yup.array()
		.of(Yup.object().required('Document is required.'))
		.min(1, 'At least one document is required.')
		.max(10, 'You can upload a maximum of 10 documents.'),
	images: Yup.array()
		.of(Yup.string().required('Image is required.'))
		.min(1, 'At least one image is required.')
		.max(10, 'You can upload a maximum of 10 images.'),
});

// Counter Offer Schema
export const counterOfferSchema = () =>
	Yup.object().shape({
		price: Yup.number()
			.required('Amount is required.')
			.positive('Amount must be greater than 0.')
			.min(1, 'Amount must be at least 1.')
			.max(9999999999, 'Amount cannot exceed 10 digits.')
			.typeError('Amount must be a valid number.'),
	});
