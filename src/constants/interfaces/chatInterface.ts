export interface SendChatRequestInterface {
	sellerId: number | null;
	message: string;
}

export interface AddUpdateOfferInterface {
	title: string;
	categoryId: number | null;
	countryId: number | null;
	price: number | null;
	description: string;
	tagIds: string[];
	documents: string[];
	images: string[];
}

export interface CounterOfferInterface {
	price: number | null;
}
