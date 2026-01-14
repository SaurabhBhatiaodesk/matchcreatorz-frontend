import { IMAGE_PATH } from 'constants/imagePaths';
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuthStore from 'store/auth';
import FooterCopyright from './FooterCopyright';

const Footer: React.FC = () => {
	const { user, token }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const navigate = useNavigate();

	const handleTabChange = (activeTab: string) => {
		navigate('/search-users', { state: { activeTab } });
	};

	return (
		<>
			<div className="footer">
				<Container fluid className="p-0">
					<Row>
						<Col lg={3}>
							<div className="footer-section1 d-flex flex-column gap-4">
								<div
									onClick={() => {
										if (token) {
											navigate('/dashboard');
										} else {
											navigate('/');
										}
									}}
								>
									<img src={IMAGE_PATH.logo} alt="" className="w-100" />
								</div>
								<p className="mb-0">
									Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
									Ipsum has been the industry's.
								</p>
							</div>
						</Col>
						<Col lg={3}>
							<div className="footer-links">
								<h4 className="footer-links-heading mb-3">Discover</h4>
								<ul className="ps-0">
									<li>
										<a
											onClick={(e) =>
												user.type === 'BUYER'
													? e.preventDefault()
													: (e.stopPropagation(), handleTabChange('BUYER'))
											}
										>
											Browse Job
										</a>
									</li>
									<li>
										<a onClick={() => handleTabChange('SERVICES')}>Services</a>
									</li>
									<li>
										<a onClick={() => handleTabChange('SELLER')}>Service Provider</a>
									</li>
								</ul>
							</div>
						</Col>
						<Col lg={3}>
							<div className="footer-links">
								<h4 className="footer-links-heading mb-3">Company</h4>
								<ul className="ps-0">
									<li>
										<a onClick={() => navigate('/about-us')}>About Us</a>
									</li>
									<li>
										<a onClick={() => navigate('/terms-conditions')}>Terms & Conditions</a>
									</li>
									<li>
										<a onClick={() => navigate('/privacy-policy')}>Privacy Policy</a>
									</li>
								</ul>
							</div>
						</Col>
						<Col lg={3}>
							<div className="footer-links">
								<h4 className="footer-links-heading mb-3">Contact</h4>
								<ul className="ps-0">
									<li>
										<a
											onClick={() => {
												if (!token) return;
												navigate('/support');
											}}
										>
											Contact Us
										</a>
									</li>
									<li>
										<a onClick={() => navigate('/faqs')}>FAQ</a>
									</li>
								</ul>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
			<FooterCopyright />
		</>
	);
};

export default Footer;
