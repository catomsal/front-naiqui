import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ProductList from './components/ProductList.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import CategoryProducts from './pages/CategoryProducts.jsx'
import Cart from './pages/Cart.jsx'
import OrderList from './pages/OrderList.jsx'
import OrderDetail from './pages/OrderDetail.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import Favorites from './pages/Favorites.jsx'

function App() {
	return (
		<>
			<Navbar />
			<Routes>
				<Route path="/" element={<ProductList />} />
				<Route path="/producto/:id" element={<ProductDetail />} />
				<Route path="/categoria/:id" element={<CategoryProducts />} />
				<Route path="/login" element={<Login />} />
				<Route path="/favoritos" element={<Favorites />} />
				<Route
					path="/carrito"
					element={
						<ProtectedRoute>
							<Cart />
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
			</Routes>
		</>
	)
}

export default App
