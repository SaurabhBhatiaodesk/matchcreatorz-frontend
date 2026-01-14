import { BidCardSkeleton, PaginationBox } from 'components';
import NoResultFound from 'components/NoResultFound';
import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ReactSelect from 'react-select';
import { useBidListMutation } from 'services';
import { setModalConfig } from 'store/common';
import { dataLimits, formatRelativeDate } from 'utils';

const MyBids: React.FC = () => {
	const navigate = useNavigate();
	const filtersOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'accepted', label: 'Accepted' },
		{ value: 'rejected', label: 'Rejected' },
		{ value: 'pending', label: 'Pending' },
	];
	const [filter, setFilter] = useState(filtersOptions[0].value);
	const [myBidData, setMyBidData] = useState<any>('');
	const [currentPage, setCurrentPage] = useState(1);
	const { mutateAsync: bidListMutation, isPending: isBidPending } = useBidListMutation();
	const limit = dataLimits?.bidListLimit;
	useEffect(() => {
		getMyBids(currentPage);
	}, [filter]);

	const getMyBids = (page: number) => {
		bidListMutation(`?pagination=true&skip=${page || currentPage}&limit=${limit}&filter=${filter}`)
			.then((res: any) => {
				if (res?.success) {
					setMyBidData(res?.data);
				}
			})
			.catch(() => {});
	};

	const handleSortChange = (selectedOption: any) => {
		const newSorting = selectedOption.value;
		if (newSorting) {
			setFilter(newSorting);
		} else {
			getMyBids(currentPage);
		}
	};

	const handlePageChange = (page: number) => {
		if (currentPage === page) return;
		setCurrentPage(page);
		getMyBids(page);
	};

	const handleClick = (itemId: number) => {
		navigate(`/bid-detail/${itemId}`);
	};

	const handleWithdrawBidClick = (bidData: {
		bidId: number;
		serviceId: number;
		bidAmount: number;
	}) => {
		setModalConfig({
			visible: true,
			id: null,
			type: 'bidWithdraw',
			onClick: getMyBids,
			data: bidData,
		});
	};

	const handleClickAddBid = (bidData: {
		bidId: number;
		serviceId: number;
		connectForBid: number | any;
	}) => {
		setModalConfig({
			visible: true,
			id: null,
			type: 'addBid',
			onClick: getMyBids,
			data: bidData,
		});
	};

	return (
		<>
			<div className="job-booking d-flex flex-column">
				<div className="d-flex justify-content-between align-items-center">
					<h4 className="main-subtitle mb-0">My Bids</h4>
					<div className="d-flex gap-2 align-items-center">
						<span className="dropdown-text">Filter by:</span>
						<div className="d-flex justify-content-between ">
							<ReactSelect
								className="form-react-select"
								classNamePrefix="form-react-select"
								placeholder="All"
								options={filtersOptions}
								value={filtersOptions.find((option) => option.value === filter)}
								onChange={(selectedOption) => handleSortChange(selectedOption)}
							/>
						</div>
					</div>
				</div>
				{!isBidPending ? (
					<>
						{myBidData?.total > 0 ? (
							<Row>
								{myBidData?.records?.map((item: any) => (
									<Col xl={4} lg={6} md={6} key={item?.id} className="mb-30">
										<div className="job-posted" onClick={() => handleClick(item?.id)}>
											<div className="white-box">
												<div className="d-flex gap-3 align-items-center mb-3">
													<h5 className="job-posted-title mb-0">{item?.service?.title}</h5>
													{item?.type === 'Accepted' && (
														<div className="badges">
															<i className="ri-check-line me-1"></i>Accepted
														</div>
													)}
													{item?.type === 'Pending' && (
														<div className="badges yellow">
															<i className="ri-timer-2-line me-1"></i>Pending
														</div>
													)}
													{item?.type === 'Rejected' && (
														<div className="badges red">
															<i className="ri-close-fill"></i> Rejected
														</div>
													)}
												</div>

												<p className="job-posted-description mb-3">
													{item?.service?.description.length > 35 ? (
														<>
															{`${item?.service?.description.slice(0, 35)}`}
															<a className="more-link">...</a>
														</>
													) : (
														item?.service?.description
													)}
												</p>

												<div className="d-flex flex-wrap gap-3 job-posted-details  mb-3">
													<span>
														<i className="ri-map-pin-2-line"></i>
														{item?.service?.country?.countryName?.length > 9 ? (
															<>
																{item?.service?.country?.countryName.slice(0, 9)}
																<a className="more-link">...</a>
															</>
														) : (
															item?.service?.country?.countryName
														)}
													</span>
													<span>
														<i className="ri-calendar-line"></i>
														{formatRelativeDate(item?.service?.created, false)}
													</span>
													<span>
														<i className="ri-money-dollar-circle-line"></i>$
														{item?.service?.minPrice} - ${item?.service?.maxPrice}
													</span>
												</div>
												<div className="d-flex flex-wrap gap-3 job-posted-details  mb-3">
													<span>
														<i className="ri-coin-line"></i>
														{item?.connectUsed}Connects
														<small className="d-block text-center">(Consumed)</small>
													</span>
													<span>
														<i className="ri-auction-line"></i>${item?.bidAmount}
														<small className="d-block text-center">Bid amount</small>
													</span>
												</div>

												<div className="d-flex gap-3 flex-wrap">
													<button
														className={`primary-btn ${
															item?.type === 'WithDrawn' ||
															item?.type !== 'Pending' ||
															item?.service?.status === 'Booked'
																? 'disabled'
																: ''
														}`}
														onClick={(event) => {
															if (item?.type === 'Pending') {
																event.stopPropagation();
																handleWithdrawBidClick({
																	bidId: item?.id,
																	serviceId: item?.service?.id,
																	bidAmount: item?.bidAmount,
																});
															}
														}}
														disabled={
															item?.type === 'WithDrawn' ||
															item?.type !== 'Pending' ||
															item?.service?.status === 'Booked'
																? true
																: false
														}
													>
														Withdraw Bid
													</button>

													<button
														className={`secondary-btn ${
															item?.type !== 'Pending' ||
															item?.service?.status === 'Booked' ||
															item?.remainRebidCount === 0
																? 'disabled'
																: ''
														}`}
														onClick={(event) => {
															if (item?.remainRebidCount > 0) {
																event.stopPropagation();
																handleClickAddBid({
																	serviceId: item?.service?.id,
																	bidId: item?.id,
																	connectForBid: item?.connectForBid,
																});
															}
														}}
														disabled={
															item?.type !== 'Pending' ||
															item?.service?.status === 'Booked' ||
															item?.remainRebidCount === 0
																? true
																: false
														}
													>
														Re-bid
													</button>
												</div>
											</div>
										</div>
									</Col>
								))}
							</Row>
						) : (
							<NoResultFound />
						)}
					</>
				) : (
					<BidCardSkeleton limit={limit} />
				)}
			</div>
			<div className="d-flex justify-content-center pt-4">
				<PaginationBox
					totalItems={myBidData?.total ?? 1}
					currentPage={currentPage}
					limit={limit}
					onPageChange={handlePageChange}
				/>
			</div>
		</>
	);
};

export default MyBids;
