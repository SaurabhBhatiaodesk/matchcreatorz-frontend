import React from 'react';
import { Table } from 'react-bootstrap';
import { useWithdrawRequestQuery } from 'services';
import { formatDateTime } from 'utils';

const WithdrawRequest: React.FC<any> = () => {
	const { data: withdrawList = [] } = useWithdrawRequestQuery();

	return (
		<div className="d-flex gap-3 flex-column">
			{withdrawList?.length > 0 ? (
				<>
					<h6 className="content-title mb-0">Withdraw Requests</h6>
					<div className="table-responsive">
						<Table className="custom-table">
							<thead>
								<tr>
									<th>Amount</th>
									<th>Date & Time</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{withdrawList.map((withdraw: any, index: any) => (
									<tr key={index}>
										<td className="title">Amount: ${withdraw.amount}</td>
										<td className="date">{formatDateTime(withdraw.created, false)}</td>
										<td className="">
											<button
												className={`border-0 d-flex align-items-center gap-2 ${withdraw.status.toLowerCase()}`}
											>
												{withdraw.status === 'Approved' && (
													<>
														<i className="ri-check-line"></i> Approved
													</>
												)}
												{withdraw.status === 'Rejected' && (
													<>
														<i className="ri-close-fill"></i> Rejected
													</>
												)}
												{withdraw.status === 'Pending' && (
													<>
														<i className="ri-timer-2-line"></i> Pending
													</>
												)}
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					</div>
				</>
			) : (
				<div className="no-result">No Withdraw Request Found</div>
			)}
		</div>
	);
};

export default WithdrawRequest;
