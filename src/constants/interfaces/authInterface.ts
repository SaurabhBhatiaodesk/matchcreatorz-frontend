export interface SignInInterface {
	countryCode: string;
	countrySlug?: string;
	userName: number | null;
	password: string;
}

export interface SignUpInterface {
	avatar: string;
	fullName: string;
	email: string;
	phone: string;
	countryCode: string;
	countrySlug: string;
	countryId: number | null;
	stateId: number | null;
	city: string;
	zipcode: number | null;
	password: string;
	confirmPassword: string;
	agreeTerms: boolean;
	quickdent: boolean;
}

export interface SellerSignupInterface {
	avatar: string;
	fullName: string;
	email: string;
	countryCode: string;
	countrySlug: string;
	phone: string;
	password: string;
	confirmPassword: string;
	agreeTerms: boolean;
	quickdent: boolean;
}

export interface ResetPasswordInterface {
	password: string;
	confirmPassword: string;
}

export interface ForgotPasswordInterface {
	userName: number | null;
	countryCode: string;
	countrySlug: string;
}

export interface userCreateProfileInterface {
	avatar: string;
	ageGroup: string;
	country: string;
	city: string;
	deviceToken: string;
}

export interface ContactUsInitialValues {
	fullName: string;
	email: string;
	phone: string;
	description: string;
}

export interface UserInterface {
	_id?: string;
	userType?: string;
	firstName?: string;
	lastName?: string;
	userDocument?: string[];
	countryCode?: string;
	mobile?: string;
	formattedPhone?: string;
	email?: string;
	emailVerified?: boolean;
	step?: number;
	experienceIds?: string[];
	interestIds?: string[];
	languages?: string[];
	favourite?: string[];
	stripeAdded?: boolean;
	deviceToken?: string;
	isSuspended?: boolean;
	isFeatured?: boolean;
	isDeleted?: boolean;
	isOnline?: boolean;
	isVerified?: boolean;
	isReviewed?: boolean;
	location?: number[];
	accounts?: any[];
	isSocial?: boolean;
	authTokenIssuedAt?: any;
	created?: string;
	updated?: string;
	avatar?: string;
	city?: string;
	country?: string;
	dateOfBirth?: string;
	gender?: string;
	nationality?: string;
	yearOfExperience?: string;
	address?: string;
	userAbout?: string;
	visitDescription?: string;
	age?: string;
	ageGroup?: string;
	interests?: string[];
	experience?: string[];
}

export interface ProfileInterface {
	gender: string;
	priceRange: string;
	dob: string;
	city: string;
	countryId: number | null;
	stateId: number | null;
	zipcode: string;
	categoryId: string;
	tagId: string[];
	bio: string;
	resume: string;
	responseTime: string;
	resumeName?: string;
}

export interface FaqStep1Interface {
	question: string;
	answer: string;
}

export interface PortfolioInterface {
	title: string;
	image: string;
}

export interface ReportInterface {
	reason: string;
}

export interface BidInterface {
	bidAmount: string;
}

export interface BookingReviewInterface {
	rating: number | null;
	review: string;
}
