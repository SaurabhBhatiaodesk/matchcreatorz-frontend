import React from 'react';
import { useFaqQuery } from 'services';
import FaqStep1 from './FaqStep1';
import FaqStep2 from './FaqStep2';

const Faq: React.FC = () => {
	const { data: faqList = [] } = useFaqQuery();

	return <div>{faqList?.faq?.length > 0 ? <FaqStep2 faqList={faqList} /> : <FaqStep1 />}</div>;
};

export default Faq;
