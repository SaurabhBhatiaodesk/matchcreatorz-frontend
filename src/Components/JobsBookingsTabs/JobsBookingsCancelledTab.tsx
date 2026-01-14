import BookingCard from 'components/BookingCard';
import NoResultFound from 'components/NoResultFound';
import { ActiveBookingSkeleton } from 'components/Skeleton';
import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import ReactSelect from 'react-select';

interface JobsBookingsCancelledTabProps {
	isBookingList: any;
	limit: any;
	bookingData: any;
	keyword: any;
	filteredBookingData: any;
	setKeyword: any;
	setFilteredBookingData: any;
	activeTab: any;
	getMyBookingData: any;
	sortingOptions: any;
	onSortChange: (selectedOption: any) => void;
	sorting: any;
}

const JobsBookingsCancelledTab: React.FC<JobsBookingsCancelledTabProps> = ({
	isBookingList,
	limit,
	bookingData,
	keyword,
	filteredBookingData,
	setKeyword,
	setFilteredBookingData,
	activeTab,
	getMyBookingData,
	sortingOptions,
	onSortChange,
	sorting,
}) => {
	return (
		<>
			<h5 className="booking-title mb-30">Cancelled Bookings</h5>
			<div className="d-flex justify-content-between mb-30">
				<Form className="header-search">
					<i className="ri-search-2-line search"></i>
					<ReactSelect
						isSearchable
						placeholder="Search by Booking ID"
						menuIsOpen={false}
						onInputChange={(newInputValue) => {
							setKeyword(newInputValue);
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
									const itemTitle = item?.title?.toLowerCase() || '';
									const itemDescription = item?.description?.toLowerCase() || '';
									const itemId = String(item?.id);

									return (
										itemTitle.includes(keyword.toLowerCase()) ||
										itemDescription.includes(keyword.toLowerCase()) ||
										itemId.includes(keyword)
									);
								});

								setFilteredBookingData(filteredData);
							}
						}}
					/>
				</Form>
				<div className="d-flex gap-3">
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
						<Row>
							{filteredBookingData?.map((item: any, index: any) => (
								<Col lg={4} className="mb-30" key={index}>
									<BookingCard
										bookingData={item}
										activeTab={activeTab}
										handleBookingData={getMyBookingData}
									/>
								</Col>
							))}
						</Row>
					) : (
						<NoResultFound />
					)}
				</>
			) : (
				<ActiveBookingSkeleton limit={limit} type={'Cancelled'} />
			)}
		</>
	);
};

export default JobsBookingsCancelledTab;
