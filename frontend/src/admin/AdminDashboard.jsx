import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getAllOrders, updateOrderStatus } from "../api/adminApi";

const statuses = ["Accepted", "Making", "Shipped", "Delivered", "Cancelled"];

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin = user && (user.role === "admin" || user.role === "superadmin");

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAdmin) return;

    const loadOrders = async () => {
      const data = await getAllOrders();

      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setError(data.message || "Failed to load admin orders");
      }
    };

    loadOrders();
  }, [isAdmin]);

  const handleStatusChange = async (orderId, status) => {
    const data = await updateOrderStatus(orderId, status);

    if (data.order) {
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === orderId ? data.order : order)),
      );
    } else {
      setError(data.message || "Failed to update status");
    }
  };

  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <section className="admin-page">
          <p className="section-tag">ADMIN PANEL</p>
          <h2>Access Denied</h2>
          <p className="auth-error">Admin only.</p>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="admin-page">
        <p className="section-tag">ADMIN PANEL</p>
        <h2>All Customer Orders</h2>

        {error && <p className="auth-error">{error}</p>}

        {!error && orders.length === 0 ? (
          <p className="empty-cart">No orders found.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order._id}>
                <div className="order-header">
                  <h3>
                    {order.orderNumber || `Order #${order._id.slice(-6)}`}
                  </h3>

                  <select
                    className="status-select"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="order-date">
                  Customer: {order.user?.name} | {order.user?.email}
                </p>

                {order.deliveryDetails && (
                  <div className="delivery-box">
                    <h4>Delivery Details</h4>
                    <p>
                      <strong>Name:</strong> {order.deliveryDetails.fullName}
                    </p>
                    <p>
                      <strong>Phone:</strong> {order.deliveryDetails.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {order.deliveryDetails.address}
                    </p>
                    <p>
                      <strong>City:</strong> {order.deliveryDetails.city}
                    </p>
                    <p>
                      <strong>Pincode:</strong> {order.deliveryDetails.pincode}
                    </p>
                  </div>
                )}

                {order.items.map((item, index) => (
                  <div className="order-item" key={index}>
                    <img src={item.image} alt={item.name} />

                    <div>
                      <h4>{item.name}</h4>
                      <p>₹{item.price}</p>

                      {item.customizations.map((custom, i) => (
                        <div key={i} className="custom-detail">
                          <p>
                            <strong>{custom.label}:</strong> {custom.value}
                          </p>

                          {custom.files && custom.files.length > 0 && (
                            <div className="uploaded-files">
                              {custom.files.map((file, fileIndex) => (
                                <a
                                  key={fileIndex}
                                  href={file}
                                  download
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Download File {fileIndex + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <h3 className="order-total">Total: ₹{order.totalAmount}</h3>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
