import { IMAGE_PATH } from 'constants/imagePaths';
import { useNavigate } from 'react-router-dom';
import { setModalConfig } from 'store/common';
import 'styles/auth.scss';
import FaqHeader from './FaqHeader';

const FaqStep1: React.FC = () => {
	const navigate = useNavigate();

	const handleClick = () => {
		setModalConfig({
			visible: true,
			id: null,
			type: 'addFaq',
		});
	};

	return (
		<section className="auth-page d-flex justify-content-center align-item-center">
			<div className="auth-page-card step d-flex flex-column">
				<FaqHeader />
				<div className="d-flex flex-column justify-content-center gap-4 text-center step-one-screen">
					<img src={IMAGE_PATH.faqImage} alt="" />
					<div className="d-flex flex-column gap-2">
						<h2>What is Lorem Ipsum?</h2>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
							incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, qui.
						</p>
					</div>
					<div className="d-flex gap-3 justify-content-center">
						<button className="primary-btn" onClick={() => navigate('/portfolio')}>
							Skip
						</button>
						<button className="secondary-btn" onClick={() => handleClick()}>
							+Add FAQ
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default FaqStep1;
