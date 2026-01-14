import { IMAGE_PATH } from 'constants/imagePaths';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useStaticPagesMutation } from 'services';
import './styles.scss';

const AboutUs = () => {
	const navigate = useNavigate();
	const [dataToShow, setDataToShow] = useState<any>();
	const { mutateAsync: staticPagesMutation } = useStaticPagesMutation();

	useEffect(() => {
		staticPagesMutation('3')
			.then((res: any) => {
				if (res?.success) {
					setDataToShow(res?.data);
				}
			})
			.catch(() => {});
	}, []);
	return (
		<Row>
			{dataToShow && (
				<>
					<Col lg={6}>
						<div className="d-flex flex-column gap-4 justify-content-center h-100 mb-4">
							<div className="d-flex flex-column gap-2">
								<h6 className="small-title mb-0">About Us</h6>
							</div>
							<div>
								{!dataToShow ? null : (
									<div className="inner-page-content-box">
										{parse(
											(dataToShow.page.description.length > 570
												? dataToShow.page.description.substring(0, 570) + '...'
												: dataToShow.page.description
											).replace(/\n/g, '<br>'),
										)}
									</div>
								)}
							</div>
							<a className="view-link" onClick={() => navigate('/about-us')}>
								Read More <img src={IMAGE_PATH.viewIcon} alt="" className=" ms-2" />
							</a>
						</div>
					</Col>
					<Col lg={6}>
						<div className="aboutUs-section-video-img">
							<img src={IMAGE_PATH.aboutImg} alt="" />
							<button className="aboutUs-section-play-btn">
								<i className="ri-play-large-fill"></i>
							</button>
						</div>
					</Col>
				</>
			)}
		</Row>
	);
};

export default AboutUs;
