import {
	BidInterface,
	BookingReviewInterface,
	FaqStep1Interface,
	ForgotPasswordInterface,
	PortfolioInterface,
	ProfileInterface,
	ReportInterface,
	ResetPasswordInterface,
	SellerSignupInterface,
	SignInInterface,
	SignUpInterface,
} from 'constants/interfaces';
import * as Yup from 'yup';

export const signInInitialValues: SignInInterface = {
	countryCode: '+91',
	countrySlug: 'IN',
	userName: null,
	password: '',
};

export const signUpInitialValues: SignUpInterface = {
	avatar: '',
	fullName: '',
	email: '',
	phone: '',
	countryCode: '+91',
	countrySlug: 'IN',
	city: '',
	stateId: null,
	countryId: null,
	zipcode: null,
	password: '',
	confirmPassword: '',
	agreeTerms: false,
	quickdent: false,
};

export const sellerSignUpInitialValues: SellerSignupInterface = {
	avatar: '',
	fullName: '',
	email: '',
	countryCode: '+91',
	countrySlug: 'IN',
	phone: '',
	password: '',
	confirmPassword: '',
	agreeTerms: false,
	quickdent: false,
};

export const resetPasswordInitialValues: ResetPasswordInterface = {
	password: '',
	confirmPassword: '',
};

export const forgetPasswordInitialValues: ForgotPasswordInterface = {
	userName: null,
	countryCode: '+91',
	countrySlug: 'IN',
};

export const profileInitialValues: ProfileInterface = {
	gender: '',
	priceRange: '',
	dob: '',
	city: '',
	countryId: null,
	stateId: null,
	zipcode: '',
	categoryId: '',
	tagId: [],
	bio: '',
	responseTime: '',
	resume: '',
	resumeName: '',
};

export const faqStepInitialValues: FaqStep1Interface = {
	question: '',
	answer: '',
};

export const portfolioInitialValues: PortfolioInterface = {
	title: '',
	image: '',
};

export const reportInitialValues: ReportInterface = {
	reason: '',
};

export const addBidInitialValues: BidInterface = {
	bidAmount: '',
};

export const addBookingReviewInitialValues: BookingReviewInterface = {
	rating: null,
	review: '',
};

// Sign In Schema
export const signInSchema = Yup.object().shape({
	countryCode: Yup.string().optional(),
	userName: Yup.string()
		.required('Username is required.')
		.test(
			'is-valid-username',
			'Username must be a valid phone number or email address.',
			function (value) {
				const phoneWithCountryCodeRegex = /^\+?[1-9]\d{1,14}$/;
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

				return phoneWithCountryCodeRegex.test(value) || emailRegex.test(value);
			},
		),
	password: Yup.string()
		.required('Password is required.')
		.min(8, 'Password must be at least 8 characters long.'),
});

// Sign Up Schema
export const signUpSchema = Yup.object().shape({
	avatar: Yup.string().optional(),
	fullName: Yup.string()
		.required('Full Name is required.')
		.max(50, 'Full Name cannot exceed 50 characters.')
		.matches(/^[A-Za-z\s]+$/, 'Full Name should contain only alphabetic characters.'),
	email: Yup.string()
		.required('Email is required.')
		.email('Please enter a valid email address.')
		.matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Please enter a valid email address.'),
	phone: Yup.string().required('Mobile Number is required.'),
	zipcode: Yup.string()
		.required('ZipCode is required.')
		.max(9, 'Zipcode cannot exceed 9 characters.'),
	city: Yup.string().required('City is required.').max(30, 'City cannot exceed 30 characters.'),
	stateId: Yup.number().required('State is required.'),
	countryId: Yup.number().required('Country is required.'),
	password: Yup.string()
		.required('Password is required.')
		.min(
			7,
			'Password must be at least 8 characters long, including an uppercase letter, a number, and a special character (!@#$%^&*).',
		),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password')], 'Passwords must match.')
		.required('Please confirm your password.'),
	agreeTerms: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions.'),
	quickdent: Yup.boolean().oneOf([true], 'You must agree to receive SMS verification messages.'),
});

// Seller Sign Up Schema
export const sellerSignUpSchema = Yup.object().shape({
	avatar: Yup.string().optional(),
	fullName: Yup.string()
		.required('Full Name is required.')
		.max(50, 'Full Name cannot exceed 50 characters.')
		.matches(/^[A-Za-z\s]+$/, 'Full Name should contain only alphabetic characters.'),
	email: Yup.string()
		.required('Email is required.')
		.email('Please enter a valid email address.')
		.matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Please enter a valid email address.'),
	phone: Yup.string().required('Mobile Number is required.'),
	password: Yup.string()
		.required('Password is required.')
		.min(
			7,
			'Password must be at least 8 characters long, including an uppercase letter, a number, and a special character (!@#$%^&*).',
		),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password')], 'Passwords must match.')
		.required('Please confirm your password.'),
	agreeTerms: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions.'),
	quickdent: Yup.boolean().oneOf([true], 'You must agree to receive SMS verification messages.'),
});

