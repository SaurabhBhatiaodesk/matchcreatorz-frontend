import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.css';
import { CommonModal, MobileModal } from 'components';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/breadcrumb.scss';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<BrowserRouter basename={import.meta.env.VITE_APP_BASE_URL}>
		<QueryClientProvider client={queryClient}>
			<App />
			<CommonModal />
			<MobileModal />
		</QueryClientProvider>
	</BrowserRouter>,
);
