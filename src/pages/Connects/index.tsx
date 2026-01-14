import { useQueryClient } from '@tanstack/react-query';
import { Tab, Table, Tabs } from 'react-bootstrap';
import toast from 'react-hot-toast';
import {
	useBuyConnectsMutation,
	useConnectListQuery,
	useConnectTransactionsListQuery,
} from 'services';
import useAuthStore, { setUserInfo } from 'store/auth';
import { formatDateTime } from 'utils';
import './styles.scss';

const Connect: React.FC = () => {
	const queryClient = useQueryClient();
	const { data: connectList = [] } = useConnectListQuery();
	const { data: connectTransactionsList = [] } = useConnectTransactionsListQuery();
	const { mutateAsync: buyConnectsMutation } = useBuyConnectsMutation();
	const { user, token }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});

	const handleBuyConnects = (plan: any) => {
		buyConnectsMutation({ connectId: plan?.id })
			.then((res: any) => {
				if (res?.success) {
					toast.success(res?.message);
					queryClient.invalidateQueries({ queryKey: ['connect-transactions'] });
					queryClient.invalidateQueries({ queryKey: ['get-withdraw-transaction'] });
					setUserInfo({
						token: token,
						user: {
							...user,
							walletAmount: user?.walletAmount - plan?.price,
							totalConnects: user?.totalConnects + plan?.connects,
						},
					});
				}
			})
			.catch(() => {});
	};

	return (
		<div className="connect-section d-flex flex-column">
			<h4 className="connect-section-title mb-0">Connects</h4>
			<div className="connect-section-amount d-flex gap-3 align-items-center">
				<div className="connect-icon d-flex justify-content-center align-items-center">
					<i className="ri-send-plane-fill"></i>
				</div>
				<div className="d-flex flex-column gap-2">
					<h5 className="mb-0 title">Current Connects</h5>
					<h6 className="mb-0 amount">$ {user?.totalConnects}</h6>
				</div>
			</div>
			<Tabs defaultActiveKey="connects" className="custom-tabs">
				<Tab eventKey="connects" title="Buy Connects">
					<div className="d-flex gap-3 flex-wrap">
						{connectList?.map((plan: any) => (
							<div key={plan?.id} className="connect-section-amount box d-flex flex-column">
								<div className="connect-icon d-flex justify-content-center align-items-center">
									<i className="ri-send-plane-fill"></i>
								</div>
								<div className="d-flex flex-column gap-2">
									<h5 className="mb-0 title">{plan.connects} Connects</h5>
									<h6 className="mb-0 amount">${plan.price}</h6>
								</div>
								<button className="btn border-0" onClick={() => handleBuyConnects(plan)}>
									Buy Now
								</button>
							</div>
						))}
					</div>
				</Tab>
				<Tab eventKey="transactions" title="Transactions">
					{connectTransactionsList?.connectTransaction?.length > 0 ? (
						<div className="d-flex gap-3 flex-column">
							<h6 className="content-title mb-0">Transactions</h6>
							<div className="table-responsive">
								<Table className="custom-table">
									<thead>
										<tr>
											<th>ID</th>
											<th>Date & Time</th>
											<th>Connects</th>
											<th>Amount</th>
										</tr>
									</thead>
									<tbody>
										{connectTransactionsList?.connectTransaction?.map((item: any) => (
											<tr key={item?.id}>
												<td className="title">{item?.transactionId}</td>
												<td className="date">{formatDateTime(item?.created)}</td>
												<td className="gain">
													<i
														className={`${item?.type === 'Debit' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'}`}
													></i>
													{item?.numberOfConnects}
												</td>
												<td className="">
													{item?.type === 'Credit' ? (
														<>
															<i className="ri-arrow-up-line" /> ${item?.amount}
														</>
													) : (
														<>
															<i className="ri-arrow-down-line" /> ${item?.amount}
														</>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</Table>
							</div>
						</div>
					) : (
						<div className="no-result">No Transactions Found</div>
					)}
				</Tab>
			</Tabs>
		</div>
	);
};

export default Connect;
