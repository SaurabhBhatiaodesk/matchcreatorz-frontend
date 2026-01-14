import { IMAGE_PATH } from 'constants/imagePaths';
import { S3_URL } from 'constants/index';
import { LEFT_MENU_BUYER, LEFT_MENU_SELLER } from 'constants/sidebarConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from 'store/auth';
import './styles.scss';

const Sidebar: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const SidebarContent = user?.type === 'BUYER' ? LEFT_MENU_BUYER : LEFT_MENU_SELLER;

	const handleClick = (redirectTo: string) => {
		if (!redirectTo) return;
		navigate(redirectTo);
	};
	return (
		<div className="sidebar-section d-none d-lg-block">
			<div className="d-flex gap-3 flex-column align-items-center sidebar-section-profile position-relative">
				<img
					src={user?.avatar ? `${S3_URL + user?.avatar}` : IMAGE_PATH.userIcon}
					alt=""
					className="w-100"
				/>
				<p>{user?.fullName}</p>
			</div>
			<div
				className="sidebar-section-wallet d-flex justify-content-between"
				onClick={() => navigate('/wallets')}
			>
				<span>Wallet Amount:</span>
				<span className="fw-bold">${user?.walletAmount?.toFixed(2)}</span>
			</div>
			{user?.type == 'SELLER' && (
				<div
					className="position-relative sidebar-section-connects"
					onClick={() => navigate('/connects')}
				>
					<img src={IMAGE_PATH.connectImg} alt="" className="w-100" />
					<div className="position-absolute top-50 connects-content">
						<span>Connects</span>
						<h6 className="mb-0">{user?.totalConnects}</h6>
					</div>
				</div>
			)}
			<div className="sidebar-section-tab-listing">
				{SidebarContent?.map((item: any, index: any) => (
					<a
						className={`d-flex gap-3 items align-items-center ${location?.pathname === item?.redirectTo ? 'active' : ''}`}
						role="button"
						key={index}
						onClick={() => handleClick(item?.redirectTo)}
					>
						<i className={item?.icon}></i>
						{item?.title}
					</a>
				))}
			</div>
		</div>
	);
};

export default Sidebar;
