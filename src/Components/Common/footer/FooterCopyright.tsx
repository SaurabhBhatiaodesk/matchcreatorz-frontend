import { IMAGE_PATH } from 'constants/imagePaths';
import { Container } from 'react-bootstrap';
import './styles.scss';
const FooterCopyright: React.FC = () => {
	return (
		<div className="footer-copyright">
			<Container fluid className="p-0">
				<div className="d-flex justify-content-between align-items-center">
					<p className="mb-0 footer-copyright-text">
						&copy; 2025 MatchCreatorz.com - All rights reserved.
					</p>
					<div className="d-flex gap-2">
						<a role="button" onClick={() => window.open('https://www.facebook.com', '_blank')}>
							<img src={IMAGE_PATH.facebookIcon} alt="" />
						</a>
						<a role="button" onClick={() => window.open('https://in.linkedin.com', '_blank')}>
							<img src={IMAGE_PATH.linkedinIcon} alt="" />
						</a>
					</div>
				</div>
			</Container>
		</div>
	);
};

export default FooterCopyright;
