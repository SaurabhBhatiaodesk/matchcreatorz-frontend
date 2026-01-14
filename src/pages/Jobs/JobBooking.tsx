import {
	JobsBookingsActiveTab,
	JobsBookingsCancelledTab,
	JobsBookingsCompletedTab,
	PaginationBox,
} from 'components';
import { useEffect, useMemo, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useGetBookingListMutation } from 'services';
import { dataLimits } from 'utils';

const JobBooking: React.FC = () => {
	const [activeTab, setActiveTab] = useState('Active');
	const limit = dataLimits?.activeBookingList;
	const [currentPage, setCurrentPage] = useState(1);
	const [bookingData, setBookingData] = useState<any[]>([]);
	const [filteredBookingData, setFilteredBookingData] = useState(bookingData || []);

	const sortingOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'old_to_new', label: 'Old to New' },
		{ value: 'new_to_old', label: 'New to Old' },
	];
	const [sorting, setSorting] = useState(sortingOptions[0].value);
	const filterOptions = [
		{ value: 'Ongoing', label: 'Ongoing' },
		{ value: 'Amidst-Cancellation', label: 'Amidst cancellation' },
		{ value: 'Amidst-Completion-Process', label: 'Amidst completion process' },
		{ value: 'In-dispute', label: 'In dispute' },
	];
	const [filter, setFilter] = useState(filterOptions[0].value);
	const [keyword, setKeyword] = useState('');
	const [totalItem, setTotalItem] = useState(Number || 1);

	const handleTabSelect = (key: string) => {
		setActiveTab(key);
		setCurrentPage(1);
	};
	const urlQuery = useMemo(() => {
		return activeTab === 'Active'
			? `type=${activeTab}&pagination=true&skip=${currentPage}&limit=${limit}&filterBy=${filter}&sorting=${sorting}`
			: `type=${activeTab}&pagination=true&skip=${currentPage}&limit=${limit}&sorting=${sorting}`;
	}, [activeTab, filter, sorting, currentPage]);

	const { mutateAsync: getBookingListMutation, isPending: isBookingList } =
		useGetBookingListMutation();

	useEffect(() => {
		getMyBookingData();
	}, [urlQuery, activeTab]);

	const getMyBookingData = () => {
		getBookingListMutation(`?${urlQuery}`)
			.then((res: any) => {
				if (res?.success) {
					setBookingData(res?.data?.records);
					setTotalItem(res?.data?.total);
					setFilteredBookingData(res?.data?.records);
				}
			})
			.catch(() => {});
	};

	const handleSortChange = (selectedOption: any) => {
		const newSorting = selectedOption.value;
		if (newSorting) {
			setSorting(newSorting);
		}
	};

	const handleFilterChange = (selectedOption: any) => {
		const newFilter = selectedOption.value;
		if (newFilter) {
			setFilter(newFilter);
		}
	};

	const handlePageChange = (page: number) => {
		if (currentPage === page) return;
		setCurrentPage(page);
	};

	return (
		<div className="job-booking d-flex flex-column">
			<h4 className="main-subtitle mb-0">Jobs/Bookings</h4>
			<Tabs
				defaultActiveKey={activeTab}
				className="custom-tabs"
				onSelect={(key: any) => handleTabSelect(key)}
			>
				<Tab eventKey="Active" title="Active">
					<JobsBookingsActiveTab
						isBookingList={isBookingList}
						limit={limit}
						bookingData={bookingData}
						keyword={keyword}
						filteredBookingData={filteredBookingData}
						activeTab={activeTab}
						setKeyword={setKeyword}
						setFilteredBookingData={setFilteredBookingData}
						getMyBookingData
						filterOptions={filterOptions}
						onFilterChange={handleFilterChange}
						filter={filter}
						sortingOptions={sortingOptions}
						onSortChange={handleSortChange}
						sorting={sorting}
					/>
				</Tab>

				<Tab eventKey="Completed" title="Completed">
					<JobsBookingsCompletedTab
						isBookingList={isBookingList}
						limit={limit}
						bookingData={bookingData}
						keyword={keyword}
						filteredBookingData={filteredBookingData}
						activeTab={activeTab}
						setKeyword={setKeyword}
						setFilteredBookingData={setFilteredBookingData}
						getMyBookingData
						sortingOptions={sortingOptions}
						onSortChange={handleSortChange}
						sorting={sorting}
					/>
				</Tab>

				<Tab eventKey="Cancelled" title="Cancelled">
					<JobsBookingsCancelledTab
						isBookingList={isBookingList}
						limit={limit}
						bookingData={bookingData}
						keyword={keyword}
						filteredBookingData={filteredBookingData}
						activeTab={activeTab}
						setKeyword={setKeyword}
						setFilteredBookingData={setFilteredBookingData}
						getMyBookingData
						sortingOptions={sortingOptions}
						onSortChange={handleSortChange}
						sorting={sorting}
					/>
				</Tab>
			</Tabs>

			{filteredBookingData?.length > 0 && (
				<div className="d-flex justify-content-center pt-4">
					<PaginationBox
						totalItems={totalItem}
						currentPage={currentPage}
						limit={limit}
						onPageChange={handlePageChange}
					/>
				</div>
			)}
		</div>
	);
};

export default JobBooking;
