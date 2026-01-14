import { IMAGE_PATH } from 'constants/imagePaths';
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { formatDate } from 'utils';

interface BookingDetailsMilestoneProps {
	bookingData: any;
	user: any;
	onAdd: (type: any) => void;
	onDelete: (type: any) => void;
}

const BookingDetailsMilestone: React.FC<BookingDetailsMilestoneProps> = ({
	bookingData,
	user,
	onAdd,
	onDelete,
}) => {
	return (
		<div className="white-box milestones-section d-flex flex-column">
			<div className="d-flex justify-content-between align-items-center mb-30">
				<h4 className="sub-heading ">Milestones</h4>

				{bookingData?.milestones?.length > 0 &&
					user?.type !== 'BUYER' &&
					!['Amidst-Cancellation', 'Cancelled', 'Amidst-Completion-Process', 'In-dispute'].includes(
						bookingData?.status,
					) && (
						<button className="faq-box-add-btn" onClick={() => onAdd('')}>
							+Add
						</button>
					)}
			</div>

			{user?.type === 'SELLER' && bookingData?.milestones?.length === 0 && (
				<div className="d-flex justify-content-center gap-3 flex-column align-items-center">
					<img src={IMAGE_PATH.portfolioImage} alt="" className="w-100 milestones-section-image" />
					<h6 className="milestones-section-title mb-0">What is Lorem Ipsum?</h6>
					<p className="milestones-section-description mb-0 text-center">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
						incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
					</p>
					<button
						className={`secondary-btn p-3 ${bookingData?.status === 'Ongoing' ? '' : 'disabled'}`}
						onClick={() => onAdd('')}
						disabled={bookingData?.status === 'Ongoing' ? false : true}
					>
						+Add Milestone
					</button>
				</div>
			)}

			{bookingData?.milestones?.map((item: any, index: any) => (
				<div className="d-flex gap-3 position-relative milestones-section-border" key={index}>
					<img src={IMAGE_PATH.dotIcon} alt="" className="milestones-section-dot-img" />
					<div className="d-flex flex-column gap-3 w-100">
						<div className="d-flex justify-content-between align-items-center">
							<h6 className="milestones-section-title mb-0">Milestone {item?.id}</h6>
							{user?.type === 'SELLER' && (
								<>
									{bookingData?.status !== 'Amidst-Cancellation' &&
									bookingData?.status !== 'Cancelled' &&
									bookingData?.status !== 'Amidst-Completion-Process' &&
									bookingData?.status !== 'In-dispute' ? (
										<Dropdown className="milestone-dropdown">
											<Dropdown.Toggle className="bg-transparent border-0 p-0 " id="dropdown-basic">
												<i className="ri-more-2-fill"></i>
											</Dropdown.Toggle>

											<Dropdown.Menu className="milestone-dropdown-menu">
												<Dropdown.Item onClick={() => onAdd(item)}>
													<i className="ri-pencil-line me-1"></i>Edit
												</Dropdown.Item>
												<Dropdown.Item onClick={() => onDelete(item?.id)}>
													<i className="ri-delete-bin-7-line me-1"></i>
													Delete
												</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>
									) : null}
								</>
							)}
						</div>
						<span className="milestones-section-subtitle">{item?.title}</span>
						<div className="d-flex gap-4">
							<div className="d-flex gap-2">
								<span className="icon">
									<i className="ri-calendar-2-fill"></i>
								</span>
								<div className="d-flex flex-column gap-1">
									<span className="date-text">Start Date</span>
									<span className="date">{formatDate(item?.startDate)}</span>
								</div>
							</div>
							<div className="d-flex gap-2">
								<span className="icon">
									<i className="ri-calendar-2-fill"></i>
								</span>
								<div className="d-flex flex-column gap-1">
									<span className="date-text">End Date</span>
									<span className="date">{formatDate(item?.endDate)}</span>
								</div>
							</div>
						</div>
						<p className="milestones-section-description mb-0">{item?.description}</p>
					</div>
				</div>
			))}

			{user?.type === 'BUYER' && bookingData?.milestones?.length === 0 && (
				<div className="d-flex justify-content-center gap-3 flex-column align-items-center">
					<img
						src={IMAGE_PATH.milestoneListImage}
						alt=""
						className="w-100 milestones-section-image"
					/>
					<h6 className="milestones-section-title mb-0">
						Milestones to be added from seller's end
					</h6>
				</div>
			)}
		</div>
	);
};

export default BookingDetailsMilestone;
