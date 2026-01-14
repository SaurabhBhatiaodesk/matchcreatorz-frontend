import React from 'react';

const PortfolioHeader: React.FC = () => {
	return (
		<>
			<h2 className="auth-page-main-title mb-0">Profile Completion</h2>
			<div className="step-buttons d-flex justify-content-between ">
				<button className="step-buttons-cta active d-flex flex-column align-items-center gap-2 border-0">
					1<span>Profile</span>
				</button>
				<button className="step-buttons-cta active d-flex flex-column align-items-center gap-2 border-0">
					2<span>FAQ’s</span>
				</button>
				<button className="step-buttons-cta active d-flex flex-column align-items-center gap-2 border-0">
					3<span>Portfolio</span>
				</button>
			</div>
		</>
	);
};

export default PortfolioHeader;
