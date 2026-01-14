import { Button, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuthStore from 'store/auth';

const Unauthorized = () => {
	const navigate = useNavigate();
	const { token }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});

	const handleLoginRedirect = (path: string) => {
		navigate(path);
	};

	return (
		<Container
			className="d-flex flex-column align-items-center justify-content-center"
			style={{ height: '100vh' }}
		>
			<Row className="text-center">
				<Col>
					<h1>403 - Access Denied</h1>
					<p>
						Sorry, you don't have permission to access this page. If you believe this is a mistake,
						please contact support.
					</p>
					{token ? (
						<Button variant="primary" onClick={() => handleLoginRedirect('/')}>
							Go to Home
						</Button>
					) : (
						<Button variant="primary" onClick={() => handleLoginRedirect('/login')}>
							Login to Continue
						</Button>
					)}
				</Col>
			</Row>
		</Container>
	);
};

export default Unauthorized;
