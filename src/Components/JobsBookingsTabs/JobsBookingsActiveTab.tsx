import BookingCard from 'components/BookingCard';
import NoResultFound from 'components/NoResultFound';
import { ActiveBookingSkeleton } from 'components/Skeleton';
import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { isMobileOnly } from 'react-device-detect';
import ReactSelect from 'react-select';

interface JobsBookingsActiveTabProps {
	isBookingList: any;
	limit: any;
	bookingData: any;
	keyword: any;
	filteredBookingData: any;
	setKeyword: any;
	setFilteredBookingData: any;
	activeTab: any;
	getMyBookingData: any;
	filterOptions: any;
	onFilterChange: (selectedOption: any) => void;
	filter: any;
	sortingOptions: any;
	onSortChange: (selectedOption: any) => void;
	sorting: any;
}

const JobsBookingsActiveTab: React.FC<JobsBookingsActiveTabProps> = ({
	isBookingList,
	limit,
	bookingData,
	keyword,
	filteredBookingData,
	setKeyword,
	setFilteredBookingData,
	activeTab,
	getMyBookingData,
	filterOptions,
	onFilterChange,
	filter,
	sortingOptions,
	onSortChange,
	sorting,
}) => {
	return (
		<>
			<h5 className="booking-title mb-30">Active Bookings</h5>
			<div
				className={`d-flex  mb-30 ${isMobileOnly ? 'flex-column gap-3' : 'justify-content-between'}`}
			>
				<Form className="header-search">
					<i className="ri-search-2-line search"></i>

					<ReactSelect
						isSearchable
						placeholder="Search by Booking ID"
						menuIsOpen={false}
						onInputChange={(newInputValue, action) => {
							if (action.action === 'input-change') setKeyword(newInputValue);
						}}
						inputValue={keyword}
						components={{
							DropdownIndicator: () =>
								keyword ? (
									<i
										className="ri-close-circle-line close"
										onClick={() => {
											setKeyword('');
											setFilteredBookingData(bookingData);
										}}
									></i>
								) : null,
							IndicatorSeparator: () => null,
						}}
						className="form-react-select"
						classNamePrefix="form-react-select"
						autoFocus
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault();

								const filteredData = bookingData.filter((item: any) => {
									const itemId = String(item?.id);
									return itemId.includes(keyword);
								});
								setFilteredBookingData(filteredData);
							}
						}}
					/>
				</Form>
				<div className="d-flex gap-3">
					<div className="d-flex gap-2 align-items-center">
						<span className="dropdown-text">Filter by:</span>
						<ReactSelect
							options={filterOptions}
							onChange={onFilterChange}
							value={filterOptions.find((option: any) => option.value === filter)}
							className="form-react-select"
							classNamePrefix="form-react-select"
							placeholder="All"
						/>
					</div>
					<div className="d-flex gap-2 align-items-center">
						<span className="dropdown-text">Sort by:</span>
						<ReactSelect
							options={sortingOptions}
							onChange={onSortChange}
							value={sortingOptions.find((option: any) => option.value === sorting)}
							className="form-react-select"
							classNamePrefix="form-react-select"
							placeholder="All"
						/>
					</div>
				</div>
			</div>

			{!isBookingList ? (
				<>
					{filteredBookingData?.length > 0 ? (
						<>
							<Row>
								{filteredBookingData?.map((item: any, index: any) => (
									<Col xl={4} lg={6} md={6} className="mb-30" key={index}>
										<BookingCard
											bookingData={item}
											activeTab={activeTab}
											handleBookingData={getMyBookingData}
										/>
									</Col>
								))}
							</Row>
						</>
					) : (
						<NoResultFound />
					)}
				</>
			) : (
				<ActiveBookingSkeleton limit={limit} type={'Active'} />
			)}
		</>
	);
};

export default JobsBookingsActiveTab;
