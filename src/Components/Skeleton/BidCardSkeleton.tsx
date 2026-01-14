import { Col, Placeholder, Row } from 'react-bootstrap';

interface BidCardSkeletonProps {
	limit: number;
}

const BidCardSkeleton: React.FC<BidCardSkeletonProps> = ({ limit }) => {
	return (
		<Row>
			{[...Array(limit)].map((_, index) => (
				<Col xl={4} lg={6} md={6} className="mb-30" key={index}>
					<div className="job-posted mb-5">
						<div className="white-box">
							<Placeholder animation="glow">
								<div className="d-flex gap-3 align-items-center mb-3">
									<Placeholder xs={8} className="job-posted-title mb-0" />
									<Placeholder xs={4} className="badges yellow" />
								</div>
								<Placeholder xs={12} className="job-posted-description mb-3" />
								<div className="d-flex flex-wrap gap-4 job-posted-details  mb-3">
									<Placeholder xs={4} />
									<Placeholder xs={4} />
									<Placeholder xs={4} />
								</div>
								<div className="d-flex flex-wrap gap-4 job-posted-details  mb-3">
									<Placeholder xs={5} />
									<Placeholder xs={5} />
								</div>
								<div className="d-flex gap-2 flex-wrap">
									<Placeholder xs={6} className="primary-btn bg-transparent" />
									<Placeholder
										xs={6}
										className="secondary-btn"
										style={{ backgroundColor: '#e73232' }}
									/>
								</div>
							</Placeholder>
						</div>
					</div>
				</Col>
			))}
		</Row>
	);
};

export default BidCardSkeleton;
