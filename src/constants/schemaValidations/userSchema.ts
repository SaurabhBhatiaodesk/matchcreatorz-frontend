import {
	AvatarInterface,
	ChangePasswordInterface,
	EditOtherDetailsInterface,
	EditProfileInterface,
} from 'constants/interfaces';
import * as Yup from 'yup';

export const changePasswordInitialValues: ChangePasswordInterface = {
	currentPassword: '',
	newPassword: '',
	confirmPassword: '',
};

export const editProfileInitialValues: EditProfileInterface = {
	fullName: '',
	gender: '',
	address: '',
	countryId: null,
	stateId: null,
	city: '',
	zipcode: null,
	bio: '',
};

export const editOtherDetailsInitialValues: EditOtherDetailsInterface = {
	dob: '',
	gender: '',
	priceRange: '',
	categoryId: null,
	tagId: [],
	resume: '',
	resumeName: '',
	responseTime: '',
};

export const avatarInitialValues: AvatarInterface = {
	image: '',
};

// Change Password Schema
export const changePasswordSchema = () =>
	Yup.object().shape({
		currentPassword: Yup.string().required('Old Password is required.'),
		newPassword: Yup.string()
			.min(8, 'Password must be at least 8 characters long.')
			.matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
			.matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
			.matches(/\d/, 'Password must contain at least one digit.')
			.matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character.')
			.required('New Password is required.'),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref('newPassword')], 'Passwords must match.')
			.required('Confirm Password is required.'),
	});

// Edit Profile Schema
export const editProfileSchema = () =>
	Yup.object().shape({
		fullName: Yup.string()
			.max(50, 'Full Name cannot exceed 50 characters.')
			.required('Full Name is required.')
			.matches(/^[A-Za-z\s]+$/, 'Full Name should only contain alphabetic characters.'),
		gender: Yup.string().required('Gender is required.'),
		address: Yup.string()
			.required('Address is required.')
			.max(250, 'Address cannot exceed 250 characters.'),
		countryId: Yup.number().nullable().required('Country is required.'),
		stateId: Yup.number().nullable().required('State is required.'),
		city: Yup.string().required('City is required.').max(30, 'City cannot exceed 30 characters.'),
		zipcode: Yup.string()
			.required('Zip Code is required.')
			.max(9, 'Zip Code cannot exceed 9 characters.'),
		bio: Yup.string().required('Bio is required.').max(250, 'Bio cannot exceed 250 characters.'),
	});

// Edit Other Details Schema
const today = new Date();
const minAge = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
export const editOtherDetailsSchema = () =>
	Yup.object().shape({
		dob: Yup.date()
			.required('Date of birth is required.')
			.max(minAge, 'Your age must be greater than 10 years.'),
		gender: Yup.string().required('Gender is required.'),
		priceRange: Yup.string().required('Price range is required.'),
		categoryId: Yup.string().required('Category is required.'),
		tagId: Yup.array()
			.of(Yup.string())
			.min(1, 'At least one tag must be selected.')
			.required('Tag selection is required.'),
		resume: Yup.string().required('Resume is required.'),
		resumeName: Yup.string().optional(),
		responseTime: Yup.string().required('Response Time is required.'),
	});

// Avatar Schema
export const avatarSchema = Yup.object().shape({
	image: Yup.string()
		.required('Image is required.')
		.matches(/\.(png|jpg|jpeg|gif)$/i, 'Invalid image format.'),
});
