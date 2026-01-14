import { IMAGE_PATH } from 'constants/imagePaths';

const NoResultFound: React.FC = () => {
	return (
		<div className="d-flex flex-column gap-3 no-result">
			<img src={IMAGE_PATH.noResultImage} alt="No results found" className="no-result-img w-100" />
			<h2 className="main-subtitle mb-0 text-center">No Results Found</h2>
			<p className="main-description text-center">
				Oops! It seems we couldn’t find any results for your search. Try tweaking your keywords or
				check back later!
			</p>
		</div>
	);
};

export default NoResultFound;
