export interface Filter {
	postIdFilteredByDate?: number[];
	postIdFilteredByName?: number[];
	isPool?: boolean;
	numberOfPeople?: number;
	numberOfBeds?: number;
	numberOfBedrooms?: number;
	dateOfArrival?: string;
	dateOfDeparture?: string;
}