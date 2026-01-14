import { Spinner } from 'react-bootstrap';

interface LoaderProps {
	variant?: string;
	style?: {
		[key: string]: string;
	};
}

const Loader: React.FC<LoaderProps> = ({ variant = 'dark', style = {} }) => (
	<Spinner animation="border" variant={variant} style={style} />
);
export default Loader;
