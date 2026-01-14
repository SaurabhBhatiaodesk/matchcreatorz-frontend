import { Col, Placeholder, Row } from 'react-bootstrap';

interface ServiceCardSkeletonProps {
	limit: number;
}

const ServiceCardSkeleton: React.FC<ServiceCardSkeletonProps> = ({ limit }) => {
	return (
		<Row>
			{[...Array(limit)].map((_, index) => (
				<Col xl={limit === 6 ? 4 : undefined} md={6} className="mb-30">
					<div
						className="skeleton-card common-card d-flex gap-3 flex-column position-relative"
						key={index}
					>
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
							<div className="d-flex flex-column gap-2">
								<Placeholder className="job-title" xs={8} />
								<Placeholder className="job-description" xs={12} />
								<Placeholder xs={6} className="badges" />
								<Placeholder xs={10} className="user-job-details" />
							</div>
						</Placeholder>
						<Placeholder animation="glow">
							<div className="d-flex gap-3 flex-wrap">
								<Placeholder className="primary-btn" xs={6} />
								<Placeholder className="secondary-btn" xs={6} />
							</div>
						</Placeholder>
					</div>
				</Col>
			))}
		</Row>
	);
};

export default ServiceCardSkeleton;
