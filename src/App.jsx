import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import StaffRoute from './components/StaffRoute.jsx'
import CustomerRoute from './components/CustomerRoute.jsx'
import ProductList from './components/ProductList.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import ProductManagement from './pages/ProductManagement.jsx'
import CategoryProducts from './pages/CategoryProducts.jsx'
import Cart from './pages/Cart.jsx'
import OrderList from './pages/OrderList.jsx'
import OrderDetail from './pages/OrderDetail.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import Favorites from './pages/Favorites.jsx'
import Checkout from './pages/Checkout.jsx'
import UserManagement from './pages/UserManagement.jsx'
import './App.css'

function App() {
	return (
		<>
			<Navbar />
			<Routes>
				<Route path="/" element={<ProductList />} />
				<Route path="/home" element={<ProductList />} />
				<Route path="/producto/:id" element={<ProductDetail />} />
				<Route
					path="/productos/gestionar"
					element={
						<ProtectedRoute>
							<StaffRoute>
								<ProductManagement />
							</StaffRoute>
						</ProtectedRoute>
					}
				/>
				<Route path="/categoria/:id" element={<CategoryProducts />} />
				<Route path="/login" element={<Login />} />
				<Route path="/login-context" element={<Login />} />
				<Route path="/registro" element={<Register />} />
				<Route
					path="/favoritos"
					element={
						<ProtectedRoute>
							<CustomerRoute>
								<Favorites />
							</CustomerRoute>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/carrito"
					element={
						<ProtectedRoute>
							<CustomerRoute>
								<Cart />
							</CustomerRoute>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/checkout"
					element={
						<ProtectedRoute>
							<CustomerRoute>
								<Checkout />
							</CustomerRoute>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/pedidos"
					element={
						<ProtectedRoute>
							<OrderList />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/pedido/:id"
					element={
						<ProtectedRoute>
							<OrderDetail />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/perfil"
					element={
						<ProtectedRoute>
							<Profile />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/usuarios"
					element={
						<ProtectedRoute>
							<AdminRoute>
								<UserManagement />
							</AdminRoute>
						</ProtectedRoute>
					}
				/>
			</Routes>
		</>
	)
}

export default App
