import React, { useState } from 'react';
import { Accordion } from 'react-bootstrap';
import { useCountryListQuery } from 'services';
import './styles.scss';

const Location: React.FC<any> = ({
	handleFilterSelect,
	setSelectParamCountry,
	selectParamCountry,
}: any) => {
	const { data: countryList } = useCountryListQuery();
	const [searchQuery, setSearchQuery] = useState<string>('');

	const handleSelect = (country: any) => {
		setSelectParamCountry({
			countryId: country?.id || null,
			countryName: country?.countryName || '',
		});
		handleFilterSelect('countryId', country?.id);
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	const filteredCountries = countryList?.country?.filter((country: any) =>
		country?.countryName?.toLowerCase()?.includes(searchQuery?.toLowerCase()),
	);

	return (
		<div className="filter-box">
			<Accordion defaultActiveKey="0">
				<Accordion.Item eventKey="0">
					<Accordion.Header>Location</Accordion.Header>
					<Accordion.Body>
						<div className="position-relative search-input">
							<i className="ri-search-2-line "></i>
							<input
								type="search"
								placeholder="Search"
								className="form-control"
								value={searchQuery}
								onChange={handleSearchChange}
							/>
						</div>
						<div className="d-flex flex-column search-data">
							{filteredCountries?.map((country: any) => (
								<div
									className={`title ${selectParamCountry?.countryId === country.id ? 'active' : ''}`}
									key={country.id}
									onClick={() => handleSelect(country)}
								>
									{country.countryName}
								</div>
							))}
						</div>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</div>
	);
};

export default Location;
