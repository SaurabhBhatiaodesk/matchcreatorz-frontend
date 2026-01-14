import React from 'react';
import { Pagination } from 'react-bootstrap';
import './style.scss';

interface PaginationProps {
	totalItems: number;
	currentPage: number;
	limit: number;
	onPageChange: (page: number) => void;
}

const PaginationBox: React.FC<PaginationProps> = ({
	totalItems,
	currentPage,
	limit,
	onPageChange,
}) => {
	const totalPages = Math.ceil(totalItems / limit);

	const getPageNumbers = () => {
		const items = [];
		let startPage: number, endPage: number;

		if (totalPages <= 4) {
			startPage = 1;
			endPage = totalPages;
		} else {
			if (currentPage < 3) {
				startPage = 1;
				endPage = 3;
			} else if (currentPage > totalPages - 2) {
				startPage = totalPages - 2;
				endPage = totalPages;
			} else {
				startPage = currentPage - 1;
				endPage = currentPage + 1;
			}
		}
		if (startPage > 1) {
			items.push(
				<Pagination.Item key={1} onClick={() => handlePageChange(1)}>
					1
				</Pagination.Item>,
			);
			if (startPage > 2) {
				items.push(<Pagination.Ellipsis key="ellipsis-start" />);
			}
		}
		for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
			items.push(
				<Pagination.Item
					key={pageNum}
					active={pageNum === currentPage}
					onClick={() => handlePageChange(pageNum)}
				>
					{pageNum}
				</Pagination.Item>,
			);
		}
		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				items.push(<Pagination.Ellipsis key="ellipsis-end" />);
			}
			items.push(
				<Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
					{totalPages}
				</Pagination.Item>,
			);
		}

		return items;
	};

	const handlePageChange = (page: any) => {
		onPageChange(page);
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	return (
		<>
			{totalItems > 0 ? (
				<Pagination>
					<Pagination.Prev
						onClick={() => handlePageChange(currentPage - 1)}
						className="page-back"
						disabled={currentPage === 1}
						aria-label="Previous Page"
					>
						<i className="ri-arrow-left-s-line"></i> Back
					</Pagination.Prev>
					{getPageNumbers()}
					<Pagination.Next
						onClick={() => handlePageChange(currentPage + 1)}
						className="page-next"
						disabled={currentPage === totalPages}
						aria-label="Next Page"
					>
						Next <i className="ri-arrow-right-s-line"></i>
					</Pagination.Next>
				</Pagination>
			) : null}
		</>
	);
};

export default PaginationBox;
