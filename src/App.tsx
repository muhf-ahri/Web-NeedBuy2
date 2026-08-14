import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ShoppingPlansPage from './pages/ShoppingPlansPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import NeedsPage from './pages/NeedsPage';
import CouponsPage from './pages/CouponsPage';
import NeedPayPage from './pages/NeedPayPage';
import TrackingPage from './pages/TrackingPage';
import MessagesPage from './pages/MessagesPage';
import LegalPage from './pages/LegalPage';

// Seller pages
import RequireSeller from './components/RequireSeller';
import SellerDashboard from './pages/seller/DashboardPage';
import SellerProducts from './pages/seller/ProductsPage';
import SellerOrders from './pages/seller/OrdersPage';
import SellerChats from './pages/seller/ChatsPage';
import SellerAnalytics from './pages/seller/AnalyticsPage';
import SellerSettings from './pages/seller/SettingsPage';

// Admin pages
import RequireAdmin from './components/RequireAdmin';
import AdminDashboard from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import StoresPage from './pages/admin/StoresPage';
import AdminPlaceholder from './pages/admin/PlaceholderPage';
import ProductsPage from './pages/admin/ProductsPage';
import CategoryPage from './pages/admin/CategoryPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <Routes>
              {/* Home */}
              <Route path="/" element={<HomePage />} />

              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Categories — list semua produk */}
              <Route path="/categories" element={<CategoriesPage />} />
              {/* Category detail — filtered by slug */}
              <Route path="/categories/:slug" element={<CategoryDetailPage />} />

              {/* Product detail */}
              <Route path="/products/:slug" element={<ProductDetailPage />} />

              {/* Shopping Plans */}
              <Route path="/plans" element={<ShoppingPlansPage />} />

              {/* Search */}
              <Route path="/search" element={<SearchPage />} />

              {/* Needs / Need-Based Search */}
              <Route path="/needs" element={<NeedsPage />} />

              {/* Cart & Checkout */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />

              {/* Orders */}
              <Route path="/orders" element={<OrdersPage />} />

              {/* Kupon */}
              <Route path="/coupons" element={<CouponsPage />} />

              {/* NeedPay — saldo */}
              <Route path="/needpay" element={<NeedPayPage />} />

              {/* Lacak paket */}
              <Route path="/orders/:id/track" element={<TrackingPage />} />

              {/* Pesan dengan penjual */}
              <Route path="/messages" element={<MessagesPage />} />

              {/* Halaman footer (syarat, privasi, pengiriman, kontak) */}
              <Route path="/terms" element={<LegalPage />} />
              <Route path="/privacy" element={<LegalPage />} />
              <Route path="/shipping" element={<LegalPage />} />
              <Route path="/contact" element={<LegalPage />} />

              {/* Wishlist */}
              <Route path="/wishlist" element={<WishlistPage />} />

              {/* Profile */}
              <Route path="/profile" element={<ProfilePage />} />

              {/* Seller routes — hanya untuk role SELLER */}
              <Route path="/seller" element={<Navigate to="/seller/dashboard" replace />} />
              <Route
                path="/seller/dashboard"
                element={
                  <RequireSeller>
                    <SellerDashboard />
                  </RequireSeller>
                }
              />
              <Route
                path="/seller/products"
                element={
                  <RequireSeller>
                    <SellerProducts />
                  </RequireSeller>
                }
              />
              <Route
                path="/seller/orders"
                element={
                  <RequireSeller>
                    <SellerOrders />
                  </RequireSeller>
                }
              />
              <Route
                path="/seller/chats"
                element={
                  <RequireSeller>
                    <SellerChats />
                  </RequireSeller>
                }
              />
              <Route
                path="/seller/analytics"
                element={
                  <RequireSeller>
                    <SellerAnalytics />
                  </RequireSeller>
                }
              />
              <Route
                path="/seller/settings"
                element={
                  <RequireSeller>
                    <SellerSettings />
                  </RequireSeller>
                }
              />

              {/* Admin routes — hanya untuk role ADMIN */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route
                path="/admin/dashboard"
                element={
                  <RequireAdmin>
                    <AdminDashboard />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <RequireAdmin>
                    <UsersPage />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/stores"
                element={
                  <RequireAdmin>
                    <StoresPage />
                  </RequireAdmin>
                }
              />

              <Route
                path="/admin/*"
                element={
                  <RequireAdmin>
                    <AdminPlaceholder />
                  </RequireAdmin>
                }
              />

              <Route path="/admin/products" element={<RequireAdmin><ProductsPage /></RequireAdmin>} />
              <Route path="/admin/products/pending" element={<RequireAdmin><ProductsPage /></RequireAdmin>} />
              <Route path="/admin/products/approved " element={<RequireAdmin><ProductsPage /></RequireAdmin>} />
              <Route path="/admin/categories" element={<RequireAdmin><CategoryPage /></RequireAdmin>} />

              {/* Compare — placeholder */}
              <Route path="/compare" element={<div className="p-8 text-center text-gray-500 font-sans">Compare — coming soon</div>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;