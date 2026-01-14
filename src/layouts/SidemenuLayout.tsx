import { Sidebar } from 'components';
import React from 'react';
import { Outlet } from 'react-router-dom';

const SideMenuLayout: React.FC = () => {
	return (
		<div className="d-flex gap-3">
			<Sidebar />
			<div className="flex-1 container-fluid py-4 overflow-hidden">
				<Outlet />
			</div>
		</div>
	);
};

export default SideMenuLayout;
