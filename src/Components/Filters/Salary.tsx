import React from 'react';
import { Accordion } from 'react-bootstrap';
import { useProfileListQuery } from 'services';
import './styles.scss';

const Salary: React.FC<any> = ({
	handleFilterSelect,
	setSelectParamSalary,
	selectParamSalary,
}: any) => {
	const { data: priceRangeList = [] } = useProfileListQuery();

	const handleSelect = (salary: string) => {
		setSelectParamSalary(salary);
		handleFilterSelect('sallary', salary);
	};

	return (
		<div className="filter-box">
			<Accordion defaultActiveKey="0">
				<Accordion.Item eventKey="0">
					<Accordion.Header>Price</Accordion.Header>
					<Accordion.Body>
						<div className="d-flex flex-column search-data">
							{priceRangeList?.priceRangeData?.map((item: any) => (
								<div
									key={item.id}
									className={`title ${
										selectParamSalary === `${item?.min}-${item?.max}` ? 'active' : ''
									}`}
									onClick={() => handleSelect(`${item?.min}-${item?.max}`)}
								>
									${item?.min}-${item?.max}
								</div>
							))}
						</div>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</div>
	);
};

export default Salary;
