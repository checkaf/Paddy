import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import FarmerDashboard from './pages/FarmerDashboard.jsx';
// BuyerDashboard removed: buyer flow moved to Home
import ProductListing from './pages/ProductListing.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import OrderManagement from './pages/OrderManagement.jsx';
import Reviews from './pages/Reviews.jsx';
import NotFound from './pages/NotFound.jsx';
import Profile from './pages/Profile.jsx';

function ProtectedRoute({ children, roles }) {
  const { user, role, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 container-px py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/home/farmer"
                element={
                  <ProtectedRoute roles={["farmer"]}>
                    <FarmerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/profile" element={<ProtectedRoute roles={["buyer", "farmer"]}><Profile /></ProtectedRoute>} />
              <Route path="/products" element={<ProtectedRoute roles={["buyer", "farmer"]}><ProductListing /></ProtectedRoute>} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute roles={["buyer", "farmer"]}>
                    <OrderManagement />
                  </ProtectedRoute>
                }
              />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
