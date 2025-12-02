import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header from "./components/Layout/Header/Header";
import Footer from "./components/Layout/Footer/Footer";

import Main from "./pages/Main";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardPage from "./pages/User/Dashboard";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import CategoryPage from "./pages/Category/CategoryPage";

import ProtectedRoute from "./route/ProtectedRoute";
import PublicRoute from "./route/PublicRoute";
import AdminRoute from "./route/AdminRoute";

import AdminLayout from "./pages/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import ProfileAdmin from "./pages/Admin/ProfileAdmin";
import ProductsPage from "./pages/Admin/Products/ProductsPage";
import OrdersPage from "./pages/Admin/Orders/OrdersPage";
import AddProduct from "./pages/Admin/Products/AddProduct";
import EditProduct from "./pages/Admin/Products/EditProduct";
import EditVariant from "./pages/Admin/Products/EditVariants"

import { SearchProvider } from "./context/SearchContext";

export default function App() {
  const location = useLocation();

  // path yang ga butuh header/footer
  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/admin");

  return (
    <SearchProvider>
      {!hideLayout && <Header />}

      <Routes>
        <Route path="/" element={<Main />} />

        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        <Route path="/category/:main" element={<CategoryPage />} />
        <Route path="/category/:main/:sub" element={<CategoryPage />} />

        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<ProfileAdmin />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="products/:id/variants" element={<EditVariant />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideLayout && <Footer />}
    </SearchProvider>
  );
}