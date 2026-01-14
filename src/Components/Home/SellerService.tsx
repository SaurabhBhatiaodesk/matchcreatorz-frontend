import { ServiceCard, ServiceCardSkeleton } from 'components';
import { IMAGE_PATH } from 'constants/imagePaths';
import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useServicesMutation } from 'services';
import useAuthStore from 'store/auth';
import { dataLimits } from 'utils';

const SellerService = () => {
	const [serviceData, setServiceData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const { mutateAsync: servicesMutation, isPending: isService } = useServicesMutation({
		userType: 'BUYER',
	});

	const params = {
		pagination: true,
		limit: dataLimits.sellerServiceLimit,
		sorting: 'all',
	};
	useEffect(() => {
		setIsLoading(true);
		if (user?.id) {
			servicesMutation(
				`?pagination=${params.pagination}&limit=${params.limit}&sorting=${params.sorting}&userId=${user?.id}`,
			)
				.then((res) => {
					if (res?.success) {
						setServiceData(res.data.records);
					}
				})
				.finally(() => setIsLoading(false));
		} else {
			servicesMutation(
				`?pagination=${params.pagination}&limit=${params.limit}&sorting=${params.sorting}`,
			)
				.then((res) => {
					if (res?.success) {
						setServiceData(res.data.records);
					}
				})
				.finally(() => setIsLoading(false));
		}
	}, []);

	const handleTabChange = (activeTab: string) => {
		navigate('/search-users', { state: { activeTab } });
	};

	return (
		<>
			{serviceData?.length !== 0 ? (
				<>
					<div className="d-flex justify-content-between section-headings align-items-center mb-30">
						<h4 className="mb-0 main-subtitle">Services by Sellers</h4>
						<a className="view-link" onClick={() => handleTabChange('SERVICES')}>
							View All <img src={IMAGE_PATH.viewIcon} alt="" className=" ms-2" />
						</a>
					</div>
					{!isService ? (
						<Row>
							{serviceData?.map((data: any, index: any) => (
								<Col xl={4} md={6} className="mb-30" key={index}>
									<ServiceCard serviceData={data} isLoading={isLoading} isHeaderAvatar={true} />
								</Col>
							))}
						</Row>
					) : (
						<ServiceCardSkeleton limit={params.limit} />
					)}
				</>
			) : null}
		</>
	);
};

export default SellerService;
