import { IMAGE_PATH, S3_URL } from 'constants/index';
import { useNavigate } from 'react-router-dom';
import useAuthStore from 'store/auth';
import { setModalConfig } from 'store/common';
import { formatRelativeDate } from 'utils';

interface SearchServiceProps {
	serviceData: any;
	isLoading: boolean;
	isHeaderAvatar: boolean;
}

const ServiceCard: React.FC<SearchServiceProps> = ({ serviceData, isHeaderAvatar }: any) => {
	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});

	const navigate = useNavigate();
	const handleClick = () => {
		if (user?.type === 'SELLER') {
			navigate(`/buyer-job-details/${serviceData?.id}`, { state: { activeTabType: 'BUYER' } });
		} else {
			navigate(`/service-details/${serviceData?.id}`, { state: { activeTabType: 'SELLER' } });
		}
	};

	const handleClickAddBid = (serviceId: string) => {
		setModalConfig({
			visible: true,
			id: serviceId,
			onClick: serviceData,
			type: 'addBid',
		});
	};

	const handleClickBuyBooking = (serviceId: string) => {
		setModalConfig({
			visible: true,
			id: serviceId,
			type: 'buyBooking',
		});
	};
	return (
		<div className="common-card h-100 d-flex flex-column">
			{isHeaderAvatar && (
				<div className="d-flex gap-3 align-items-center">
					<img
						src={
							serviceData?.user?.avatar
								? `${S3_URL + serviceData?.user?.avatar}`
								: IMAGE_PATH.userIcon
						}
						alt="Service Image"
						className="profile-img"
					/>
					<div className="d-flex gap-2 flex-column">
						<span className="name">{serviceData?.user?.fullName}</span>
						<span className="designation">{serviceData?.category?.title}</span>
						{serviceData?.user?.avgRating !== 0 && (
							<span className="rating mb-2">
								<i className="ri-star-s-fill"></i>
								{serviceData?.user?.avgRating}
							</span>
						)}
					</div>
				</div>
			)}
			<div className="d-flex flex-column gap-2">
				<h6 className="job-title mb-0">{serviceData?.title}</h6>
				<div className="d-flex">
					<p className="job-posted-description mb-0">
						{serviceData?.description.length > 40 ? (
							<>
								{`${serviceData?.description.slice(0, 35)}`}
								<a className="more-link ms-1" onClick={() => handleClick()}>
									...
								</a>
							</>
						) : (
							serviceData?.description
						)}
					</p>
				</div>
				{serviceData?.tags?.length > 0 && (
					<div className="d-flex gap-2 flex-wrap align-items-center">
						{serviceData?.tags.slice(0, 2).map((tag: any) => (
							<div className="badges" key={tag.id}>
								{tag.name}
							</div>
						))}

						{serviceData?.tags?.length > 2 && (
							<a className="badges-links">+{serviceData?.tags?.length - 2}</a>
						)}
					</div>
				)}
				<div className="d-flex flex-wrap gap-3 user-job-details">
					<span>
						<i className="ri-map-pin-2-line "></i>
						{serviceData?.country?.countryName?.length > 9 ? (
							<>
								{serviceData?.country?.countryName.slice(0, 9)}
								<a className="more-link">...</a>
							</>
						) : (
							serviceData?.country?.countryName
						)}
					</span>
					<span>
						<i className="ri-calendar-line"></i>
						{formatRelativeDate(serviceData?.created, false)}
					</span>
					{serviceData?.priceRange || serviceData?.price ? (
						<span>
							<i className="ri-money-dollar-circle-line"></i>
							{user?.type === 'SELLER'
								? serviceData?.priceRange?.replace(/^(\d{1,10})\s*-\s*(\d{1,10})$/, '$$$1 - $$$2')
								: `$${serviceData?.price}`}
						</span>
					) : null}

					<div className="user-job-details">
						<span>
							<i className="ri-coin-line"></i>
							{serviceData?.connectForBid} Connects to Bid
						</span>
					</div>
				</div>
			</div>
			<div className="d-flex gap-3 flex-wrap mt-auto">
				<button className="primary-btn" onClick={() => handleClick()}>
					Details
				</button>
				<button
					className={`secondary-btn ${serviceData?.isBided || serviceData?.status === 'Booked' ? 'disabled' : ' '}`}
					disabled={serviceData?.isBided || serviceData?.status === 'Booked' ? true : false}
					onClick={
						user?.type === 'SELLER'
							? () => handleClickAddBid(serviceData?.id)
							: () => handleClickBuyBooking(serviceData?.id)
					}
				>
					{user?.type === 'SELLER' ? 'Bid' : 'Buy'}
				</button>
			</div>
		</div>
	);
};

export default ServiceCard;
