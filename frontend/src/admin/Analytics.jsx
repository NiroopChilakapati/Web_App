import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getAnalytics } from "../api/analyticsApi";

const analyticsCards = [
  {
    key: "revenue",
    title: "Total Revenue",
    prefix: "₹",
  },
  {
    key: "totalOrders",
    title: "Total Orders",
  },
  {
    key: "deliveredOrders",
    title: "Delivered Orders",
  },
  {
    key: "cancelledOrders",
    title: "Cancelled Orders",
  },
  {
    key: "totalProducts",
    title: "Total Products",
  },
  {
    key: "activeProducts",
    title: "Active Products",
  },
  {
    key: "soldOutProducts",
    title: "Sold Out Products",
  },
  {
    key: "totalUsers",
    title: "Total Users",
  },
  {
    key: "admins",
    title: "Admins",
  },
  {
    key: "feedbackCount",
    title: "Feedbacks",
  },
  {
    key: "supportTickets",
    title: "Support Tickets",
  },
  {
    key: "openTickets",
    title: "Open Tickets",
  },
];

export default function Analytics() {
  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin = user && (user.role === "admin" || user.role === "superadmin");

  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAdmin) return;

    const loadAnalytics = async () => {
      const data = await getAnalytics();

      if (data.message) {
        setError(data.message);
      } else {
        setAnalytics(data);
      }
    };

    loadAnalytics();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <>
        <Navbar />

        <section className="admin-page">
          <p className="section-tag">ADMIN ANALYTICS</p>
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
        <p className="section-tag">ADMIN ANALYTICS</p>
        <h2>Dashboard Overview</h2>

        {error && <p className="auth-error">{error}</p>}

        {analytics && (
          <>
            <div className="analytics-hero-card">
              <p>Total Revenue</p>
              <h3>₹{analytics.revenue}</h3>
              <span>Overall BYND BOX earnings from orders</span>
            </div>

            <div className="analytics-grid luxury-analytics-grid">
              {analyticsCards.map((card) => (
                <div className="analytics-card" key={card.key}>
                  <span>{card.title}</span>

                  <h3>
                    {card.prefix || ""}
                    {analytics[card.key] ?? 0}
                  </h3>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <Footer />
    </>
  );
}
