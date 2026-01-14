import { IMAGE_PATH } from 'constants/imagePaths';
import { S3_URL } from 'constants/index';
import { useState } from 'react';
import { Container, Dropdown, Form, Nav, Navbar } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactSelect from 'react-select';
import useAuthStore from 'store/auth';
import useChatStore from 'store/chat';
import { setModalConfig } from 'store/common';
import SideMenu from '../Sidemenu';
import './styles.scss';

const Header: React.FC = () => {
	const { user, token }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const navigate = useNavigate();
	const location = useLocation();
	const { pathname } = location;
	const [keyword, setKeyword] = useState<string>('');

	const { newNotificationAlert } = useChatStore((state) => ({
		newNotificationAlert: state.newNotificationAlert,
	}));
	const handleChange = (value: any) => {
		setKeyword(value);
	};

	const handleSelect = (selectedOption: any) => {
		navigate('/search-users', { state: { searchValue: selectedOption } });
	};

	const handleClick = () => {
		setModalConfig({
			visible: true,
			id: null,
			type: 'logout',
		});
	};
	const [show, setShow] = useState(false);
	const handleShow = () => setShow(true);
	const handleClose = () => setShow(false);
	const handleTabChange = (activeTab: string) => {
		navigate('/search-users', { state: { activeTab } });
	};
	return (
		<>
			<Navbar collapseOnSelect expand="lg" className="bg-white header">
				<Container fluid className="p-0 ">
					<Navbar.Brand
						onClick={() => {
							if (token) {
								navigate('/dashboard');
							} else {
								navigate('/');
							}
						}}
					>
						<img src={IMAGE_PATH.logo} alt="" className="w-100 h-100 object-fit-contain" />
					</Navbar.Brand>
					<Navbar className="justify-content-between w-100 p-0">
						<Form className="header-search">
							<i className="ri-search-2-line search"></i>
							<ReactSelect
								isSearchable
								placeholder="Search"
								menuIsOpen={false}
								onInputChange={(value, action) => {
									if (action.action === 'input-change') handleChange(value);
								}}
								inputValue={keyword}
								components={{
									DropdownIndicator: () =>
										keyword ? (
											<i
												className="ri-close-circle-line close"
												onClick={() => {
													setKeyword('');
													if (pathname === '/search-users') {
														handleSelect('');
													}
												}}
												onTouchEnd={() => {
													setKeyword('');
													if (pathname === '/search-users') {
														handleSelect('');
													}
												}}
											></i>
										) : null,
									IndicatorSeparator: () => null,
								}}
								className="form-react-select"
								classNamePrefix="form-react-select"
								autoFocus
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										handleSelect(keyword);
									}
								}}
							/>
						</Form>
						<Nav className="ms-auto">
							{user?.type !== 'SELLER' && (
								<>
									<Nav.Link
										className="active mobile-none"
										onClick={() => handleTabChange('SERVICES')}
									>
										Services
									</Nav.Link>
									<Nav.Link className="mobile-none" onClick={() => handleTabChange('SELLER')}>
										Service Provider
									</Nav.Link>
								</>
							)}
							{user?.type !== 'BUYER' && (
								<Nav.Link className="mobile-none" onClick={() => handleTabChange('BUYER')}>
									Jobs
								</Nav.Link>
							)}

							{user?.type && (
								<Nav.Link onClick={() => navigate('/notifications')} className="notification-icon">
									<i className="ri-notification-4-line"></i>
									{newNotificationAlert && <span className="red-dot"></span>}
								</Nav.Link>
							)}
							<button className="menu-btn" onClick={() => handleShow()}>
								<i className="ri-menu-2-line"></i>
							</button>
							{user?.type && (
								<Dropdown>
									<Dropdown.Toggle
										id="dropdown-basic"
										className="bg-transparent border-0 p-0 text-black d-flex gap-3 align-items-center account-info"
									>
										<img
											src={user?.avatar ? `${S3_URL + user?.avatar}` : IMAGE_PATH.userIcon}
											alt="profile-img"
										/>
										<div className="text-start title d-flex flex-column gap-1">
											Account
											<span className="d-block">{user?.fullName}</span>
										</div>
									</Dropdown.Toggle>
									<Dropdown.Menu className="account-dropdown">
										<Dropdown.Item onClick={() => navigate('/my-account')}>
											<i className="ri-user-6-line"></i> My Account
										</Dropdown.Item>
										<Dropdown.Item onClick={() => handleClick()}>
											<i className="ri-logout-box-line"></i> Logout
										</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							)}
							{!user?.type && (
								<>
									<Nav.Link className="navbar-cta navbar-btns" onClick={() => navigate('/login')}>
										Login
									</Nav.Link>
									<Nav.Link
										className="navbar-secondary-cta navbar-btns"
										onClick={() => navigate('/register')}
									>
										Register
									</Nav.Link>
								</>
							)}
						</Nav>
					</Navbar>
				</Container>
			</Navbar>
			<SideMenu show={show} handleClose={handleClose} />
		</>
	);
};

export default Header;
