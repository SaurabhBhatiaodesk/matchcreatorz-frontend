import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from 'store/auth';

const PublicRoute = ({ restricted }: any) => {
	const location = useLocation();
	const { token: isAuthenticated }: Record<string, any> = useAuthStore(
		(state) => state.userInfo ?? {},
	);

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'instant',
		});
	}, [location?.pathname]);

	if (isAuthenticated && restricted) {
		return <Navigate to="/" />;
	}

	return <Outlet />;
};

export default PublicRoute;
