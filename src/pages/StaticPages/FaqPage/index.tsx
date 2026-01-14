import parse from 'html-react-parser';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useStaticPagesMutation } from 'services';

export const FaqPage: React.FC = () => {
	const [dataToShow, setDataToShow] = useState<any>(undefined);
	const { mutateAsync: staticPagesMutation } = useStaticPagesMutation();

	useEffect(() => {
		staticPagesMutation('6')
			.then((res: any) => {
				if (res?.success) {
					setDataToShow(res?.data);
				}
			})
			.catch(() => { });
	}, []);
	return (
		<section className="inner-page-static">
			<Container>
				<h2 className="main-heading mb-30">FAQ's</h2>
				<div>
					{!dataToShow ? null : (
						<div className="inner-page-content-box">
							{parse(dataToShow?.page?.description.replace(/\n/g, '<br>'))}
						</div>
					)}
				</div>
			</Container>
		</section>
	);
};

export default FaqPage;
