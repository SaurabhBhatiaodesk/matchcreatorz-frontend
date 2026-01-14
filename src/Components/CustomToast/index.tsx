import { IMAGE_PATH } from 'constants/imagePaths';
import React from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getNotificationURL } from 'utils';
import './style.scss';
import useAuthStore from 'store/auth';

interface CustomToastProps {
	t: any;
	payload: any;
}

const CustomToast: React.FC<CustomToastProps> = ({ t, payload }) => {
	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const navigate = useNavigate();
	const { data: { metaData } = {} } = payload || {};
	const { type, serviceId, bidId, bookingId, senderId } = JSON.parse(metaData);

	const onToastClick = async () => {
		const redirectTo = await getNotificationURL(
			navigate,
			type,
			serviceId,
			bidId,
			bookingId,
			senderId,
			user?.type,
		);
		toast.dismiss(t.id);
		if (redirectTo) navigate(redirectTo);
	};

	return (
		<div className="custom-toast" onClick={() => onToastClick()}>
			<div className="flex-1 w-0">
				<div className="flex items-start">
					<div className="d-flex gap-3 align-items-center">
						<img src={IMAGE_PATH.smallLogo} alt="" className="w-100 small-logo" />
						<div className="d-flex flex-column gap-2">
							<p className="title mb-0">{payload?.data?.title}</p>
							<p className="description mb-0">{payload?.data?.body}</p>
						</div>
					</div>
				</div>
			</div>
			<button onClick={() => toast.dismiss(t.id)} className="close-btn bg-transparent p-0 border-0">
				<i className="ri-close-fill"></i>
			</button>
		</div>
	);
};

export default CustomToast;
