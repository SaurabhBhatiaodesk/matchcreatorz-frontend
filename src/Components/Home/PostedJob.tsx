import { ServiceCardSkeleton } from 'components/Skeleton';
import { IMAGE_PATH } from 'constants/imagePaths';
import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useServicesMutation } from 'services';
import useAuthStore from 'store/auth';
import { dataLimits } from 'utils';
import JobCard from '../JobCard';

const PostedJob: React.FC<any> = () => {
	const [jobData, setJobData] = useState([]);
	const [reRender, setReRender] = useState<any>(false);
	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const navigate = useNavigate();
	const { mutateAsync: servicesMutation, isPending: isJob } = useServicesMutation({
		userType: 'SELLER',
	});

	const params = {
		pagination: true,
		limit: dataLimits.postedJobLimit,
		sorting: 'all',
	};
	useEffect(() => {
		if (user?.id) {
			servicesMutation(
				`?pagination=${params.pagination}&limit=${params.limit}&sorting=${params.sorting}&userId=${user?.id}`,
			).then((res) => {
				if (res?.success) {
					setJobData(res?.data?.records);
				}
			});
		} else {
			servicesMutation(
				`?pagination=${params.pagination}&limit=${params.limit}&sorting=${params.sorting}`,
			).then((res) => {
				if (res?.success) {
					setJobData(res?.data?.records);
				}
			});
		}
	}, [reRender]);

	return (
		<>
			{jobData?.length !== 0 ? (
				<>
					<div className="d-flex justify-content-between section-headings align-items-center mb-30">
						<h4 className="mb-0 main-subtitle">Jobs Posted by Buyer</h4>
						<a className="view-link" onClick={() => navigate('/search-users')}>
							View All <img src={IMAGE_PATH.viewIcon} alt="" className=" ms-2" />
						</a>
					</div>
					{!isJob ? (
						<Row>
							{jobData.map((item: any, index: any) => (
								<Col xl={4} md={6} className="mb-30" key={index}>
									<JobCard jobData={item} reRender={reRender} setRerender={setReRender} />
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

export default PostedJob;