// Forgot Password Schema
export const forgotPasswordSchema = Yup.object().shape({
	userName: Yup.string()
		.required('Username is required.')
		.test(
			'is-valid-username',
			'Username must be a valid phone number or email address.',
			function (value) {
				const phoneWithCountryCodeRegex = /^\+?[1-9]\d{1,14}$/;
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

				return phoneWithCountryCodeRegex.test(value) || emailRegex.test(value);
			},
		),
	countryCode: Yup.string().optional(),
});

// Reset Password Schema
export const resetPasswordSchema = Yup.object().shape({
	password: Yup.string()
		.required('Password is required.')
		.min(8, 'Password must be at least 8 characters long.')
		.matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
		.matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
		.matches(/\d/, 'Password must contain at least one digit.')
		.matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character.'),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password')], 'Passwords must match.')
		.required('Please confirm your password.'),
});

// Contact Us Schema
export const contactUsSchema = Yup.object().shape({
	fullName: Yup.string()
		.required('Full Name is required.')
		.max(50, 'Full Name cannot exceed 50 characters.')
		.matches(/^[A-Za-z\s]+$/, 'Full Name should contain only alphabetic characters.'),
	email: Yup.string()
		.required('Email is required.')
		.email('Please enter a valid email address.')
		.matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Please enter a valid email address.'),
	phone: Yup.string().required('Mobile Number is required.'),
	description: Yup.string().required('Description is required.'),
});

// Profile Schema
const today = new Date();
const minAge = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
export const profileSchema = Yup.object().shape({
	gender: Yup.string().required('Gender is required.'),
	priceRange: Yup.string().required('Price range is required.'),
	dob: Yup.date()
		.required('Date of birth is required.')
		.max(minAge, 'Your age must be greater than 10 years.'),
	countryId: Yup.number().nullable().required('Country is required.'),
	stateId: Yup.number().nullable().required('State is required.'),
	city: Yup.string().required('City is required.').max(30, 'City cannot exceed 30 characters.'),
	zipcode: Yup.string()
		.required('Zipcode is required.')
		.max(9, 'Zipcode cannot exceed 9 characters.'),
	categoryId: Yup.string().required('Category is required.'),
	tagId: Yup.array()
		.of(Yup.string())
		.min(1, 'At least one tag must be selected.')
		.required('Tag selection is required.'),
	bio: Yup.string().required('Bio is required.').max(250, 'Bio cannot exceed 250 characters.'),
	banner: Yup.string(),
	resume: Yup.string().required('Resume is required.'),
	resumeName: Yup.string().optional(),
	responseTime: Yup.string().required('Response Time is required.'),
});

// FAQ Schema
export const faqSchema = Yup.object().shape({
	question: Yup.string()
		.required('Question is required.')
		.min(1, 'Question cannot be empty.')
		.max(100, 'Question cannot exceed 100 characters.'),
	answer: Yup.string()
		.required('Answer is required.')
		.min(1, 'Answer cannot be empty.')
		.max(250, 'Answer cannot exceed 250 characters.'),
});

// Portfolio Schema
export const portfolioSchema = Yup.object().shape({
	title: Yup.string()
		.required('Title is required.')
		.min(1, 'Title must be at least 1 character long.')
		.max(15, 'Title cannot exceed 15 characters.'),
	image: Yup.string()
		.required('Image is required.')
		.matches(
			/\.(png|jpg|jpeg|gif)$/i,
			'Invalid image format. Only PNG, JPG, JPEG, and GIF formats are allowed.',
		),
});

// Report Schema
export const reportSchema = Yup.object().shape({
	reason: Yup.string().required('Reason is required.'),
});

// Bid Schema
export const bidSchema = Yup.object().shape({
	bidAmount: Yup.number()
		.positive('Bid Amount must be greater than 0.')
		.required('Bid Amount is required.')
		.min(1, 'Bid Amount must be at least 1.')
		.max(9999999999, 'Bid Amount cannot exceed 10 digits.')
		.typeError('Bid Amount must be a valid number.'),
});

// Booking Rating Schema
export const bookingRatingSchema = Yup.object().shape({
	rating: Yup.number()
		.required('Rating is required.')
		.min(1, 'Rating must be at least 1.')
		.max(5, 'Rating cannot exceed 5.'),
	review: Yup.string()
		.required('Review is required.')
		.max(250, 'Review cannot exceed 250 characters.'),
});
