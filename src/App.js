import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import GuestRoute from './components/GuestRoute';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import ItemFormPage from './pages/ItemFormPage';
import LoginPage from './pages/LoginPage';
import PublicWishlistPage from './pages/PublicWishlistPage';
import RegisterPage from './pages/RegisterPage';
import WishlistPage from './pages/WishlistPage';

const ProtectedLayout = () => (
  <ProtectedRoute>
    <AppShell>
      <Outlet />
    </AppShell>
  </ProtectedRoute>
);

const AuthLayout = () => (
  <GuestRoute>
    <Outlet />
  </GuestRoute>
);

const NotFoundPage = () => (
  <div className="app-shell">
    <div className="glass-panel p-10 text-center">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="mt-3 text-slate-600">
        The page you are looking for does not exist.
      </p>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route path="/shared/:shareToken" element={<PublicWishlistPage />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/wishlists/:wishlistId" element={<WishlistPage />} />
        <Route path="/wishlists/:wishlistId/items/new" element={<ItemFormPage />} />
        <Route
          path="/wishlists/:wishlistId/items/:itemId/edit"
          element={<ItemFormPage />}
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

