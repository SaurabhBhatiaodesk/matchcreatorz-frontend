import {
	PostBookingCompleteProofInterface,
	PostBookingMilestoneInterface,
	PostJobInterface,
} from 'constants/interfaces';
import * as Yup from 'yup';

export const postJobInitialValues: PostJobInterface = {
	title: '',
	categoryId: null,
	countryId: null,
	description: '',
	tagIds: [],
	documents: [],
	images: [],
};

export const postBookingMilestoneInitialValues: PostBookingMilestoneInterface = {
	title: '',
	description: '',
	startDate: '',
	endDate: '',
};

export const postBookingCompleteProofInitialValues: PostBookingCompleteProofInterface = {
	images: [],
};

// Post Job Schema
export const postJobSchema = Yup.object().shape({
	title: Yup.string()
		.required('Job title is required.')
		.max(50, 'Job title cannot exceed 50 characters.'),
	categoryId: Yup.number().nullable().required('Category is required.'),
	countryId: Yup.number().nullable().required('Country is required.'),
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

// Post Booking Milestone Schema
export const postBookingMilestoneSchema = Yup.object().shape({
	title: Yup.string()
		.required('Job title is required.')
		.max(50, 'Job title cannot exceed 50 characters.'),
	description: Yup.string()
		.required('Description is required.')
		.max(250, 'Description cannot exceed 250 characters.'),
	startDate: Yup.string().required('Start date is required.'),
	endDate: Yup.string().required('End date is required.'),
});

// Post Booking Complete Proof Schema
export const postBookingCompleteProofSchema = Yup.object().shape({
	images: Yup.array()
		.of(Yup.string().required('Image is required.'))
		.min(1, 'At least one image is required.')
		.max(5, 'You can upload a maximum of 5 images.'),
});
