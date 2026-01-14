import { Placeholder, Row, Col } from 'react-bootstrap';

interface MyServiceSkeletonProps {
	limit: number;
	type: any;
}

const MyServiceSkeleton: React.FC<MyServiceSkeletonProps> = ({ limit, type }) => {
	return (
		<Row>
			{[...Array(limit)].map((_, index) => (
				<Col xl={4} lg={6} md={6} className="mb-30" key={index}>
					<div className="job-posted">
						<div className="white-box">
							<Placeholder animation="glow">
								<Placeholder xs={12} className="job-posted-id" />

								<div className="d-flex justify-content-between align-items-center mb-3 gap-3">
									<Placeholder xs={6} className="job-posted-title" />
									<div className="d-flex gap-2 w-100">
										<Placeholder xs={6} />
										<Placeholder xs={6} />
									</div>
								</div>
								<Placeholder xs={12} className="job-posted-description mb-3" />
								<div className="d-flex gap-2 flex-wrap align-items-center mb-3">
									<Placeholder xs={3} className="job-posted-badges" />
									<Placeholder xs={3} className="job-posted-badges" />
									<Placeholder xs={3} className="job-posted-badges" />
								</div>
								{type === 'job' ? (
									<div className="job-posted-bid-detail d-flex justify-content-between p-0 gap-3">
										<Placeholder xs={5} className="title" />
										<Placeholder xs={5} className="badges" />
									</div>
								) : null}
							</Placeholder>
						</div>
					</div>
				</Col>
			))}
		</Row>
	);
};

export default MyServiceSkeleton;
