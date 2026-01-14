import { Footer, Header } from 'components';
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const MainLayout: React.FC = () => {
	const location = useLocation();

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'instant',
		});
	}, [location?.pathname]);

	return (
		<>
			<Header />
			<Outlet />
			<Footer />
		</>
	);
};

export default MainLayout;
