import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getPublicSettings } from './api/admin';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallbackPage from './pages/AuthCallbackPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ShoppingPlansPage from './pages/ShoppingPlansPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderPage from './pages/OrderPage';
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
import OrdersPage from './pages/admin/OrdersPage';
import PaymentsPage from './pages/admin/PaymentsPage';
import WithdrawalsPage from './pages/admin/WithdrawalsPage';
import PromotionsPage from './pages/admin/PromotionsPage';
import ReviewsPage from './pages/admin/ReviewsPage';
import ReportsPage from './pages/admin/ReportsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import NotificationsPage from './pages/admin/NotificationPage';
import SettingsPage from './pages/admin/SettingsPage';

/**
 * Branding dari halaman Pengaturan admin dipasang ke judul tab dan favicon.
 * Tanpa ini setelan branding cuma jadi angka di database yang tidak pernah
 * kelihatan. Gagal ambil = diamkan, halaman tetap jalan dengan judul bawaan.
 */
function useBranding() {
  useEffect(() => {
    getPublicSettings()
      .then((res) => {
        const { MARKETPLACE_NAME: name, BRAND_FAVICON_URL: favicon } = res.data.data;
        if (name) document.title = name;
        if (favicon) {
          const link =
            document.querySelector<HTMLLinkElement>("link[rel~='icon']") ??
            document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'icon' }));
          link.href = favicon;
        }
      })
      .catch(() => {});
  }, []);
}

function App() {
  useBranding();

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
              {/* Pendaratan redirect Google OAuth — lihat AuthCallbackPage */}
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

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

              {/* Orders — halaman pembeli. `OrdersPage` (jamak) itu panel admin,
                  bukan ini: tertukar sejak OrdersPage.tsx di-rename ke OrderPage.tsx. */}
              <Route path="/orders" element={<OrderPage />} />

              {/* Kupon */}
              <Route path="/coupons" element={<CouponsPage />} />

              {/* NeedPay — saldo */}
              <Route path="/needpay" element={<NeedPayPage />} />

              {/* Lacak paket */}
              <Route path="/order/:id/track" element={<TrackingPage />} />

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

              {/* Pending/approved dulunya route sendiri (salah satunya bahkan
                  punya spasi di akhir path, jadi tak pernah cocok). Sekarang
                  cuma tab di dalam halaman ini. */}
              <Route path="/admin/products" element={<RequireAdmin><ProductsPage /></RequireAdmin>} />
              <Route path="/admin/categories" element={<RequireAdmin><CategoryPage /></RequireAdmin>} />
              <Route path="/admin/orders" element={<RequireAdmin><OrdersPage /></RequireAdmin>} />
              <Route path="/admin/payments" element={<RequireAdmin><PaymentsPage /></RequireAdmin>} />
              <Route path="/admin/withdrawals" element={<RequireAdmin><WithdrawalsPage /></RequireAdmin>} />
              <Route path="/admin/promotions" element={<RequireAdmin><PromotionsPage /></RequireAdmin>} />
              <Route path="/admin/reviews" element={<RequireAdmin><ReviewsPage /></RequireAdmin>} />
              <Route path="/admin/reports" element={<RequireAdmin><ReportsPage /></RequireAdmin>} />
              <Route path="/admin/analytics" element={<RequireAdmin><AnalyticsPage /></RequireAdmin>} />
              <Route path="/admin/notifications" element={<RequireAdmin><NotificationsPage /></RequireAdmin>} />
              <Route path="/admin/settings" element={<RequireAdmin><SettingsPage /></RequireAdmin>} />

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