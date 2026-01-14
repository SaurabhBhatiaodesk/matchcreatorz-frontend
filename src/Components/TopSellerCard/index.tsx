import { FavoriteBtn } from 'components';
import { IMAGE_PATH } from 'constants/imagePaths';
import { S3_URL } from 'constants/index';
import { useNavigate } from 'react-router-dom';
import './styles.scss';

interface TopSellerCardProps {
	userData: any;
	favoriteListStatus?: boolean;
	setRender?: any;
	render?: boolean;
}

const TopSellerCard: React.FC<TopSellerCardProps> = ({
	userData,
	favoriteListStatus,
	setRender,
	render,
}) => {
	const navigate = useNavigate();
	const handleClick = () => {
		navigate(`/seller-details/${userData?.id}`, { state: { activeTabType: 'SELLER' } });
	};

	const handleFavoriteStatus = (e: any) => {
		e.stopPropagation();
	};

	return (
		<div className="top-seller-card" onClick={() => handleClick()}>
			<div className="position-relative">
				<img
					src={userData?.avatar ? `${S3_URL + userData?.avatar}` : IMAGE_PATH.userIcon}
					alt=""
					className="top-seller-card-img"
				/>
				<div onClick={(e) => handleFavoriteStatus(e)}>
					<FavoriteBtn
						isEnabled={userData?.isFavourite || favoriteListStatus}
						userId={userData?.id}
						isButton={false}
						setRender={setRender}
						render={render}
					/>
				</div>
			</div>
			<h6 className="mb-2 title">{userData?.fullName}</h6>
			{userData?.avgRating !== 0 && (
				<p className="rating mb-2">
					<i className="ri-star-s-fill"></i>
					{userData?.avgRating}
				</p>
			)}
			{userData?.userTags && (
				<div className="d-flex gap-2 flex-wrap align-items-center">
					{userData?.userTags.slice(0, 2).map((tag: any, index: number) => (
						<div key={index} className="badges">
							{tag?.tag?.name}
						</div>
					))}
					{userData?.userTags.length > 2 && (
						<a className="badges-links">+{userData?.userTags.length - 2}</a>
					)}
				</div>
			)}
		</div>
	);
};

export default TopSellerCard;
