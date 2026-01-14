import { PaginationBox } from 'components';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useWithdrawTransactionMutation } from 'services';
import { formatDateTime } from 'utils';

const Transactions: React.FC<any> = () => {
	const limit = 10;
	const { mutateAsync: withdrawTransactionMutation } = useWithdrawTransactionMutation();
	const [transactionList, setTransactionList] = useState<any>([]);
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		withdrawTransactionMutation(`?skip=${currentPage}&limit=${limit}`)
			.then((res: any) => {
				if (res?.success) {
					setTransactionList(res?.data);
				}
			})
			.catch(() => []);
	}, [currentPage]);

	const handlePageChange = (page: number) => {
		if (currentPage === page) return;
		setCurrentPage(page);
	};

	return (
		<div className="d-flex gap-3 flex-column">
			{transactionList?.result?.length > 0 ? (
				<>
					<h6 className="content-title mb-0">Transactions</h6>
					<div className="table-responsive">
						<Table className="custom-table">
							<thead>
								<tr>
									<th>ID</th>
									<th>Date & Time</th>
									<th>Amount</th>
								</tr>
							</thead>
							<tbody>
								{transactionList?.result?.map((transaction: any) => (
									<tr key={transaction?.id}>
										<td className="title">
											{transaction?.bookingId && 'Booking #'}
											{transaction?.bookingId ?? transaction?.payoutType}
										</td>
										<td className="date">{formatDateTime(transaction?.created, false)}</td>
										<td className={`${transaction?.type === 'Debit' ? 'red-text' : 'green-text'}`}>
											<i
												className={`${transaction?.type === 'Debit' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'}`}
											></i>{' '}
											${transaction?.amount?.toFixed(2)}
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					</div>
					{transactionList?.total > limit && (
						<div className="d-flex justify-content-center pt-4">
							<PaginationBox
								totalItems={transactionList?.total ?? 1}
								currentPage={currentPage}
								limit={limit}
								onPageChange={handlePageChange}
							/>
						</div>
					)}
				</>
			) : (
				<div className="no-result">No Transaction Found</div>
			)}
		</div>
	);
};

export default Transactions;
