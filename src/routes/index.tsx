import { ForgotPassword, Login, Register, ResetPassword } from 'components';
import { AuthLayout, ChatLayout, MainLayout, SideMenuLayout } from 'layouts';
import SupportChatLayout from 'layouts/SupportChatLayout';
import {
	AboutUs,
	BidDetails,
	Dashboard,
	Faq,
	FaqPage,
	FavoriteSeller,
	Home,
	JobList,
	MyBids,
	Notifications,
	PageNotFound,
	Portfolio,
	PostJob,
	PrivacyPolicy,
	Profile,
	Search,
	SellerDetails,
	ServiceDetail,
	SupportChats,
	TermsCondition,
	Unauthorized,
	Wallet,
} from 'pages';
import Chat from 'pages/Chat';
import Connect from 'pages/Connects';
import BookingDetails from 'pages/Jobs/BookingDetails';
import JobBooking from 'pages/Jobs/JobBooking';
import JobDetails from 'pages/Jobs/JobDetails';
import MyAccount from 'pages/MyAccount';
import EditOtherDetails from 'pages/MyAccount/EditOtherDetails';
import EditProfile from 'pages/MyAccount/EditProfile';
import PaymentFailed from 'pages/Wallet/PaymentFailed';
import PaymentSuccess from 'pages/Wallet/PaymentSuccess';
import { Route, Routes } from 'react-router-dom';
import useAuthStore from 'store/auth';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import StepRoute from './StepRoute';

const Routing = () => {
	const { token }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	return (
		<Routes>
			<Route element={<PublicRoute restricted={false} />}>
				<Route element={<AuthLayout />}>
					<Route path="register" element={<Register />} />
					<Route path="login" element={<Login />} />
					<Route path="forgot-password" element={<ForgotPassword />} />
					<Route path="reset-password" element={<ResetPassword />} />
				</Route>
				<Route element={<MainLayout />}>
					<Route path="terms-conditions" element={<TermsCondition />} />
					<Route path="privacy-policy" element={<PrivacyPolicy />} />
					<Route path="about-us" element={<AboutUs />} />
					<Route path="faqs" element={<FaqPage />} />
					<Route path="/" element={<Home />} />
					{!token && (
						<>
							<Route path="/search-users" element={<Search />} />
							<Route path="/seller-details/:id" element={<SellerDetails />} />
							<Route path="/service-details/:id" element={<ServiceDetail />} />
							<Route path="/buyer-job-details/:id" element={<ServiceDetail />} />
							<Route path="/buyer-details/:id" element={<SellerDetails />} />
						</>
					)}
					<Route element={<ProtectedRoute />}>
						<Route element={<StepRoute allowedRoles={['SELLER']} />}>
							<Route path="faq" element={<Faq />} />
							<Route path="profile" element={<Profile />} />
							<Route path="portfolio" element={<Portfolio />} />
						</Route>
						<Route element={<SideMenuLayout />}>
							<Route path="/search-users" element={<Search />} />
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/wallets" element={<Wallet />} />
							<Route path="/wallets/success" element={<PaymentSuccess />} />
							<Route path="/wallets/failed" element={<PaymentFailed />} />
							<Route path="/my-account" element={<MyAccount />} />
							<Route path="/edit-profile" element={<EditProfile />} />
							<Route path="/connects" element={<Connect />} />
							<Route path="/seller-details/:id" element={<SellerDetails />} />
							<Route path="/buyer-job-details/:id" element={<ServiceDetail />} />
							<Route path="/buyer-details/:id" element={<SellerDetails />} />
							<Route path="/service-details/:id" element={<ServiceDetail />} />
							<Route path="/edit-other-details" element={<EditOtherDetails />} />
							<Route path="/post-job" element={<PostJob />} />
							<Route path="/job-list" element={<JobList />} />
							<Route path="/job-details/:id" element={<JobDetails />} />
							<Route path="/job-booking" element={<JobBooking />} />
							<Route path="/post-service" element={<PostJob />} />
							<Route path="/my-service-list" element={<JobList />} />
							<Route path="/my-services-detail/:id" element={<JobDetails />} />
							<Route path="/booking-details/:id" element={<BookingDetails />} />
							<Route path="/bid-list" element={<MyBids />} />
							<Route path="/bid-detail/:id" element={<BidDetails />} />
							<Route path="/favourite-seller" element={<FavoriteSeller />} />
							<Route path="notifications" element={<Notifications />} />
						</Route>
					</Route>
				</Route>
				<Route element={<ChatLayout />}>
					<Route element={<ProtectedRoute />}>
						<Route path="/chat-listing" element={<Chat />} />
					</Route>
				</Route>
				<Route element={<SupportChatLayout />}>
					<Route element={<ProtectedRoute />}>
						<Route path="/support" element={<SupportChats />} />
					</Route>
				</Route>
				<Route path="unauthorized" element={<Unauthorized />} />
				<Route path="/mobile-wallets" element={<Wallet />} />
				<Route path="*" element={<PageNotFound />} />
			</Route>
		</Routes>
	);
};

export default Routing;
