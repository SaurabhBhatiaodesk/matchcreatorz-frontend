import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from 'services';
import { resetState, setUserInfo } from 'store/auth';
import useCommonStore from 'store/common';
import './styles.scss';

const Logout: React.FC = () => {
	const { mutateAsync: logoutMutation } = useLogoutMutation();
	const navigate = useNavigate();
	const { hideCommonModal }: any = useCommonStore((state) => state);
	const handleLogout = () => {
		logoutMutation()
			.then((res: any) => {
				if (res?.success) {
					toast.success(res?.message);
					setUserInfo({});
					resetState();
					localStorage.clear();
					sessionStorage.clear();
					navigate('/');
					hideCommonModal();
				}
			})
			.catch(() => {});
	};

	return (
		<Modal.Body>
			<div className="d-flex flex-column logout-modal">
				<div className="logout-modal-circle d-flex align-items-center justify-content-center">
					<i className="ri-logout-circle-line"></i>
				</div>
				<h2 className="logout-modal-title text-center mb-0">Are you sure you want to logout?</h2>
				<div className="d-flex gap-3">
					<button className="primary-btn" onClick={() => hideCommonModal()}>
						Cancel
					</button>
					<button className="secondary-btn" onClick={() => handleLogout()}>
						Logout
					</button>
				</div>
			</div>
		</Modal.Body>
	);
};

export default Logout;
