import { Col, Placeholder, Row } from 'react-bootstrap';

interface SellerCardSkeletonProps {
	limit: number;
}

const SellerCardSkeleton: React.FC<SellerCardSkeletonProps> = ({ limit }) => {
	return (
		<Row>
			{[...Array(limit)].map((_, index) => (
				<Col md={6} className="mb-30" key={index}>
					<div className="skeleton-card common-card d-flex gap-3 flex-column position-relative">
						<Placeholder animation="glow">
							<div className="d-flex justify-content-between w-100 gap-3">
								<Placeholder className="profile-img" style={{ width: '20%' }} />
								<div className="d-flex gap-1 flex-column" style={{ width: '70%' }}>
									<Placeholder className="name" xs={8} />
									<Placeholder className="designation" xs={4} />
									<Placeholder className="rating" xs={3} />
								</div>
							</div>
						</Placeholder>
						<Placeholder animation="glow">
							<Placeholder xs={8} className="badges" />
							<Placeholder xs={6} className="user-job-details" />
						</Placeholder>
					</div>
				</Col>
			))}
		</Row>
	);
};

export default SellerCardSkeleton;
