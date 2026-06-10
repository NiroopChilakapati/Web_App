import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getAllFeedback } from "../api/feedbackApi";

export default function AdminFeedback() {
  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin = user && (user.role === "admin" || user.role === "superadmin");

  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAdmin) return;

    const loadFeedback = async () => {
      const data = await getAllFeedback();

      if (Array.isArray(data)) {
        setFeedbacks(data);
      } else {
        setError(data.message || "Failed to load feedback");
      }
    };

    loadFeedback();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <section className="admin-page">
          <p className="section-tag">ADMIN FEEDBACK</p>
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
        <p className="section-tag">ADMIN FEEDBACK</p>
        <h2>Customer Feedback</h2>

        {error && <p className="auth-error">{error}</p>}

        {feedbacks.length === 0 ? (
          <div className="empty-orders">
            <p>No feedback yet.</p>
            <span>Customer reviews and feedback will appear here.</span>
          </div>
        ) : (
          <div className="orders-list">
            {feedbacks.map((feedback) => (
              <div className="order-card" key={feedback._id}>
                <div className="order-header">
                  <h3>Feedback #{feedback._id.slice(-6)}</h3>
                  <span>{feedback.rating} ⭐</span>
                </div>

                <p className="order-date">
                  Customer: {feedback.user?.name} | {feedback.user?.email}
                </p>

                <p>
                  <strong>Order:</strong> #{feedback.order?._id?.slice(-6)}
                </p>

                <p>
                  <strong>Message:</strong> {feedback.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
