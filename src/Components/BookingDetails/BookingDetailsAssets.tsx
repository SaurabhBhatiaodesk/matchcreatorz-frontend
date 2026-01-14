import { IMAGE_PATH } from 'constants/imagePaths';
import { S3_URL } from 'constants/index';
import React from 'react';
import { formatRelativeDate } from 'utils';

interface BookingDetailsAssetsProps {
	bookingData: any;
	user: any;
}

const BookingDetailsAssets: React.FC<BookingDetailsAssetsProps> = ({ bookingData, user }) => {
	const handleDownload = async (url: any) => {
		try {
			const response = await fetch(`${S3_URL}${url}`);
			if (!response.ok) {
				throw new Error('Failed to fetch PDF file');
			}
			const blob = await response.blob();
			const downloadUrl = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = downloadUrl;
			link.setAttribute('download', url.split('/').pop());
			link.style.display = 'none';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(downloadUrl);
		} catch (error) {
			console.error('Error downloading PDF:', error);
		}
	};

	return (
		<>
			<div className="white-box">
				<div className="user-information d-flex flex-column">
					{bookingData?.description && (
						<div className="d-flex flex-column gap-3">
							<h6 className="mb-0 user-information-heading">Description</h6>
							<p className="mb-0 main-description">{bookingData?.description}</p>
						</div>
					)}
					{user?.type === 'BUYER' && (
						<div className="d-flex flex-column gap-3">
							<h6 className="mb-0  user-information-heading">Tags Selected</h6>
							<div className="d-flex flex-wrap gap-2">
								{bookingData?.tags.map((item: any, index: any) => (
									<div key={index} className="custom-badges">
										{item?.name}
									</div>
								))}
							</div>
						</div>
					)}
					{bookingData?.price && (
						<div className="d-flex flex-column gap-3">
							<h6 className="mb-0 user-information-heading">
								{user?.type === 'SELLER' ? 'Budget' : 'Price'}
							</h6>
							<p className="mb-0 subtitle">
								<i className="ri-money-dollar-circle-line me-2"></i>${bookingData?.totalAmount}
							</p>
						</div>
					)}
					{bookingData?.created && (
						<div className="d-flex flex-column gap-3">
							<h6 className="mb-0 user-information-heading">Posted Date</h6>
							<p className="mb-0 subtitle">
								<i className="ri-calendar-line me-2"></i>
								{formatRelativeDate(bookingData?.created, false)}
							</p>
						</div>
					)}
				</div>
			</div>
			{bookingData?.documents && (
				<div className="white-box d-flex flex-column gap-3">
					<h4 className="mb-0 sub-heading">Document</h4>

					{bookingData?.documents?.map((doc: any) => (
						<div
							key={doc.id}
							className="d-flex justify-content-between resume-section align-items-center"
						>
							<div className="resume-section-title">
								<i className="ri-attachment-line me-2"></i>
								{doc?.name ? (
									<>
										{(() => {
											const fileName = doc.name.slice(0, doc.name.lastIndexOf('.')); // Get the name without extension
											const extension = doc.name.slice(doc.name.lastIndexOf('.')); // Get the extension

											return fileName.length > 15 ? (
												<span title={doc.name}>
													{fileName.slice(0, 15)}...{extension}
												</span>
											) : (
												doc.name
											);
										})()}
									</>
								) : (
									'Online Marketplace WireFrame Design.pdf'
								)}
							</div>
							<button className="resume-section-btn" onClick={() => handleDownload(doc.url)}>
								<i className="ri-download-2-line me-2"></i> View Document
							</button>
						</div>
					))}
				</div>
			)}
			{bookingData?.images && (
				<div className="white-box d-flex flex-column gap-3">
					<h4 className="mb-0 sub-heading">Images</h4>
					<div className="image-display d-flex  gap-3">
						{bookingData?.images?.map((item: any, index: any) => (
							<img
								key={index}
								src={item?.url ? `${S3_URL}${item?.url}` : IMAGE_PATH.userIcon}
								alt=""
							/>
						))}
					</div>
				</div>
			)}
		</>
	);
};

export default BookingDetailsAssets;
