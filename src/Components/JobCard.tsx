import { IMAGE_PATH } from 'constants/imagePaths';
import { S3_URL } from 'constants/index';
import { useNavigate } from 'react-router-dom';
import useAuthStore from 'store/auth';
import { setModalConfig } from 'store/common';
import { formatRelativeDate } from 'utils';

interface JobCardProps {
	jobData: any;
	isLoading?: any;
	setRerender: any;
	reRender: any;
}

const JobCard: React.FC<JobCardProps> = ({ jobData, setRerender, reRender }) => {
	const { token }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/buyer-job-details/${jobData?.id}`, {
			state: { activeTabType: 'BUYER' },
		});
	};

	const handleClickBid = (connectForBid: number | any) => {
		if (token) {
			setModalConfig({
				visible: true,
				id: jobData?.id,
				data: { connectForBid },
				onClick: handleSendBid,
				type: 'addBid',
			});
		} else {
			navigate('/login');
		}
	};

	const handleSendBid = () => {
		setRerender(!reRender);
	};
	return (
		<div className="common-card h-100 d-flex flex-column">
			<div className="d-flex gap-3 align-items-center">
				<img
					src={jobData?.user?.avatar ? `${S3_URL + jobData?.user?.avatar}` : IMAGE_PATH.userIcon}
					alt=""
					className="profile-img"
				/>
				<span className="name">{jobData?.user?.fullName}</span>
			</div>
			<div className="d-flex flex-column gap-2">
				<h6 className="job-title mb-0">{jobData?.title}</h6>
				<div className="d-flex gap-1">
					<p className="job-posted-description mb-0">
						{jobData?.description.length > 35 ? (
							<>
								{`${jobData?.description.slice(0, 35)}`}
								<a className="more-link" onClick={() => handleClick()}>
									...
								</a>
							</>
						) : (
							jobData?.description
						)}
					</p>
				</div>
				<div className="d-flex flex-wrap gap-4 user-job-details">
					<span>
						<i className="ri-map-pin-2-line"></i>
						{jobData?.country?.countryName?.length > 9 ? (
							<>
								{jobData?.country?.countryName.slice(0, 9)}
								<a className="more-link">...</a>
							</>
						) : (
							jobData?.country?.countryName
						)}
					</span>
					<span>
						<i className="ri-calendar-line"></i>
						{formatRelativeDate(jobData?.updated, false)}
					</span>

					{jobData?.priceRange && (
						<span>
							<i className="ri-money-dollar-circle-line"></i>
							{jobData?.priceRange.replace(
								/^(\$)?(\d{1,10})\s*-\s*(\$)?(\d{1,10})$/,
								(_: string, min: string, max: string) => `$${min} - $${max}`,
							)}
						</span>
					)}
				</div>
				<div className="user-job-details">
					<span>
						<i className="ri-coin-line"></i>
						{jobData?.connectForBid} Connects to Bid
					</span>
				</div>
			</div>
			<div className="d-flex gap-3 flex-wrap mt-auto">
				<button className="primary-btn" onClick={() => handleClick()}>
					Details
				</button>

				<button
					className={`secondary-btn ${jobData?.isBided || jobData?.status === 'Booked' ? 'disabled' : ''}`}
					disabled={jobData?.isBided || jobData?.status === 'Booked' ? true : false}
					onClick={() => handleClickBid(jobData?.connectForBid)}
				>
					Bid
				</button>
			</div>
		</div>
	);
};

export default JobCard;
