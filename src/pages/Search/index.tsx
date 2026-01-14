import {
	Category,
	JobCard,
	Location,
	PaginationBox,
	ResponseTime,
	Salary,
	SellerCard,
	SellerCardSkeleton,
	ServiceCard,
	ServiceCardSkeleton,
	Tags,
} from 'components';
import NoResultFound from 'components/NoResultFound';
import { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Nav, Row, Tab } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import ReactSelect from 'react-select';
import { useHomeTopSellerListMutation, useServicesMutation } from 'services';
import useAuthStore from 'store/auth';
import { setModalConfig } from 'store/common';
import { dataLimits } from 'utils';
import './styles.scss';

const Search: React.FC = () => {
	const { token, user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});

	const [currentPage, setCurrentPage] = useState(1);
	const limit = !token ? dataLimits?.beforeSearchLimit : dataLimits?.afterSearchLimit;
	const location = useLocation();
	const [searchValue, setSearchValue] = useState('');
	const sortingOptions = [
		{ value: 'low_to_high', label: 'Price low to high' },
		{ value: 'high_to_low', label: 'Price high to low' },
	];
	const [sorting, setSorting] = useState(sortingOptions[0].value);
	const [urlQuery, setUrlQuery] = useState<any>(
		user?.id
			? `pagination=true&userId=${user?.id}&skip=1&limit=${limit}&sorting=low_to_high`
			: `pagination=true&skip=1&limit=${limit}&sorting=low_to_high`,
	);
	const [selectParamCountry, setSelectParamCountry] = useState<any>({
		countryId: null,
		countryName: '',
	});
	const [selectParamSalary, setSelectParamSalary] = useState<any>();
	const [selectParamResponseTime, setSelectParamResponseTime] = useState<any>();
	const [selectParamCategory, setSelectParamCategory] = useState<any>();
	const [selectParamTag, setSelectParamTag] = useState<any>();
	const [isLoading, setIsLoading] = useState(false);

	const resetSkip = () => {
		params.delete('searchTerm');
		params.delete('skip');
		params.append('skip', '1');
		return params.toString();
	};
	const initialTab = location.state?.activeTab
		? location.state?.activeTab
		: user?.type === 'SELLER'
			? 'BUYER'
			: 'SELLER';
	const [activeTab, setActiveTab] = useState<string>(initialTab);
	const [topSellerData, setTopSellerData] = useState([]);
	const [totalSellerData, setTotalSellerData] = useState(0);
	const [serviceData, setServiceData] = useState([]);
	const [totalServicesData, setTotalServicesData] = useState(0);
	const [reRender, setRerender] = useState<any>();
	const { mutateAsync: homeTopSellerListMutation, isPending: isHomeTopSeller } =
		useHomeTopSellerListMutation();
	const { mutateAsync: servicesMutation, isPending: isServices } = useServicesMutation({
		userType: activeTab === 'SERVICES' || activeTab === 'SELLER' ? 'BUYER' : 'SELLER',
	});

	useEffect(() => {
		const newTab = location.state?.activeTab || initialTab;
		setActiveTab(newTab);
		setCurrentPage(1);
		const temp = resetSkip();
		getFilterData(temp, newTab);
	}, [location.state?.activeTab, user?.type, reRender]);

	const params = new URLSearchParams(urlQuery);

	useEffect(() => {
		const { searchValue } = location?.state || {};
		if (searchValue) {
			setSearchValue(searchValue);
			handleFilterSelect('searchTerm', searchValue);
		} else {
			setSearchValue('');
			const temp = resetSkip();
			getFilterData(temp, activeTab);
		}
		setCurrentPage(1);
	}, [location?.state, reRender]);

	const getFilterData = async (queryString: string, activeTab: string) => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
		setIsLoading(true);
		if (activeTab === 'SELLER') {
			homeTopSellerListMutation(`?${queryString}`)
				.then((res: any) => {
					if (res?.success) {
						setTopSellerData(res?.data?.result);
						setTotalSellerData(res?.data?.total);
					}
				})
				.catch(() => {});
		} else if (activeTab === 'SERVICES' || activeTab === 'BUYER') {
			servicesMutation(`?${queryString}`)
				.then((res: any) => {
					if (res?.success) {
						setServiceData(res?.data?.records);
						setTotalServicesData(res?.data?.total);
					}
				})
				.catch(() => {});
		}
		setIsLoading(false);
	};

	const handleTabSelect = (key: string) => {
		setActiveTab(key);
		setCurrentPage(1);
		const temp = resetSkip();
		getFilterData(temp, key);
	};

	const handleSortChange = (selectedOption: any) => {
		const newSorting = selectedOption.value;
		if (newSorting) {
			setSorting(newSorting);
			handleFilterSelect('sorting', newSorting);
		} else {
			getFilterData(urlQuery, activeTab);
		}
	};

	const handlePageChange = (page: number) => {
		if (currentPage === page) return;
		setCurrentPage(page);
		handleFilterSelect('skip', `${page}`);
	};

	const handleClick = () => {
		setModalConfig({
			visible: true,
			id: null,
			type: 'filter',
		});
	};

	const handleFilterSelect = (key: string, value: string) => {
		const previousParams = params.getAll(key);
		if (previousParams) {
			params.delete(key);
			params.append(key, value);
		} else {
			params.append(key, value);
		}
		const temp = params.toString();
		setUrlQuery(temp);
		getFilterData(temp, activeTab);
	};

	const handleRemoveFilter = (filterType: string) => {
		if (filterType === 'countryId') {
			setSelectParamCountry(null);
		} else if (filterType === 'sallary') {
			setSelectParamSalary(null);
		} else if (filterType === 'responseTime') {
			setSelectParamResponseTime(null);
		} else if (filterType === 'categoryId') {
			setSelectParamCategory(null);
		} else if (filterType === 'tagId') {
			setSelectParamTag(null);
		}
		params.delete(filterType);
		const temp = params.toString();
		setUrlQuery(temp);
		getFilterData(temp, activeTab);
	};

	const clearAllFilters = () => {
		setSelectParamCountry(null);
		setSelectParamSalary(null);
		setSelectParamResponseTime(null);
		setSelectParamCategory(null);
		setSelectParamTag(null);
		const temp = user?.id
			? `pagination=true&userId=${user?.id}&skip=1&limit=${limit}&sorting=low_to_high`
			: `pagination=true&skip=1&limit=${limit}&sorting=low_to_high`;

		setUrlQuery(temp);
		getFilterData(temp, activeTab);
	};

	const isAnyFilterSelected =
		selectParamCountry?.countryName ??
		selectParamSalary ??
		selectParamResponseTime ??
		selectParamCategory ??
		selectParamTag;

	return (
		<>
			<div className={`${token ? 'container-fluid' : 'container'}`}>
				<Breadcrumb>
					<Breadcrumb.Item>Home</Breadcrumb.Item>
					<Breadcrumb.Item className="active">{searchValue}</Breadcrumb.Item>
				</Breadcrumb>
			</div>
			<section className="position-relative pb-100">
				<div className={`search-jobs-page ${token ? 'container-fluid' : 'container'}`}>
					<Row>
						<Col lg={3} className="d-none d-lg-block">
							<div className="filter-section">
								<div className="filter-title">
									<h6>Filters</h6>
								</div>
								<div className="all-filters">
									<Location
										handleFilterSelect={handleFilterSelect}
										selectParamCountry={selectParamCountry}
										setSelectParamCountry={setSelectParamCountry}
									/>
									<Salary
										handleFilterSelect={handleFilterSelect}
										selectParamSalary={selectParamSalary}
										setSelectParamSalary={setSelectParamSalary}
									/>
									<Tags
										handleFilterSelect={handleFilterSelect}
										selectParamTag={selectParamTag}
										setSelectParamTag={setSelectParamTag}
									/>
									<Category
										handleFilterSelect={handleFilterSelect}
										selectParamCategory={selectParamCategory}
										setSelectParamCategory={setSelectParamCategory}
									/>
									<ResponseTime
										handleFilterSelect={handleFilterSelect}
										selectParamResponseTime={selectParamResponseTime}
										setSelectParamResponseTime={setSelectParamResponseTime}
									/>
								</div>
							</div>
						</Col>

						<Col lg={9}>
							<div className="d-flex justify-content-between ">
								<h4 className="search-title">
									Search {searchValue ? ` for “${searchValue}”` : ''}
								</h4>
								<div className="d-lg-none d-md-block">
									<span className="filter-icon" onClick={() => handleClick()}>
										<i className="ri-filter-line"></i>
									</span>
								</div>
							</div>
							<h6 className="search-subtitle">
								{activeTab === 'SELLER' ? totalSellerData : totalServicesData}{' '}
								<span>
									{`${searchValue || ''} Jobs${selectParamCountry?.countryName ? ' in ' + selectParamCountry.countryName : ''}`}
								</span>
							</h6>

							<div className="selected-filters d-flex flex-wrap gap-3 mb-30">
								{selectParamCountry?.countryId && (
									<span className="filter-tag d-flex justify-content-between gap-2 align-items-center">
										{selectParamCountry?.countryName}
										<button
											className="bg-transparent border-0 p-0"
											onClick={() => handleRemoveFilter('countryId')}
										>
											<i className="ri-close-fill ms-2"></i>
										</button>
									</span>
								)}
								{selectParamSalary && (
									<span className="filter-tag d-flex justify-content-between gap-2  align-items-center">
										{`$${selectParamSalary.replace(/-/g, ' - $')}`}
										<button
											className="bg-transparent border-0 p-0"
											onClick={() => handleRemoveFilter('sallary')}
										>
											<i className="ri-close-fill ms-2"></i>
										</button>
									</span>
								)}
								{selectParamResponseTime && (
									<span className="filter-tag d-flex justify-content-between gap-2  align-items-center">
										{`${selectParamResponseTime} Hour${selectParamResponseTime > 1 ? 's' : ''}`}
										<button
											className="bg-transparent border-0 p-0"
											onClick={() => handleRemoveFilter('responseTime')}
										>
											<i className="ri-close-fill ms-2"></i>
										</button>
									</span>
								)}
								{selectParamCategory && (
									<span className="filter-tag d-flex justify-content-between gap-2  align-items-center">
										{selectParamCategory}
										<button
											className="bg-transparent border-0 p-0"
											onClick={() => handleRemoveFilter('categoryId')}
										>
											<i className="ri-close-fill ms-2"></i>
										</button>
									</span>
								)}
								{selectParamTag && (
									<span className="filter-tag d-flex justify-content-between gap-2  align-items-center">
										{selectParamTag}
										<button
											className="bg-transparent border-0 p-0"
											onClick={() => handleRemoveFilter('tagId')}
										>
											<i className="ri-close-fill ms-2"></i>
										</button>
									</span>
								)}
								<Button
									className="bg-transparent border-0 p-0 clear-text"
									onClick={() => clearAllFilters()}
									hidden={!isAnyFilterSelected}
								>
									Clear filters
								</Button>
							</div>

							<Tab.Container
								id="left-tabs-example"
								activeKey={activeTab}
								onSelect={(key: any) => handleTabSelect(key)}
							>
								<div className="d-flex justify-content-between align-items-center mb-4 w-100 search-tabs">
									<Nav className="nav-tabs">
										<>
											{user?.type !== 'SELLER' && (
												<>
													<Nav.Item>
														<Nav.Link eventKey="SELLER">By Sellers</Nav.Link>
													</Nav.Item>
													<Nav.Item>
														<Nav.Link eventKey="SERVICES">By Services</Nav.Link>
													</Nav.Item>
												</>
											)}
											{user?.type !== 'BUYER' && (
												<Nav.Item>
													<Nav.Link eventKey="BUYER">Job Posted By Buyers</Nav.Link>
												</Nav.Item>
											)}
										</>
									</Nav>
									<div className="d-flex gap-2 align-items-center">
										<span className="dropdown-text">Sort by:</span>
										<ReactSelect
											options={sortingOptions}
											onChange={handleSortChange}
											value={sortingOptions.find((option) => option.value === sorting)}
											className="form-react-select"
											classNamePrefix="form-react-select"
										/>
									</div>
								</div>
								<Tab.Content>
									<Tab.Pane eventKey="SELLER">
										{!isHomeTopSeller ? (
											<>
												{topSellerData.length > 0 ? (
													<Row>
														{topSellerData?.map((seller: any, index: any) => (
															<Col md={6} key={index} className="mb-30">
																<SellerCard topSellerData={seller} isLoading={isLoading} />
															</Col>
														))}
													</Row>
												) : (
													<NoResultFound />
												)}
											</>
										) : (
											<SellerCardSkeleton limit={limit} />
										)}
									</Tab.Pane>

									<Tab.Pane eventKey="SERVICES">
										{!isServices ? (
											<>
												{serviceData?.length > 0 ? (
													<Row>
														{serviceData?.map((service: any) => (
															<Col md={6} key={service?.id} className="mb-30">
																<ServiceCard
																	serviceData={service}
																	isLoading={isLoading}
																	isHeaderAvatar={true}
																/>
															</Col>
														))}
													</Row>
												) : (
													<NoResultFound />
												)}
											</>
										) : (
											<ServiceCardSkeleton limit={limit} />
										)}
									</Tab.Pane>

									<Tab.Pane eventKey="BUYER">
										{!isServices ? (
											<>
												{serviceData?.length > 0 ? (
													<Row>
														{serviceData?.map((job: any) => (
															<Col md={6} key={job?.id} className="mb-30">
																<JobCard
																	jobData={job}
																	isLoading={isLoading}
																	reRender={reRender}
																	setRerender={setRerender}
																/>
															</Col>
														))}
													</Row>
												) : (
													<NoResultFound />
												)}
											</>
										) : (
											<ServiceCardSkeleton limit={limit} />
										)}
									</Tab.Pane>
								</Tab.Content>
							</Tab.Container>
							<div className="d-flex justify-content-center pt-4">
								<PaginationBox
									totalItems={activeTab === 'SELLER' ? totalSellerData : totalServicesData}
									currentPage={currentPage}
									limit={limit}
									onPageChange={handlePageChange}
								/>
							</div>
						</Col>
					</Row>
				</div>
			</section>
		</>
	);
};

export default Search;
