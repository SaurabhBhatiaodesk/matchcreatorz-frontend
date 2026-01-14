import { Accordion } from 'react-bootstrap';
import { useCategoryListQuery } from 'services';
import './styles.scss';

const Category: React.FC<any> = ({
	handleFilterSelect,
	selectParamCategory,
	setSelectParamCategory,
}: any) => {
	const { data: categoryList = [] } = useCategoryListQuery();

	const handleSelect = (category: any) => {
		setSelectParamCategory(category.title);
		handleFilterSelect('categoryId', category?.id);
	};
	return (
		<div className="filter-box">
			<Accordion defaultActiveKey="0">
				<Accordion.Item eventKey="0">
					<Accordion.Header>Category</Accordion.Header>
					<Accordion.Body>
						<div className="d-flex flex-column search-data">
							{categoryList?.category?.map((item: any, index: any) => (
								<div
									key={index}
									className={`title ${selectParamCategory === item.title ? 'active' : ''}`}
									onClick={() => handleSelect(item)}
								>
									{item.title}
								</div>
							))}
						</div>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</div>
	);
};

export default Category;
