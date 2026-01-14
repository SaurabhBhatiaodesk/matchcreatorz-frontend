export interface AddAmountInterface {
	amount: number | string;
}

export interface WithdrawMoneyInterface {
	amount: number | string;
	accountNumber: string;
	iban: string;
	swift: string;
	countryId: number | null;
	firstName: string;
	lastName: string;
}
