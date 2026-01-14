import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from 'store/auth';

const StepRoute = ({ allowedRoles }: any) => {
	const { token: isAuthenticated, user }: Record<string, any> = useAuthStore(
		(state) => state.userInfo ?? {},
	);

	if (!isAuthenticated) {
		return <Navigate to={`/login`} />;
	}

	if (allowedRoles && !allowedRoles.includes(user?.type)) {
		return <Navigate to="/unauthorized" />;
	}

	return <Outlet />;
};

export default StepRoute;
