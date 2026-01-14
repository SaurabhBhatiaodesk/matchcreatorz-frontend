import { IMAGE_PATH } from 'constants/imagePaths';
import { setModalConfig } from 'store/common';
import 'styles/auth.scss';
import PortfolioHeader from './PortfolioHeader';

const PortfolioStep1: React.FC = () => {
	const handleClick = () => {
		setModalConfig({
			visible: true,
			id: null,
			type: 'addPortfolio',
		});
	};

	return (
		<section className="auth-page d-flex justify-content-center align-item-center">
			<div className="auth-page-card step d-flex flex-column">
				<PortfolioHeader />
				<div className="d-flex flex-column justify-content-center gap-4 text-center step-one-screen">
					<img src={IMAGE_PATH.portfolioImage} alt="" />
					<div className="d-flex flex-column gap-2">
						<h2>What is Lorem Ipsum?</h2>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
							incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, qui.
						</p>
					</div>
					<div className="d-flex justify-content-center">
						<button className="secondary-btn" onClick={() => handleClick()}>
							+Add Portfolio
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default PortfolioStep1;
