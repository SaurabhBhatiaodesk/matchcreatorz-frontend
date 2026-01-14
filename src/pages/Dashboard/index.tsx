import { PostedJob, SellerService, StatusCard, TopSeller } from 'components';
import 'components/Home/home.scss';
import { IMAGE_PATH } from 'constants/imagePaths';
import { Container } from 'react-bootstrap';
import { useDashboardQuery } from 'services';
import useAuthStore from 'store/auth';
import './styles.scss';

const Dashboard: React.FC = () => {
	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const { data: dashboardData = [] } = useDashboardQuery();
	const statusData = [
		{
			image: IMAGE_PATH.StatusIcon2,
			title: 'No of Active Jobs',
			subtitle: dashboardData?.activeJobs,
		},
		{
			image: IMAGE_PATH.StatusIcon1,
			title: 'Completed Jobs',
			subtitle: dashboardData?.completedJobs,
		},
		{
			image: IMAGE_PATH.StatusIcon6,
			title: 'Cancelled Jobs',
			subtitle: dashboardData?.cancelledJobs,
		},
		{
			image: IMAGE_PATH.StatusIcon7,
			title: user?.type === 'SELLER' ? 'Posted Services' : 'Posted Jobs',
			subtitle: dashboardData?.postedJobs,
		},
		{
			image: IMAGE_PATH.StatusIcon8,
			title: user?.type === 'SELLER' ? 'Total Earning' : 'No of Bids',
			subtitle:
				user?.type === 'SELLER' ? '$' + dashboardData?.totalEarningAmount : dashboardData?.noOfBids,
		},
		{
			image: IMAGE_PATH.StatusIcon9,
			title: 'Unread Chats',
			subtitle: dashboardData?.unreadChats,
		},
	];

	return (
		<div className="d-flex flex-column dashboard">
			<div className="white-box mb-30">
				<div className=" d-flex flex-wrap  gap-4">
					{statusData.map((statusDataCard, index) => (
						<StatusCard
							key={index}
							image={statusDataCard.image}
							title={statusDataCard.title}
							subtitle={statusDataCard.subtitle}
						/>
					))}
				</div>
			</div>

			{user.type === 'BUYER' ? (
				<>
					<div className="mb-30">
						<TopSeller />
					</div>
					<section className="service-section position-relative pb-70">
						<Container fluid>
							<SellerService />
						</Container>
					</section>
				</>
			) : (
				<section className="service-section position-relative pb-70">
					<Container fluid>
						<PostedJob />
					</Container>
				</section>
			)}
		</div>
	);
};

export default Dashboard;
