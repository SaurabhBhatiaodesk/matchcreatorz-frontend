import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface TooltipProps {
	data?: string;
	position?: any;
}
const ToolTip: React.FC<TooltipProps> = ({ data, position }) => {
	const tooltip = <Tooltip id="tooltip">{data}</Tooltip>;

	return (
		<OverlayTrigger placement={position || 'right'} overlay={tooltip}>
			<i className="ri-information-2-line" style={{ color: '#e73232' }}></i>
		</OverlayTrigger>
	);
};
export default ToolTip;
