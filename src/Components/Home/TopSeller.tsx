import { TopSellerCard } from 'components';
import TopSellerCardSkeleton from 'components/Skeleton/TopSellerCardSkeleton';
import { IMAGE_PATH } from 'constants/imagePaths';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHomeTopSellerListMutation } from 'services';
import useAuthStore from 'store/auth';
import { dataLimits } from 'utils';
import '../../common.scss';

const TopSeller = () => {
	const [topSellerData, setTopSellerData] = useState([]);
	const { user, token }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const { mutateAsync: homeTopSellerListMutation, isPending: isTopSeller } =
		useHomeTopSellerListMutation();
	const navigate = useNavigate();
	useEffect(() => {
		const params = {
			pagination: true,
			limit: dataLimits.topSellerLimit,
		};

		if (!token) {
			homeTopSellerListMutation(`?pagination=${params.pagination}&limit=${params.limit}`).then(
				(res: any) => {
					if (res?.success) {
						setTopSellerData(res.data.result);
					}
				},
			);
		} else {
			homeTopSellerListMutation(
				`?pagination=${params.pagination}&limit=${params.limit}&userId=${user?.id}`,
			).then((res: any) => {
				if (res?.success) {
					setTopSellerData(res.data.result);
				}
			});
		}
	}, []);

	return (
		<>
			{topSellerData?.length !== 0 ? (
				<>
					<div className="d-flex justify-content-between section-headings align-items-center mb-30">
						<h4 className="mb-0 main-subtitle">Top Seller</h4>
						<a className="view-link" onClick={() => navigate('/search-users')}>
							View All <img src={IMAGE_PATH.viewIcon} alt="View Icon" className="ms-2" />
						</a>
					</div>
					<div className="d-flex flex-wrap gap-4 top-seller">
						{!isTopSeller ? (
							<>
								{topSellerData.map((seller: any, index: any) => (
									<TopSellerCard key={index} userData={seller} />
								))}
							</>
						) : (
							<>
								<TopSellerCardSkeleton limit={dataLimits.topSellerLimit} />
							</>
						)}
					</div>
				</>
			) : null}
		</>
	);
};

export default TopSeller;
