import { Col, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { setModalConfig } from 'store/common';
import 'styles/auth.scss';
import DeletePortfolio from './DeletePortfolio';
import PortfolioHeader from './PortfolioHeader';

interface PortfolioStep2Props {
	portfolioList: any;
}

const PortfolioStep2: React.FC<PortfolioStep2Props> = ({ portfolioList }) => {
	const navigate = useNavigate();
	const handleClick = () => {
		if (portfolioList?.length >= 10) {
			toast.error('You have reached the maximum limit of 10 portfolio items.');
		} else {
			setModalConfig({
				visible: true,
				id: null,
				type: 'addPortfolio',
			});
		}
	};

	return (
		<section className="auth-page d-flex justify-content-center align-item-center">
			<div className="auth-page-card step d-flex flex-column">
				<PortfolioHeader />
				<div className="d-flex portfolio-box flex-column">
					<div className="d-flex justify-content-between">
						<h4 className="portfolio-box-heading">Portfolio</h4>
						<button className="portfolio-box-add-btn" onClick={() => handleClick()}>
							+Add
						</button>
					</div>
					<Row className="portfolio-box-listing">
						{portfolioList.map((item: any, index: any) => (
							<Col lg={4} key={index}>
								<DeletePortfolio
									key={index}
									image={item?.image}
									title={item?.title}
									id={item?.id}
								/>
							</Col>
						))}
					</Row>
					<div className="d-flex gap-3">
						<button className=" primary-btn" onClick={() => navigate('/faq')}>
							Back
						</button>
						<button
							className="border-0 secondary-btn"
							onClick={() => {
								toast.success('Your profile has been completed.');
								navigate('/dashboard');
							}}
						>
							Submit
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default PortfolioStep2;
