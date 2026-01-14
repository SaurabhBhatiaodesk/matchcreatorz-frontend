import { Footer, Header } from 'components';
import { IMAGE_PATH } from 'constants/imagePaths';
import React from 'react';

const PageNotFound: React.FC = () => {
	return (
		<>
			<Header />
			<section className="auth-page d-flex justify-content-center align-item-center">
				<div className="auth-page-card step d-flex flex-column gap-3">
					<img src={IMAGE_PATH.errorImage} alt="Error illustration" className="auth-data-img" />
					<h2 className="auth-page-main-title mb-0">Oops! Page Not Found</h2>
					<p className="auth-page-text text-center">
						The page you are looking for might have been removed, had its name changed, or is
						temporarily unavailable. Please check the URL or go back to the homepage.
					</p>
				</div>
			</section>
			<Footer />
		</>
	);
};

export default PageNotFound;
