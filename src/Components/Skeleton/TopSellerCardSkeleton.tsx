import { Placeholder } from 'react-bootstrap';

interface TopSellerCardSkeletonProps {
	limit: number;
}

const TopSellerCardSkeleton: React.FC<TopSellerCardSkeletonProps> = ({ limit }) => {
	return (
		<>
			{[...Array(limit)].map((_, index) => (
				<div className="top-seller-card" key={index}>
					<Placeholder animation="glow">
						<Placeholder className=" mb-2 top-seller-card-img" />
					</Placeholder>
					<Placeholder animation="glow">
						<Placeholder xs={12} className="title mb-2" />
						<Placeholder xs={12} className="rating mb-2" />
						<Placeholder xs={12} className="badges" />
					</Placeholder>
				</div>
			))}
		</>
	);
};

export default TopSellerCardSkeleton;
