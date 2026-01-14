import './styles.scss';

const StatusCard: React.FC<any> = ({ image, title, subtitle }) => {
	return (
		<div className="status-card d-flex flex-column gap-3">
			<div className="status-card-image">
				<img src={image} alt="" className="w-100" />
			</div>
			<div className="d-flex flex-column gap-2">
				<h4 className="mb-0 status-card-title">{title}</h4>
				<h5 className="mb-0 status-card-subtitle">{subtitle}</h5>
			</div>
		</div>
	);
};

export default StatusCard;
