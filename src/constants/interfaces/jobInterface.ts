export interface PostJobInterface {
	title: string;
	categoryId: number | null;
	countryId: number | null;
	description: string;
	tagIds: string[];
	documents: string[];
	images: string[];
}

export interface PostBookingMilestoneInterface {
	title: string;
	description: string;
	startDate: string;
	endDate: string;
}

export interface PostBookingCompleteProofInterface {
	images: string[];
}
