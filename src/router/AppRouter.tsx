import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/presentation/login.pages.tsx";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "./Unauthorized";
import MainContainer from "../container/main.container";
import UsersList from "../features/users/getAllUser";
import DisputesList from "../features/disputes/getAllDisputes";
const DisputeDetail = React.lazy(() => import("../features/disputes/getDetailDispute"));
import BookingsList from "../features/bookings/getAllBookings";
import PropertiesList from "../features/properties/getAllProperties";
const BookingDetail = React.lazy(() => import("../features/bookings/getDetailBooking"));
const UserDetail = React.lazy(() => import("../features/users/getDetailUser"));
import PayoutsList from "../features/payouts/getAllPayouts";
import WalletView from "../features/payouts/getWallet";

const Profile: React.FC = () => {
	const userName = typeof window !== "undefined" ? localStorage.getItem("userName") : null;
	return (
		<div>
			<h2 className="text-2xl font-semibold">Profile</h2>
			<p className="mt-2 text-gray-600">{userName || 'Admin'}</p>
		</div>
	);
};

// PropertiesList (admin) is rendered from features/properties/getAllProperties

// UsersList component will render the users table

// (Home placeholder removed — root now redirects to /users)

const AppRouter: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/unauthorized" element={<Unauthorized />} />
				<Route
					path="/"
					element={
						<ProtectedRoute requiredRole="ADMIN">
							{/* Redirect root to /users */}
							<Navigate to="/users" replace />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/bookings"
					element={
						<ProtectedRoute requiredRole="ADMIN">
							<MainContainer>
								<BookingsList />
							</MainContainer>
						</ProtectedRoute>
					}
				/>

				<Route
					path="/bookings/:id"
					element={
						<ProtectedRoute requiredRole="ADMIN">
							<MainContainer>
								<React.Suspense fallback={<div>Loading...</div>}>
									<BookingDetail />
								</React.Suspense>
							</MainContainer>
						</ProtectedRoute>
					}
				/>

				<Route
					path="/disputes/:id"
					element={
						<ProtectedRoute requiredRole="ADMIN">
							<MainContainer>
								<React.Suspense fallback={<div>Loading...</div>}>
									<DisputeDetail />
								</React.Suspense>
							</MainContainer>
						</ProtectedRoute>
					}
				/>

				<Route
					path="/profile"
					element={
						<ProtectedRoute requiredRole="ADMIN">
							<MainContainer>
								<Profile />
							</MainContainer>
						</ProtectedRoute>
					}
				/>

				<Route
					path="/users"
					element={
						<ProtectedRoute requiredRole="ADMIN">
							<MainContainer>
								<UsersList />
							</MainContainer>
						</ProtectedRoute>
					}
				/>

				<Route
					path="/disputes"
					element={
						<ProtectedRoute requiredRole="ADMIN">
							<MainContainer>
								<DisputesList />
							</MainContainer>
						</ProtectedRoute>
					}
				/>
				
				<Route
					path="/payouts"
					element={
						<ProtectedRoute requiredRole="ADMIN">
							<MainContainer>
								<PayoutsList />
							</MainContainer>
						</ProtectedRoute>
					}
				/>

				<Route
					path="/wallet"
					element={
						<ProtectedRoute requiredRole="ADMIN">
							<MainContainer>
								<WalletView />
							</MainContainer>
						</ProtectedRoute>
					}
				/>

				<Route
					path="/users/:id"
					element={
						<ProtectedRoute requiredRole="ADMIN">
							<MainContainer>
								{ /* lazy: mount detail component */ }
								<React.Suspense fallback={<div>Loading...</div>}>
									<UserDetail />
								</React.Suspense>
							</MainContainer>
						</ProtectedRoute>
					}
				/>

				<Route
					path="/properties"
					element={
						<ProtectedRoute requiredRole="ADMIN">
							<MainContainer>
								<PropertiesList />
							</MainContainer>
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
};

export default AppRouter;
