import { Accordion } from 'react-bootstrap';
import { useTagListQuery } from 'services';
import './styles.scss';

const Tags: React.FC<any> = ({ handleFilterSelect, selectParamTag, setSelectParamTag }: any) => {
	const { data: tagList = [] } = useTagListQuery();

	const handleSelect = (tag: any) => {
		setSelectParamTag(tag.name);
		handleFilterSelect('tagId', tag?.id);
	};
	return (
		<div className="filter-box">
			<Accordion defaultActiveKey="0">
				<Accordion.Item eventKey="0">
					<Accordion.Header>Tags</Accordion.Header>
					<Accordion.Body>
						<div className="d-flex flex-column search-data">
							{tagList?.tag?.map((item: any, index: any) => (
								<div
									key={index}
									className={`title ${selectParamTag === item.name ? 'active' : ''}`}
									onClick={() => handleSelect(item)}
								>
									{item.name}
								</div>
							))}
						</div>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</div>
	);
};

export default Tags;
