import React from 'react';
import { useGetPortfolioListMutation } from 'services';
import PortfolioStep1 from './PortfolioStep1';
import PortfolioStep2 from './PortfolioStep2';
const Portfolio: React.FC = () => {
	const { data: portfolioList = [], isLoading } = useGetPortfolioListMutation();

	return (
		<div>
			{!isLoading && portfolioList?.portfolio?.length > 0 ? (
				<PortfolioStep2 portfolioList={portfolioList?.portfolio} />
			) : (
				<PortfolioStep1 />
			)}
		</div>
	);
};
export default Portfolio;
