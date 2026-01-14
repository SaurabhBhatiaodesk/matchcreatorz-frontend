import { IMAGE_PATH } from 'constants/imagePaths';
import { LEFT_MENU_BUYER, LEFT_MENU_SELLER, S3_URL } from 'constants/index';
import { Offcanvas } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from 'store/auth';
import { setModalConfig } from 'store/common';
import './style.scss';

const SideMenu: React.FC<any> = ({ show, handleClose }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const { token, user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const SidebarContent = user?.type === 'BUYER' ? LEFT_MENU_BUYER : LEFT_MENU_SELLER;
	const handleClick = (redirectTo: string) => {
		if (!redirectTo) return;
		handleClose();
		navigate(redirectTo);
	};
	const handleClickLogout = () => {
		setModalConfig({
			visible: true,
			id: null,
			type: 'logout',
		});
	};

	const handleTabChange = (activeTab: string) => {
		navigate('/search-users', { state: { activeTab } });
	};
	return (
		<Offcanvas show={show} onHide={handleClose} className="sidebar-menu-mobile">
			<Offcanvas.Body>
				<div className="sidebar-section">
					{token && (
						<>
							<div className="d-flex gap-3 flex-column align-items-center sidebar-section-profile position-relative">
								<img
									src={user?.avatar ? S3_URL + user?.avatar : IMAGE_PATH.dashboardProfile}
									alt=""
									className="w-100"
								/>
								<p>{user?.fullName}</p>
							</div>
							<div
								className="sidebar-section-wallet d-flex justify-content-between"
								onClick={() => {
									handleClose();
									navigate('/wallets');
								}}
							>
								<span>Wallet Amount:</span>
								<span className="fw-bold">${user?.walletAmount?.toFixed(2)}</span>
							</div>
						</>
					)}

					{token && (
						<div className="sidebar-section-tab-listing">
							{user?.type === 'BUYER' ? (
								<>
									<a
										className="d-flex gap-3 items align-items-center"
										onClick={() => {
											handleClose();
											handleTabChange('SERVICES');
										}}
									>
										<i className="ri-service-fill"></i>Services
									</a>
									<a
										className="d-flex gap-3 items align-items-center"
										onClick={() => {
											handleClose();
											handleTabChange('SELLER');
										}}
									>
										<i className="ri-server-fill"></i>Service Provider
									</a>
								</>
							) : user?.type === 'SELLER' ? (
								<a
									className="d-flex gap-3 items align-items-center "
									onClick={() => {
										handleClose();
										handleTabChange('BUYER');
									}}
								>
									<i className="ri-briefcase-fill"></i>Jobs
								</a>
							) : null}

							<a className="divider"></a>
							{token && (
								<>
									{SidebarContent?.map((item: any, index: any) => (
										<a
											key={index}
											className={`d-flex gap-3 items align-items-center ${location?.pathname === item?.redirectTo ? 'active' : ''}`}
											role="button"
											onClick={() => {
												handleClose();
												handleClick(item?.redirectTo);
											}}
										>
											<i className={item?.icon}></i>
											{item?.title}
										</a>
									))}
									<a className="divider"></a>
									<a
										className="d-flex gap-3 items align-items-center"
										onClick={() => {
											handleClose();
											navigate('/my-account');
										}}
									>
										<i className="ri-user-fill"></i>My Account
									</a>
									<a
										className="d-flex gap-3 items align-items-center"
										onClick={() => {
											handleClose();
											handleClickLogout();
										}}
									>
										<i className="ri-logout-box-fill"></i>Logout
									</a>
								</>
							)}
						</div>
					)}
					{!token && (
						<>
							<div className="sidebar-section-tab-listing">
								<a
									className="d-flex gap-3 items align-items-center"
									onClick={() => {
										handleClose();
										handleTabChange('SERVICES');
									}}
								>
									<i className="ri-service-fill"></i>Services
								</a>
								<a
									className="d-flex gap-3 items align-items-center"
									onClick={() => {
										handleClose();
										handleTabChange('SELLER');
									}}
								>
									<i className="ri-server-fill"></i>Service Provider
								</a>
								<a
									className="d-flex gap-3 items align-items-center "
									onClick={() => {
										handleClose();
										handleTabChange('BUYER');
									}}
								>
									<i className="ri-briefcase-fill"></i>Jobs
								</a>
							</div>

							<div className="d-flex gap-3 w-100 fixed-bottom-bar">
								<a
									className="items-btn"
									onClick={() => {
										handleClose();
										navigate('/login');
									}}
								>
									Login
								</a>
								<a
									className="items-btn bg-btn"
									onClick={() => {
										handleClose();
										navigate('/register');
									}}
								>
									Register
								</a>
							</div>
						</>
					)}
				</div>
			</Offcanvas.Body>
		</Offcanvas>
	);
};

export default SideMenu;
