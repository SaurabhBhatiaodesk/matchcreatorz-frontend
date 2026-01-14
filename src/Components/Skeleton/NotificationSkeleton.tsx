import { Placeholder, Row } from 'react-bootstrap';

interface NotificationSkeletonProps {
	limit: number;
}

const NotificationSkeleton: React.FC<NotificationSkeletonProps> = ({ limit }) => {
	return (
		<Row>
			{[...Array(limit)].map((_, index) => (
				<div key={index} className="notification-box-content d-flex ">
					<div className="notification-box-content-icon d-flex align-items-center justify-content-center position-relative">
						<Placeholder />
					</div>
					<div className="d-flex flex-column gap-2 w-100">
						<Placeholder xs={12} className="w-100 notification-box-content-text1" bg="secondary" />
						<Placeholder xs={3} className="notification-box-content-date1" bg="secondary" />
					</div>
				</div>
			))}
		</Row>
	);
};

export default NotificationSkeleton;
