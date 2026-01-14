import { FavoriteBtn } from 'components';
import { IMAGE_PATH, S3_URL } from 'constants/index';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchSellerProps {
	topSellerData: any;
}

const SellerCard: React.FC<SearchSellerProps> = ({ topSellerData }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/seller-details/${topSellerData?.id}`, { state: { activeTabType: 'SELLER' } });
	};

	return (
		<div
			className="search-seller-card common-card d-flex gap-3 flex-column position-relative"
			onClick={() => handleClick()}
		>
			<div className="d-flex justify-content-between">
				<div className="d-flex gap-3 align-items-center">
					<img
						src={topSellerData?.avatar ? `${S3_URL + topSellerData?.avatar}` : IMAGE_PATH.userIcon}
						alt=""
						className="profile-img"
					/>
					<div className="d-flex gap-1 flex-column">
						<span className="name">{topSellerData?.fullName}</span>
						<span className="designation">{topSellerData.category?.title}</span>
						{topSellerData?.avgRating !== 0 && (
							<span className="rating mb-2">
								<i className="ri-star-s-fill"></i>
								{topSellerData?.avgRating}
							</span>
						)}
					</div>
				</div>
				<div onClick={(e) => e.stopPropagation()}>
					<FavoriteBtn
						isEnabled={topSellerData?.isFavourite}
						userId={topSellerData?.id}
						isButton={false}
					/>
				</div>
			</div>
			{topSellerData.userTags && (
				<div className="d-flex gap-2 flex-wrap align-items-center">
					{topSellerData?.userTags
						.slice(0, 2)
						.map((userTag: { tag: { id: number; name: string } }, index: number) => (
							<div key={index} className="badges">
								{userTag.tag.name}
							</div>
						))}
					{topSellerData?.userTags?.length > 2 && (
						<a className="badges-links">+{topSellerData?.userTags?.length - 2}</a>
					)}
				</div>
			)}

			<div className="d-flex flex-wrap gap-3 user-job-details">
				{topSellerData?.country?.countryName && (
					<span>
						<i className="ri-map-pin-2-line "></i>
						{topSellerData?.country?.countryName?.length > 9 ? (
							<>
								{topSellerData?.country?.countryName.slice(0, 9)}
								<a className="more-link">...</a>
							</>
						) : (
							topSellerData?.country?.countryName
						)}
					</span>
				)}
				{topSellerData?.priceRange && (
					<span>
						<i className="ri-money-dollar-circle-line"></i>{' '}
						{topSellerData.priceRange.replace(/^(\d{1,10})\s*-\s*(\d{1,10})$/, '$$$1 - $$$2')}
					</span>
				)}
			</div>
		</div>
	);
};

export default SellerCard;
