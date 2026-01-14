import { IMAGE_PATH, S3_URL } from 'constants/index';
import { useNavigate } from 'react-router-dom';
import { RWebShare } from 'react-web-share';
import useAuthStore from 'store/auth';
import { setModalConfig } from 'store/common';
import { formatRelativeDate } from 'utils';

const ViewDetails: React.FC<any> = ({ userData, headerTitle, type, getJobData }) => {
	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const currentUrl = window.location.href;
	const navigate = useNavigate();

	const handleDownload = async (documentUrl: any) => {
		if (documentUrl) {
			try {
				const response = await fetch(`${S3_URL}${documentUrl}`);
				if (!response.ok) {
					throw new Error('Failed to fetch the file');
				}
				const blob = await response.blob();
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', documentUrl.split('/').pop());
				link.style.display = 'none';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				window.URL.revokeObjectURL(url);
			} catch (error) {
				console.error('Error downloading the file:', error);
			}
		}
	};

	const handleDeleteService = (id: string) => {
		setModalConfig({
			visible: true,
			id: id,
			type: 'serviceDelete',
			data: 'ServiceDetail',
		});
	};

	const handleJobClosed = (status: string) => {
		setModalConfig({
			visible: true,
			id: userData?.id,
			type: 'jobClosed',
			onClick: getJobData,
			data: { status },
		});
	};

	return (
		<>
			<h4 className="main-subtitle mb-0">
				<span className="back-arrow" onClick={() => navigate(-1)}>
					<i className="ri-arrow-left-line"></i>
				</span>{' '}
				{headerTitle}
			</h4>
			<div className="white-box job-details-content d-flex justify-content-between">
				<div className="d-flex gap-2 flex-column">
					<div className="d-flex gap-2 align-items-center">
						<h2 className="mb-0 job-details-content-title mb-0">{userData?.title}</h2>
						{headerTitle !== 'Service Detail' && (
							<>
								{headerTitle === 'Bid Detail' ? (
									<>
										{type === 'Accepted' && (
											<div className="badges">
												<i className="ri-check-line me-1"></i>Accepted
											</div>
										)}
										{type === 'Pending' && (
											<div className="badges yellow">
												<i className="ri-timer-2-line me-1"></i>Pending
											</div>
										)}
										{type === 'Rejected' && (
											<div className="badges red">
												<i className="ri-close-fill"></i> Rejected
											</div>
										)}
										{type === 'Withdrawn' && (
											<div className="badges red">
												<i className="ri-close-fill"></i> Withdraw
											</div>
										)}
									</>
								) : (
									<>
										{['Booked', 'Open', 'Closed'].includes(userData?.status) && (
											<span className={`badges ${userData?.status === 'Closed' ? 'red' : ''}`}>
												{userData?.status}
											</span>
										)}
									</>
								)}
							</>
						)}
					</div>

					<span className="job-details-content-id">JobID: #{userData?.id}</span>
					<span className="job-details-content-designation">{userData?.category?.title}</span>
					<span className="job-details-content-location">
						<i className="ri-map-pin-2-line me-1"></i>
						{userData?.country?.countryName}
					</span>
				</div>
				<div className="d-flex gap-2 flex-wrap">
					{headerTitle !== 'Bid Detail' && (
						<>
							{headerTitle === 'Job Detail' ? (
								<span className="job-details-content-icons">
									<RWebShare
										data={{
											url: currentUrl,
										}}
									>
										<i className="ri-share-line"></i>
									</RWebShare>
								</span>
							) : null}
							<span
								className={`job-details-content-icons ${userData?.recievedBid > 0 || userData?.status === 'Closed' ? 'disabled' : ''}`}
								onClick={() => {
									if (userData?.recievedBid > 0 || userData?.status === 'Closed') return;
									handleDeleteService(userData?.id);
								}}
							>
								<i className="ri-delete-bin-7-fill"></i>
							</span>

							<span
								className={`job-details-content-icons ${userData?.recievedBid > 0 || userData?.status === 'Closed' ? 'disabled' : ''}`}
								onClick={(event) => {
									if (userData?.recievedBid > 0 || userData?.status === 'Closed') {
										event.stopPropagation();
										return;
									}

									if (headerTitle === 'Job Detail') {
										navigate('/post-job', { state: userData });
									} else {
										navigate('/post-service', { state: userData });
									}
								}}
							>
								<i className="ri-pencil-fill"></i>
							</span>

							{headerTitle === 'Job Detail' ? (
								<div>
									<button
										className={`secondary-btn p-3 ${userData?.status === 'Closed' ? 'disabled' : ''}`}
										disabled={userData?.status === 'Closed'}
										onClick={() => handleJobClosed('CLOSED')}
									>
										<i className="ri-check-fill me-1"></i>Mark as Closed
									</button>
								</div>
							) : null}
						</>
					)}
				</div>
			</div>
			<div className="white-box">
				<div className="user-information d-flex flex-column">
					<div className="d-flex flex-column gap-3">
						<h6 className="mb-0 user-information-heading">Description</h6>
						<p className="mb-0 main-description">{userData?.description}</p>
					</div>
					<div className="d-flex flex-column gap-3">
						<h6 className="mb-0  user-information-heading">Tags </h6>
						<div className="d-flex flex-wrap gap-2">
							{userData?.tags?.map((tag: any) => (
								<div key={tag?.id} className="custom-badges">
									{tag.name}
								</div>
							))}
						</div>
					</div>
					{user?.type === 'BUYER' || userData?.priceRange || userData?.price ? (
						<div className="d-flex flex-column gap-3">
							<h6 className="mb-0  user-information-heading">Budget</h6>
							<p className="mb-0 subtitle">
								<i className="ri-money-dollar-circle-line me-2"></i>$
								{userData?.priceRange || userData?.price}
							</p>
						</div>
					) : null}
					<div className="d-flex flex-column gap-3">
						<h6 className="mb-0 user-information-heading">Posted Date</h6>
						<p className="mb-0 subtitle">
							<i className="ri-calendar-line me-2"></i>
							{formatRelativeDate(userData?.created, false)}
						</p>
					</div>
				</div>
			</div>
			<div className="white-box d-flex flex-column gap-3">
				<h4 className="mb-0 main-subtitle">Document</h4>
				{userData?.documents?.map((document: any) => (
					<div className="resume-section" key={document?.id}>
						<div className="d-flex justify-content-between align-items-center resume-section">
							<div className="resume-section-title">
								<i className="ri-attachment-line me-2"></i>
								{document?.name ? (
									<>
										{(() => {
											const fileName = document.name.slice(0, document.name.lastIndexOf('.')); // Get the name without extension
											const extension = document.name.slice(document.name.lastIndexOf('.')); // Get the extension

											return fileName.length > 15 ? (
												<span title={document.name}>
													{fileName.slice(0, 15)}...{extension}
												</span>
											) : (
												document.name
											);
										})()}
									</>
								) : (
									'Online Marketplace WireFrame Design.pdf'
								)}
							</div>
							<button className="resume-section-btn" onClick={() => handleDownload(document?.url)}>
								<i className="ri-download-2-line me-2"></i> View Document
							</button>
						</div>
					</div>
				))}
			</div>
			<div className="white-box d-flex flex-column gap-3">
				<h4 className="mb-0 main-subtitle">Images</h4>
				<div className="image-display d-flex  gap-3">
					{userData?.images?.map((image: any) => (
						<img
							key={image?.id}
							src={image?.url ? `${S3_URL + image?.url}` : IMAGE_PATH.userprofileImg1}
							alt=""
						/>
					))}
				</div>
			</div>
		</>
	);
};

export default ViewDetails;
