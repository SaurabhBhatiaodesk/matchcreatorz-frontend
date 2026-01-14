import { PaginationBox, TopSellerCard } from 'components';
import NoResultFound from 'components/NoResultFound';
import TopSellerCardSkeleton from 'components/Skeleton/TopSellerCardSkeleton';
import { useEffect, useState } from 'react';
import { useFavouriteSellerListMutation } from 'services';
import useAuthStore from 'store/auth';
import { dataLimits } from 'utils';

const FavouriteSeller = () => {
	const { token, user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const [favoriteData, setFavoriteData] = useState<any>('');
	const [currentPage, setCurrentPage] = useState(1);
	const [render, setRender] = useState(false);
	const { mutateAsync: favouriteListMutation, isPending: isFavouritePending } =
		useFavouriteSellerListMutation();

	useEffect(() => {
		handleFavoriteList(currentPage);
	}, [render]);

	const limit = dataLimits?.favouriteUserList;
	const handleFavoriteList = (page: number) => {
		const params = {
			pagination: true,
			skip: page || 1,
			limit: limit,
		};

		if (!token || user.type === 'BUYER') {
			favouriteListMutation(
				`?pagination=${params?.pagination}&skip=${params?.skip}&limit=${params?.limit}`,
			)
				.then((res: any) => {
					if (res?.success) {
						setFavoriteData(res?.data);
					}
				})
				.catch(() => {});
		}
	};

	const handlePageChange = (page: number) => {
		if (currentPage === page) return;
		setCurrentPage(page);
		handleFavoriteList(page);
	};

	return (
		<>
			<h4 className="mb-30 main-subtitle">Favourite Sellers</h4>
			{!isFavouritePending ? (
				<>
					{favoriteData?.records?.length > 0 ? (
						<div className="d-flex flex-wrap gap-4 top-seller">
							{favoriteData?.records?.map((favoriteList: any) => (
								<TopSellerCard
									key={favoriteList?.id}
									userData={favoriteList?.favoriteTo}
									favoriteListStatus={favoriteList?.favoriteTo}
									setRender={setRender}
									render={render}
								/>
							))}
						</div>
					) : (
						<NoResultFound />
					)}
				</>
			) : (
				<div className="d-flex flex-wrap gap-4 top-seller">
					<TopSellerCardSkeleton limit={limit} />
				</div>
			)}
			{favoriteData?.records?.length > 0 && (
				<div className="d-flex justify-content-center pt-4">
					<PaginationBox
						totalItems={favoriteData?.total ?? 1}
						currentPage={currentPage}
						limit={limit}
						onPageChange={handlePageChange}
					/>
				</div>
			)}
		</>
	);
};
export default FavouriteSeller;
