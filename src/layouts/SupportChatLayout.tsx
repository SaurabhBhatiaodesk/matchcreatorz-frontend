import { Header, Sidebar } from 'components';
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const SupportChatLayout: React.FC = () => {
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
			<div className="d-flex gap-3">
				<Sidebar />
				<div className="container-fluid py-4 overflow-hidden">
					<Outlet />
				</div>
			</div>
		</>
	);
};

export default SupportChatLayout;
