import parse from 'html-react-parser';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useStaticPagesMutation } from 'services';

export const TermsCondition: React.FC = () => {
	const { mutateAsync: staticPagesMutation } = useStaticPagesMutation();

	const [dataToShow, setDataToShow] = useState<any>();

	useEffect(() => {
		staticPagesMutation('1')
			.then((res: any) => {
				if (res?.success) {
					setDataToShow(res?.data);
				}
			})
			.catch(() => {});
	}, []);

	return (
		<section className="inner-page-static">
			<Container>
				<h2 className="main-heading mb-30">Terms & Condition</h2>
				<div>
					{!dataToShow ? (
						<div className="inner-page-content-box"> </div>
					) : (
						<div className="inner-page-content-box">
							{parse(dataToShow?.page?.description.replace(/\n/g, '<br>'))}
						</div>
					)}
				</div>
			</Container>
		</section>
	);
};

export default TermsCondition;
