import { S3_URL } from 'constants/index';
import { isMobileOnly } from 'react-device-detect';
import Slider from 'react-slick';
import './styles.scss';

const Testimonial = ({ data }: { data: any[] }) => {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		autoplay: true,
		autoplaySpeed: 5000,
		pauseOnHover: true,
		slidesToShow: 2,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 991,
				settings: {
					slidesToShow: 1,
				},
			},
		],
	};

	return (
		<>
			<div className="d-flex flex-column gap-2 mb-30">
				<h6 className="small-title mb-0 text-center">Testimonials</h6>
				<h2 className="main-heading mb-0 text-center">What Users Are Saying</h2>
			</div>
			<div className="testimonial-section-slider">
				<Slider {...settings}>
					{data.map((testimonial: any, index: number) => (
						<div className="px-3 h-100" key={index}>
							<div className="testimonial-section-slider-card d-flex gap-4 flex-column mb-30 h-100">
								<div
									className={`d-flex justify-content-between ${isMobileOnly ? 'flex-column' : ''}`}
								>
									<div className="d-flex gap-3 align-items-center">
										<img
											src={`${S3_URL + testimonial.avatar}`}
											alt=""
											className="testimonial-section-slider-card-img"
										/>
										<div className="d-flex flex-column gap-2">
											<span className="name">{testimonial?.name}</span>
											<span className="designation">{testimonial?.designation}</span>
										</div>
									</div>

									<div className="rating d-flex gap-1">
										{[...Array(5)].map((_, starIndex) => (
											<span key={starIndex}>
												<i
													className={`ri-star-${starIndex < testimonial?.totalRating ? 'fill' : 'line'}`}
												></i>
											</span>
										))}
									</div>
								</div>
								<p className="description mb-0">{testimonial?.comment}</p>
							</div>
						</div>
					))}
				</Slider>
			</div>
		</>
	);
};

export default Testimonial;
