import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { placeOrder } from "../api/orderApi";
import { createPaymentOrder } from "../api/paymentApi";

export default function Checkout() {
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const user = JSON.parse(localStorage.getItem("user"));

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveOrderAfterPayment = async () => {
    const orderData = {
      items: cart.map((item) => ({
        productId: item.productId || item.id || item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        customizations: item.customizations || [],
      })),
      totalAmount: total,
      deliveryDetails: formData,
    };

    const data = await placeOrder(orderData);

    if (data.order) {
      localStorage.removeItem("cart");
      navigate("/orders");
    } else {
      setError(data.message || "Order failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      setError("Cart is empty");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const paymentOrder = await createPaymentOrder(total);

      if (!paymentOrder.id) {
        setError(paymentOrder.message || "Payment order failed");
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "BYND BOX",
        description: "Customized Handmade Product Order",
        order_id: paymentOrder.id,

        handler: async () => {
          await saveOrderAfterPayment();
        },

        prefill: {
          name: formData.fullName || user?.name,
          email: user?.email,
          contact: formData.phone,
        },

        theme: {
          color: "#6f4f45",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch {
      setError("Something went wrong with payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="admin-page">
        <p className="section-tag">DELIVERY DETAILS</p>
        <h2>Shipping Information</h2>

        <div className="admin-form-card">
          {error && <p className="auth-error">{error}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <textarea
              name="address"
              placeholder="Delivery Address"
              value={formData.address}
              onChange={handleChange}
              required
            ></textarea>

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
            />

            <h3>Total: ₹{total}</h3>

            <button type="submit" disabled={loading}>
              {loading ? "Opening Payment..." : "Pay & Place Order"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
