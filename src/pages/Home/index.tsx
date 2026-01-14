import { AboutUs, Banner, PostedJob, SellerService, Testimonial, TopSeller } from 'components';
import 'components/Home/home.scss';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTestimonialListMutation } from 'services';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import useAuthStore from 'store/auth';

const Home: React.FC = () => {
	const { token }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const navigate = useNavigate();
	const [testimonials, setTestimonials] = useState([]);
	const { mutateAsync: fetchTestimonials } = useTestimonialListMutation();

	useEffect(() => {
		if (token) {
			navigate('/dashboard');
		}
	}, [token, navigate]);

	useEffect(() => {
		const fetchTestimonialData = async () => {
			try {
				const response = await fetchTestimonials(`?skip=1&limit=10`);
				if (response?.success) {
					setTestimonials(response.data?.totalRecords ?? []);
				}
			} catch (error) {
				console.error('Failed to fetch testimonials:', error);
			}
		};
		fetchTestimonialData();
	}, [fetchTestimonials]);

	return (
		<>
			<section className="banner-section position-relative pt-30 pb-3">
				<Banner />
			</section>
			<section className="home-top-seller position-relative p-top">
				<Container>
					<TopSeller />
				</Container>
			</section>
			<section className="aboutUs-section p-top">
				<Container>
					<AboutUs />
				</Container>
			</section>
			<section className="posted-job position-relative p-top pb-70">
				<Container>
					<PostedJob />
				</Container>
			</section>
			{testimonials.length > 0 && (
				<section className="testimonial-section position-relative p-top pb-100">
					<Container>
						<Testimonial data={testimonials} />
					</Container>
				</section>
			)}
			<section className="service-section position-relative p-top pb-70">
				<Container>
					<SellerService />
				</Container>
			</section>
		</>
	);
};
export default Home;
