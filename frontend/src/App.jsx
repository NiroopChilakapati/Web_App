import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Orders from "./pages/Orders";
import Feedback from "./pages/Feedback";
import CustomerSupport from "./pages/CustomerSupport";

import AdminDashboard from "./admin/AdminDashboard";
import AdminFeedback from "./admin/AdminFeedback";
import CustomerCare from "./admin/CustomerCare";
import ManageUsers from "./admin/ManageUsers";
import Analytics from "./admin/Analytics";
import AddProduct from "./admin/AddProduct";
import ManageStock from "./admin/ManageStock";
import Checkout from "./pages/Checkout";
import EditProduct from "./admin/EditProduct";
import Profile from "./pages/Profile";
import SupportManagement from "./admin/SupportManagement";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/shop" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />

      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/orders" element={<Orders />} />
      <Route path="/feedback/:orderId" element={<Feedback />} />
      <Route path="/support/:orderId" element={<CustomerSupport />} />

      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/analytics" element={<Analytics />} />
      <Route path="/admin/add-product" element={<AddProduct />} />
      <Route path="/admin/manage-stock" element={<ManageStock />} />
      <Route path="/admin/users" element={<ManageUsers />} />

      <Route path="/feedback" element={<AdminFeedback />} />
      <Route path="/customer-care" element={<CustomerCare />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/admin/edit-product/:id" element={<EditProduct />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin/support" element={<SupportManagement />} />
    </Routes>
  );
}
