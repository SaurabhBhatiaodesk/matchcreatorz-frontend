import { Category, Location, ResponseTime, Salary, Tags } from 'components';
import { Modal } from 'react-bootstrap';
import useCommonStore from 'store/common';

const FilterModal: React.FC = () => {
	const { hideCommonModal }: any = useCommonStore((state) => state);
	return (
		<>
			<button className="bg-transparent border-0 p-0 close-btn" onClick={() => hideCommonModal()}>
				<i className="ri-close-fill"></i>
			</button>
			<Modal.Body>
				<div className="filter-section">
					<div className="filter-title">
						<h6>Filters</h6>
					</div>
					<div className="all-filters d-flex flex-column gap-4">
						<Location />
						<Salary />
						<Tags />
						<Category />
						<ResponseTime />
					</div>
				</div>
			</Modal.Body>
		</>
	);
};

export default FilterModal;
