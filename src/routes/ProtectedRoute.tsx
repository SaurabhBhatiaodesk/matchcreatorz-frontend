import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from 'store/auth';

const ProtectedRoute = () => {
	const { token: isAuthenticated }: Record<string, any> = useAuthStore(
		(state) => state.userInfo ?? {},
	);

	if (!isAuthenticated) {
		return <Navigate to={`/login`} />;
	}

	return <Outlet />;
};

export default ProtectedRoute;
