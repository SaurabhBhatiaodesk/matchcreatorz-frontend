export interface ChangePasswordInterface {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}
export interface EditProfileInterface {
	fullName: string;
	gender: string;
	address: string;
	countryId: number | null;
	stateId: number | null;
	city: string;
	zipcode: number | null;
	bio: string;
}
export interface EditOtherDetailsInterface {
	dob: string;
	gender: string;
	priceRange: string;
	categoryId: number | null;
	tagId: string[];
	resume: string;
	resumeName: string;
	responseTime: string;
}

export interface AvatarInterface {
	image: string;
}
