import { ViewDetails } from 'components';
import { IMAGE_PATH } from 'constants/imagePaths';
import { S3_URL } from 'constants/index';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBidInfoMutation } from 'services';
import { setModalConfig } from 'store/common';
import { formatRelativeDate } from 'utils';

const BidDetails: React.FC = () => {
	const { id } = useParams<any>();
	const [bidData, setBidData] = useState<any>();
	const { mutateAsync: getBidInfoMutation } = useBidInfoMutation();

	useEffect(() => {
		getBidInfo();
	}, [id]);

	const getBidInfo = () => {
		getBidInfoMutation(id).then((res: any) => {
			if (res?.success) {
				setBidData(res?.data);
			} else {
				navigate(-1);
			}
		});
	};

	const handleClickBidWithdraw = (bidData: {
		bidId: number;
		serviceId: number;
		bidAmount: number;
	}) => {
		setModalConfig({
			visible: true,
			id: null,
			type: 'bidWithdraw',
			onClick: getBidInfo,
			data: bidData,
		});
	};

	const handleClickAddBid = (bidData: { bidId: number; serviceId: number }) => {
		setModalConfig({
			visible: true,
			id: null,
			type: 'addBid',
			onClick: getBidInfo,
			data: bidData,
		});
	};

	const navigate = useNavigate();
	const handleClick = () => {
		navigate(`/buyer-details/${bidData?.service?.userId}`, { state: { activeTabType: 'BUYER' } });
	};

	return (
		<section className="job-details d-flex flex-column">
			<ViewDetails userData={bidData?.service} headerTitle="Bid Detail" type={bidData?.type} />
			<div className="white-box d-flex flex-column gap-3 user-information">
				<h6 className="user-information-heading mb-0">Buyer Details</h6>
				<div
					className="d-flex gap-3 align-items-center"
					style={{ cursor: 'pointer' }}
					onClick={() => handleClick()}
				>
					<img
						src={
							bidData?.service?.user?.avatar
								? `${S3_URL + bidData?.service?.user?.avatar}`
								: IMAGE_PATH.userIcon
						}
						alt=""
						className="bid-profile"
					/>
					<div className="d-flex flex-column gap-2">
						<span className="job-details-content-name">{bidData?.service?.user?.fullName}</span>
						<span className="job-details-content-location">
							<i className="ri-map-pin-2-line me-1"></i>
							{bidData?.service?.user?.state?.stateName},
							{bidData?.service?.user?.country?.countryName}
						</span>
					</div>
				</div>
			</div>
			<div className="white-box d-flex flex-column gap-3 ">
				<h6 className="user-information-heading mb-0">Bid Details</h6>
				<div
					key={bidData}
					className="d-flex justify-content-between w-100 align-items-center bid-details"
				>
					<div className="title d-flex gap-2 flex-column">
						Total Used Connects
						<span className="d-block">{bidData?.connectUsed || 'Withdraw Amount'}</span>
					</div>
					<div className="date">{formatRelativeDate(bidData?.service?.created, false)}</div>
					<div className="price">${bidData?.bidAmount?.toFixed(2)}</div>

					<div className="d-flex gap-2">
						<button
							className={`btn ${bidData?.type === 'WithDrawn' || bidData?.type !== 'Pending' || bidData?.service?.status === 'Booked' ? 'disabled' : ''}`}
							onClick={(event) => {
								if (bidData?.type === 'Pending') {
									event.stopPropagation();
									handleClickBidWithdraw({
										bidId: bidData?.id,
										serviceId: bidData?.service?.id,
										bidAmount: bidData?.bidAmount,
									});
								}
							}}
							disabled={
								bidData?.type === 'WithDrawn' ||
								bidData?.service?.status === 'Booked' ||
								bidData?.type !== 'Pending'
							}
						>
							Withdraw Bid
						</button>

						<button
							className={`btn red-bg ${bidData?.type !== 'Pending' || bidData?.service?.status === 'Booked' || bidData?.remainRebidCount > 0 ? '' : 'disabled'}`}
							onClick={(event) => {
								if (bidData?.remainRebidCount > 0) {
									event.stopPropagation();
									handleClickAddBid({
										serviceId: bidData?.service?.id,
										bidId: bidData?.id,
									});
								}
							}}
							disabled={
								bidData?.type !== 'Pending' ||
								bidData?.service?.status === 'Booked' ||
								bidData?.remainRebidCount <= 0
							}
						>
							Re-bid
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default BidDetails;
