import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getMyOrders } from "../api/orderApi";
import { generateInvoice } from "../utils/invoiceGenerator";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      const data = await getMyOrders();

      if (Array.isArray(data)) {
        setOrders(data);
      }
    };

    loadOrders();
  }, []);

  return (
    <>
      <Navbar />

      <section className="orders-page">
        <p className="section-tag">MY ORDERS</p>
        <h2>Order History</h2>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <p>No orders yet.</p>
            <span>Your customized BYND BOX orders will appear here.</span>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order._id}>
                <div className="order-header">
                  <h3>
                    {order.orderNumber || `Order #${order._id.slice(-6)}`}
                  </h3>
                  <span>{order.status}</span>
                </div>

                <p className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
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

                <div className="order-footer">
                  <h3 className="order-total">Total: ₹{order.totalAmount}</h3>

                  <button
                    className="invoice-btn"
                    onClick={() => generateInvoice(order)}
                  >
                    Download Invoice
                  </button>
                </div>

                <div className="delivered-actions">
                  {order.status === "Delivered" && (
                    <Link to={`/feedback/${order._id}`}>Give Feedback</Link>
                  )}

                  <Link to={`/support/${order._id}`}>Customer Care</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
