import { Header } from 'components';
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const ChatLayout: React.FC = () => {
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
			<div className="container-fluid py-4 overflow-hidden">
				<Outlet />
			</div>
		</>
	);
};

export default ChatLayout;
