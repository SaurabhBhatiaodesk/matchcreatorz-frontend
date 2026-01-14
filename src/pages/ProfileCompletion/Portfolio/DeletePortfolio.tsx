import { IMAGE_PATH, S3_URL } from 'constants/index';
import { Dropdown } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { useDeletePortfolioMutation } from 'services';
import useAuthStore, { setUserInfo } from 'store/auth';
import { setModalConfig } from 'store/common';
import { updateAddOrDeleteObject } from 'utils';

interface DeletePortfolioProps {
	id: number;
	image: any;
	title: string;
}

const DeletePortfolio: React.FC<DeletePortfolioProps> = ({ image, title, id }) => {
	const location = useLocation();
	const { user, token }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const { mutateAsync: deletePortfolioMutation } = useDeletePortfolioMutation();

	const handleDelete = (id: any) => {
		deletePortfolioMutation(id)
			.then((res: any) => {
				if (res?.success) {
					const updatedData = updateAddOrDeleteObject(user?.portfolios, null, id);
					setUserInfo({ token: token, user: { ...user, portfolios: updatedData } });
					toast.success(res?.message);
				}
			})
			.catch(() => {});
	};

	const handleEdit = () => {
		setModalConfig({
			visible: true,
			id: null,
			data: { id: id, title: title, image: image },
			type: 'addPortfolio',
		});
	};

	return (
		<div className="portfolio-box-display d-flex flex-column gap-3">
			<img src={image ? `${S3_URL + image}` : IMAGE_PATH.userIcon} alt="" />
			<div className="d-flex justify-content-between">
				<h3 className="mb-0">{title}</h3>
				{location?.pathname === '/my-account' && (
					<Dropdown className="profile-dropdown">
						<Dropdown.Toggle className="bg-transparent border-0 p-0 " id="dropdown-basic">
							<i className="ri-more-2-fill"></i>
						</Dropdown.Toggle>

						<Dropdown.Menu className="profile-dropdown-menu">
							<Dropdown.Item onClick={() => handleEdit()}>
								<i className="ri-pencil-line me-1"></i>Edit
							</Dropdown.Item>
							<Dropdown.Item onClick={() => handleDelete(id)}>
								<i className="ri-delete-bin-7-line me-1"></i>Delete
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				)}
			</div>
		</div>
	);
};

export default DeletePortfolio;
