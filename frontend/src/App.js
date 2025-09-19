import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ToastProvider } from "./contexts/ToastContext";
import { useAuth } from "./contexts/AuthContext"; // PŘIDEJ TENTO IMPORT
import ProtectedRoute from "./components/ProtectedRoute";
import MobileHeader from "./components/MobileHeader";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import HowItsMade from "./pages/HowItsMade";
import Reservations from "./pages/Reservations";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminReservations from "./pages/AdminReservations";
import AdminMenu from "./pages/AdminMenu";

// POMOCNÁ KOMPONENTA PRO ROUTES
function AppRoutes() {
  const { user } = useAuth(); // TEĎ JE UVNITŘ KOMPONENTY

  return (
    <Routes>
      {/* Veřejné stránky */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/how-its-made" element={<HowItsMade />} />
      <Route path="/reservations" element={<Reservations />} />
      <Route path="/cart" element={<Cart />} />
      <Route
        path="/checkout"
        element={
          user ? <Navigate to="/cart" replace /> : <Checkout />
        }
      />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Chráněné admin stránky */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reservations"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminReservations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/menu"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminMenu />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Router>
            <div className="App">
              <MobileHeader />
              <main>
                <AppRoutes />
              </main>
            </div>
          </Router>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;