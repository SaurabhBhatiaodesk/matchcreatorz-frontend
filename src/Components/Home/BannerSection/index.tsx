import { S3_URL } from 'constants/index';
import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import { useBannerListMutation } from 'services';
import './styles.scss';

const Banner = () => {
	const [bannerData, setBannerData] = useState<any[]>([]);
	const { mutateAsync: bannerListMutation } = useBannerListMutation();

	const sliderRef = useRef<any>(null);

	const hasMultiple = bannerData.length > 1;

	const settings = {
		dots: hasMultiple,
		infinite: hasMultiple,
		autoplay: hasMultiple,

		speed: 600,
		autoplaySpeed: 3500,

		pauseOnHover: false,
		pauseOnFocus: false,
		waitForAnimate: false,

		slidesToShow: hasMultiple ? 2 : 1,
		slidesToScroll: 1,

		centerMode: hasMultiple,
		centerPadding: hasMultiple ? '18%' : '0px',

		cssEase: 'ease-in-out',

		responsive: [
			{
				breakpoint: 767,
				settings: {
					centerPadding: hasMultiple ? '10%' : '0px',
				},
			},
		],
	};

	// 🔥 Fetch banners
	useEffect(() => {
		bannerListMutation(`?skip=1&limit=10`)
			.then((res) => {
				if (res?.success) {
					setBannerData(res?.data?.totalRecords || []);
				}
			})
			.catch(() => {});
	}, []);

	// 🔥 FORCE autoplay after async data load
	useEffect(() => {
		if (hasMultiple && sliderRef.current) {
			sliderRef.current.slickPlay();
		}
	}, [hasMultiple]);

	// ✅ Single banner → NO slider (best UX)
	if (bannerData.length === 1) {
		return (
			<div className="banner-section">
				<div className="banner-section-images">
					<img
						src={`${S3_URL}${bannerData[0].image}`}
						alt=""
						className="w-100"
					/>
				</div>
			</div>
		);
	}

	// ✅ Multiple banners → Slider
	return (
		<Slider ref={sliderRef} {...settings}>
			{bannerData.map((imageData: { image: string; id: number }) => (
				<div className="banner-section" key={imageData.id}>
					<div className="banner-section-images">
						<img
							src={`${S3_URL}${imageData.image}`}
							alt=""
							className="w-100"
						/>
					</div>
				</div>
			))}
		</Slider>
	);
};

export default Banner;
