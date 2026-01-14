import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAddFavUserMutation, useRemoveFavUserMutation } from 'services';
import useAuthStore from 'store/auth';
import './styles.scss';

interface FavoriteBtnProps {
	isEnabled: boolean;
	userId: string;
	isButton: boolean;
	render?: boolean;
	setRender?: any;
}

const FavoriteBtn: React.FC<FavoriteBtnProps> = ({
	isEnabled,
	userId,
	isButton,
	setRender,
	render,
}) => {
	const navigate = useNavigate();
	const { token }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const { mutateAsync: AddFavUserMutation } = useAddFavUserMutation();
	const { mutateAsync: removeFavUserMutation } = useRemoveFavUserMutation();
	const [isLiked, setIsLiked] = useState(isEnabled);

	const handleClick = () => {
		if (!token || !userId) {
			navigate('/login');
		} else if (isLiked) {
			removeFavUserMutation(userId).then((res: any) => {
				if (res?.success) {
					setTimeout(() => {
						setRender(!render);
					}, 200);
					toast.success(res?.message);
					setIsLiked(false);
				}
			});
		} else {
			AddFavUserMutation(userId).then((res: any) => {
				if (res?.success) {
					toast.success(res?.message);
					setIsLiked(true);
				}
			});
		}
	};

	return (
		<div onClick={() => handleClick()}>
			{!isButton ? (
				<a className="heart-icon hover-shadow">
					<i className={isLiked ? 'ri-heart-fill fill' : 'ri-heart-3-line not-fill'}></i>
				</a>
			) : (
				<button className="profile-content-btn job-details-content-btn two position-relative">
					<a className="heart-icon">
						<i className={isLiked ? 'ri-heart-fill fill' : 'ri-heart-3-line not-fill'}></i>
					</a>
					Add to Favourite
				</button>
			)}
		</div>
	);
};

export default FavoriteBtn;
