import { FooterCopyright, Header } from 'components';
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuthStore from 'store/auth';

const AuthLayout: React.FC = () => {
	const { token }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const navigate = useNavigate();

	useEffect(() => {
		if (token) {
			navigate('/dashboard');
		}
	}, []);

	return (
		<>
			<Header />
			<Outlet />
			<FooterCopyright />
		</>
	);
};

export default AuthLayout;
