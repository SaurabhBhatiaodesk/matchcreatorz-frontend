import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface Category {
	title: string;
}
interface Tag {
	tag_name: string;
}

interface ProfileData {
	dob?: string;
	gender?: string;
	priceRange?: string;
	category?: Category;
	tags?: Tag[];
	resumeName?: string;
	responseTime?: number;
}

interface OtherDetailsProps {
	profileData: ProfileData;
}

const OtherDetails: React.FC<OtherDetailsProps> = ({ profileData }) => {
	const navigate = useNavigate();
	return (
		<div className="profile-section-details-content white-box d-flex flex-column">
			<h6 className="mb-0 subheading">Other Details</h6>
			<Row>
				<Col lg={6} className="mb-30">
					<div className="d-flex gap-3">
						<span className="icon d-flex align-items-center justify-content-center">
							<i className="ri-calendar-fill"></i>
						</span>
						<div className="d-flex flex-column gap-1">
							<span className="title">DOB</span>
							<span className="name">{profileData?.dob ?? 'N/A'}</span>
						</div>
					</div>
				</Col>
				<Col lg={6} className="mb-30">
					<div className="d-flex gap-3">
						<span className="icon d-flex align-items-center justify-content-center">
							<i className="ri-men-fill"></i>
						</span>
						<div className="d-flex flex-column gap-1">
							<span className="title">Gender</span>
							<span className="name">{profileData?.gender ?? 'N/A'}</span>
						</div>
					</div>
				</Col>
				<Col lg={6} className="mb-30">
					<div className="d-flex gap-3">
						<span className="icon d-flex align-items-center justify-content-center">
							<i className="ri-money-dollar-circle-fill"></i>
						</span>
						<div className="d-flex flex-column gap-1">
							<span className="title">Price Range</span>
							<span className="name">
								{profileData?.priceRange
									? `${profileData?.priceRange?.replace(/(\d+)\s*-\s*(\d+)/, '$$$1 - $$$2')}`
									: 'N/A'}
							</span>
						</div>
					</div>
				</Col>
				<Col lg={6} className="mb-30">
					<div className="d-flex gap-3">
						<span className="icon d-flex align-items-center justify-content-center">
							<i className="ri-menu-search-fill"></i>
						</span>
						<div className="d-flex flex-column gap-1">
							<span className="title">Category</span>
							<span className="name">{profileData?.category?.title ?? 'N/A'}</span>
						</div>
					</div>
				</Col>
				<Col lg={6} className="mb-30">
					<div className="d-flex gap-3">
						<span className="icon d-flex align-items-center justify-content-center">
							<i className="ri-bookmark-fill"></i>
						</span>
						<div className="d-flex flex-column gap-1">
							<span className="title">Tags</span>
							{profileData?.tags?.map((tag) => tag.tag_name).join(', ') ?? 'No tags available'}
						</div>
					</div>
				</Col>
				<Col lg={6} className="mb-30">
					<div className="d-flex gap-3">
						<span className="icon d-flex align-items-center justify-content-center">
							<i className="ri-earth-fill"></i>
						</span>
						<div className="d-flex flex-column gap-1">
							<span className="title">Resume</span>
							<span className="name">{profileData?.resumeName ?? 'N/A'}</span>
						</div>
					</div>
				</Col>

				<Col lg={6} className="mb-30">
					<div className="d-flex gap-3">
						<span className="icon d-flex align-items-center justify-content-center">
							<i className="ri-rest-time-fill"></i>
						</span>
						<div className="d-flex flex-column gap-1">
							<span className="title">Response Time</span>
							<span className="name">
								{profileData?.responseTime
									? `${profileData.responseTime} Hour${profileData.responseTime > 1 ? 's' : ''}`
									: 'N/A'}
							</span>
						</div>
					</div>
				</Col>

				<Col lg={12}>
					<button
						className="border-0 secondary-btn"
						onClick={() => navigate('/edit-other-details')}
					>
						Edit Profile
					</button>
				</Col>
			</Row>
		</div>
	);
};

export default OtherDetails;
