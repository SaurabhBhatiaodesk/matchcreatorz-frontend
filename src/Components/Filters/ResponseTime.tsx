import { Accordion } from 'react-bootstrap';
import { useResponseListQuery } from 'services';
import './styles.scss';

const ResponseTime: React.FC<any> = ({
	handleFilterSelect,
	setSelectParamResponseTime,
	selectParamResponseTime,
}: any) => {
	const { data: responseTimeList = [] } = useResponseListQuery();

	const handleSelect = (responseTime: string) => {
		setSelectParamResponseTime(responseTime);
		handleFilterSelect('responseTime', responseTime);
	};

	return (
		<div className="filter-box">
			<Accordion defaultActiveKey="0">
				<Accordion.Item eventKey="0">
					<Accordion.Header>Response Time</Accordion.Header>
					<Accordion.Body>
						<div className="d-flex flex-column search-data">
							{responseTimeList?.responseTimeData?.map((item: any) => (
								<div
									key={item.time}
									className={`title ${selectParamResponseTime === item.time ? 'active' : ''}`}
									onClick={() => handleSelect(item.time)}
								>
									{`${item.time} Hour${item.time > 1 ? 's' : ''}`}
								</div>
							))}
						</div>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</div>
	);
};

export default ResponseTime;
