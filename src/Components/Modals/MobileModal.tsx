import FilterModal from 'pages/Search/FilterModal';
import { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import useCommonStore from 'store/common';
import './styles.scss';

const MobileModal = () => {
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const location = useLocation();
	const modalBodyContent: any = {
		filter: <FilterModal />,
	};

	useEffect(() => {
		if (modalConfig?.visible) {
			hideCommonModal();
		}
	}, [location?.pathname]);

	return (
		<>
			{modalConfig?.type === 'filter' && (
				<Modal
					className=""
					show={modalConfig?.visible}
					backdrop="static"
					centered
					dialogClassName="mobile-modal-dialog"
				>
					{modalBodyContent[modalConfig?.type]}
				</Modal>
			)}
		</>
	);
};

export default MobileModal;
