import { MyServiceSkeleton, PaginationBox } from 'components';
import NoResultFound from 'components/NoResultFound';
import { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { isMobileOnly } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import ReactSelect from 'react-select';
import { useMyServicesMutation } from 'services';
import useAuthStore from 'store/auth';
import { setModalConfig } from 'store/common';
import { dataLimits, formatRelativeDate } from 'utils';
import './style.scss';
const JobList: React.FC = () => {
	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const navigate = useNavigate();
	const sortingOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'low_to_high', label: 'Price low to high' },
		{ value: 'high_to_low', label: 'Price high to low' },
	];
	const filterOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'open', label: 'Open' },
		{ value: 'closed', label: 'Closed' },
		{ value: 'booked', label: 'Booked' },
	];
	const [sorting, setSorting] = useState(sortingOptions[0].value);
	const [filter, setFilter] = useState(filterOptions[0].value);
	const [myServiceData, setMyServiceData] = useState<any>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const limit = dataLimits?.myJobsServicesList;
	const [keyword, setKeyword] = useState('');
	const [totalItem, setTotalItem] = useState(Number || 1);
	const [filteredServiceData, setFilteredServiceData] = useState(myServiceData ?? []);
	const { mutateAsync: myServicesMutation, isPending: isServicePending } = useMyServicesMutation();

	useEffect(() => {
		handleSelect();
	}, [filter, sorting]);

	const getMyService = (page: number) => {
		const params = new URLSearchParams({
			pagination: 'true',
			skip: String(page),
			limit: String(limit),
			userId: String(user?.id),
		});

		if (user.type === 'BUYER') {
			params.append('filter', filter);
		} else if (user.type === 'SELLER') {
			params.append('sorting', sorting);
		}
		myServicesMutation(`?${params.toString()}`)
			.then((res: any) => {
				if (res?.success) {
					setMyServiceData(res?.data?.records);
					setTotalItem(res?.data?.total);
					setFilteredServiceData(res?.data?.records);
				}
			})
			.catch(() => {});
	};

	const handleDeleteService = (id: string) => {
		setModalConfig({
			visible: true,
			id: id,
			onClick: handleSelect,
			type: 'serviceDelete',
		});
	};

	const handleSelect = () => {
		getMyService(currentPage);
	};

	const handleSortChange = (selectedOption: any) => {
		const newSorting = selectedOption.value;
		if (newSorting) {
			setSorting(newSorting);
		} else {
			getMyService(currentPage);
		}
	};

	const handleFilterChange = (selectedOption: any) => {
		const newFilter = selectedOption.value;
		if (newFilter) {
			setFilter(newFilter);
		} else {
			getMyService(currentPage);
		}
	};

	const getDataByUserType = (
		buyerData: JSX.Element | string | null,
		sellerData: JSX.Element | string | null,
	) => {
		return user.type === 'BUYER' ? buyerData : sellerData;
	};

	const handleNavigation = () => {
		if (user.type === 'BUYER') {
			navigate('/post-job');
		} else {
			navigate('/post-service');
		}
	};

	const handleClick = (itemId: number) => {
		if (user.type === 'BUYER') {
			navigate(`/job-details/${itemId}`);
		} else {
			navigate(`/my-services-detail/${itemId}`);
		}
	};
	const handlePageChange = (page: number) => {
		if (currentPage === page) return;
		setCurrentPage(page);
		getMyService(page);
	};

	return (
		<>
			<div className="job-listing-section">
				<div className="d-flex justify-content-between mb-30">
					<h2 className="main-subtitle mb-0">
						{getDataByUserType('My Job Listing', 'My Services')}
					</h2>
					<button className="secondary-btn" onClick={() => handleNavigation()}>
						{getDataByUserType('Post a Job', 'Post a Service')}
					</button>
				</div>
				<div
					className={`d-flex  mb-30 ${isMobileOnly ? 'flex-column gap-3' : 'justify-content-between'}`}
				>
					<Form className="header-search">
						<i className="ri-search-2-line search"></i>

						<ReactSelect
							isSearchable
							placeholder={getDataByUserType('Search by Job Id', 'Search by Service Id')}
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
												setFilteredServiceData(myServiceData);
											}}
											onTouchEnd={() => {
												setKeyword('');
												setFilteredServiceData(myServiceData);
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

									const filteredData = myServiceData?.filter((item: any) => {
										const itemId = String(item?.id);

										return itemId.includes(keyword);
									});
									setFilteredServiceData(filteredData);
								}
							}}
						/>
					</Form>
					<div className="d-flex gap-2 align-items-center">
						<span className="dropdown-text">{getDataByUserType('Filter by:', 'Sort by:')}</span>
						<ReactSelect
							className="form-react-select"
							classNamePrefix="form-react-select"
							placeholder="All"
							options={user.type === 'BUYER' ? filterOptions : sortingOptions}
							value={(user.type === 'BUYER' ? filterOptions : sortingOptions).find(
								(option) => option.value === (user.type === 'BUYER' ? filter : sorting),
							)}
							onChange={(selectedOption) =>
								(user.type === 'BUYER' ? handleFilterChange : handleSortChange)(selectedOption)
							}
						/>
					</div>
				</div>
				{!isServicePending ? (
					<>
						{filteredServiceData?.length > 0 ? (
							<Row>
								{filteredServiceData?.map((item: any, index: any) => (
									<Col xl={4} lg={6} md={6} key={index} className="mb-30">
										<div className="job-posted" onClick={() => handleClick(item?.id)}>
											<div className="white-box">
												<h6 className="job-posted-id mb-3">
													{getDataByUserType('JobID', 'ServiceID')} <span>#{item?.id}</span>
												</h6>
												<div className="d-flex justify-content-between align-items-center mb-3">
													<h5 className="job-posted-title">{item?.title}</h5>
													<div className="d-flex gap-2">
														<span
															className={`job-posted-icon delete d-flex align-items-center ${item?.recievedBid > 0 || item?.status === 'Closed' ? 'disabled' : ''}`}
															onClick={(event) => {
																event.stopPropagation();
																if (item?.recievedBid > 0 || item?.status === 'Closed') return;
																handleDeleteService(item?.id);
															}}
														>
															<i className="ri-delete-bin-7-fill"></i>
														</span>
														<span
															className={`job-posted-icon edit align-items-center d-flex ${item?.recievedBid > 0 || item?.status === 'Closed' ? 'disabled' : ''}`}
															onClick={(event) => {
																event.stopPropagation();
																if (item?.recievedBid > 0 || item?.status === 'Closed') return;
																{
																	user.type === 'BUYER'
																		? navigate('/post-job', { state: item })
																		: navigate('/post-service', { state: item });
																}
															}}
														>
															<i className="ri-pencil-fill"></i>
														</span>
													</div>
												</div>
												<p className="job-posted-description mb-3">
													{item?.description.length > 35 ? (
														<>
															{`${item?.description.slice(0, 35)}`}
															<a className="more-link">...</a>
														</>
													) : (
														item?.description
													)}
												</p>

												{getDataByUserType(
													null,
													<>
														{item?.tags?.length > 0 && (
															<div className="d-flex gap-2 flex-wrap align-items-center mb-3">
																{item.tags.slice(0, 2).map((tag: any, index: number) => (
																	<div key={index} className="job-posted-badges">
																		{tag.name}
																	</div>
																))}
																{item.tags.length > 2 && (
																	<a className="job-posted-badges text-decoration-none">
																		+{item.tags.length - 2}
																	</a>
																)}
															</div>
														)}
													</>,
												)}

												<div className="d-flex flex-wrap gap-4 job-posted-details">
													<span>
														<i className="ri-map-pin-2-line"></i>
														{item?.country?.countryName?.length > 9 ? (
															<>
																{item?.country?.countryName.slice(0, 9)}
																<a className="more-link">...</a>
															</>
														) : (
															item?.country?.countryName
														)}
													</span>
													<span>
														<i className="ri-calendar-line"></i>
														{formatRelativeDate(item?.created, false)}
													</span>
													{user?.type === 'BUYER' || item?.priceRange || item?.price ? (
														<span>
															<i className="ri-money-dollar-circle-line"></i>
															{item?.priceRange ?? item?.price}
														</span>
													) : null}
												</div>
											</div>
											{getDataByUserType(
												<>
													<div className="job-posted-bid-detail d-flex justify-content-between">
														<div className="title">
															<i className="ri-auction-line"></i> {item?.recievedBid || 0} Bids
															received
														</div>
														{item?.status === 'Open' ? (
															<div className="badges">{item?.status}</div>
														) : item?.status === 'Closed' ? (
															<div className="badges red">{item?.status}</div>
														) : item?.status === 'Booked' ? (
															<div className="badges ">{item?.status}</div>
														) : null}
													</div>
												</>,
												null,
											)}
										</div>
									</Col>
								))}
							</Row>
						) : (
							<NoResultFound />
						)}
					</>
				) : (
					<MyServiceSkeleton limit={limit} type={getDataByUserType('job', 'service')} />
				)}
			</div>
			{filteredServiceData?.length > 0 && (
				<div className="d-flex justify-content-center pt-4">
					<PaginationBox
						totalItems={totalItem}
						currentPage={currentPage}
						limit={limit}
						onPageChange={handlePageChange}
					/>
				</div>
			)}
		</>
	);
};

export default JobList;
