import { S3_URL } from 'constants/index';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { useBannerListMutation } from 'services';
import './styles.scss';

const Banner = () => {
	const [bannerData, setBannerData] = useState([]);
	const { mutateAsync: bannerListMutation } = useBannerListMutation();
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		autoplay: true,
		autoplaySpeed: 5000,
		pauseOnHover: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		className: 'center',
		centerMode: true,
		centerPadding: '18%',
		cssEase: 'linear',
		responsive: [
			{
				breakpoint: 767,
				settings: {
					centerPadding: '10%',
				},
			},
		],
	};

	useEffect(() => {
		bannerListMutation(`?skip=1&limit=10`)
			.then((res) => {
				if (res?.success) {
					setBannerData(res?.data?.totalRecords);
				}
			})
			.catch(() => {});
	}, []);

	return (
		<Slider {...settings}>
			{bannerData?.length > 0 &&
				bannerData.map((imageData: { image: string; id: number }) => (
					<div className="banner-section" key={imageData?.id}>
						<div className="banner-section-images">
							<img src={`${S3_URL}${imageData.image}`} alt="" className="w-100" />
						</div>
					</div>
				))}
		</Slider>
	);
};

export default Banner;
