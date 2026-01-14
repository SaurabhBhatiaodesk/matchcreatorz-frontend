import { Accordion } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { setModalConfig } from 'store/common';
import 'styles/auth.scss';
import FaqHeader from './FaqHeader';

interface FaqStep2Props {
	faqList: {
		faq: { question: string; answer: string }[];
	};
}

const FaqStep2: React.FC<FaqStep2Props> = ({ faqList }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		if (faqList?.faq?.length >= 10) {
			toast.error('The faq limit is exceeded');
		} else {
			setModalConfig({
				visible: true,
				id: null,
				type: 'addFaq',
			});
		}
	};

	return (
		<section className="auth-page d-flex justify-content-center align-item-center">
			<div className="auth-page-card step d-flex flex-column">
				<FaqHeader />
				<div className="faq-box d-flex flex-column">
					<div className="d-flex justify-content-between">
						<h4 className="faq-box-heading mb-0">FAQ</h4>
						<button className="faq-box-add-btn" onClick={() => handleClick()}>
							+Add
						</button>
					</div>
					<Accordion defaultActiveKey="0" className="faq-accordion">
						{faqList?.faq?.map((item: any, index: any) => (
							<Accordion.Item eventKey={index}>
								<Accordion.Header>{item?.question}</Accordion.Header>
								<Accordion.Body>{item?.answer}</Accordion.Body>
							</Accordion.Item>
						))}
					</Accordion>
				</div>
				<div className="d-flex gap-3 flex-wrap">
					<button className="border-0 transparent-btn" onClick={() => navigate('/portfolio')}>
						Skip
					</button>
					<button className="border-0 transparent-btn" onClick={() => navigate('/profile')}>
						Back
					</button>
					<button className="border-0 secondary-btn" onClick={() => navigate('/portfolio')}>
						Next
					</button>
				</div>
			</div>
		</section>
	);
};

export default FaqStep2;
