import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getAllSupportTickets, resolveSupportTicket } from "../api/supportApi";

export default function CustomerCare() {
  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin = user && (user.role === "admin" || user.role === "superadmin");

  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAdmin) return;

    const loadTickets = async () => {
      const data = await getAllSupportTickets();

      if (Array.isArray(data)) {
        setTickets(data);
      } else {
        setError(data.message || "Failed to load support tickets");
      }
    };

    loadTickets();
  }, [isAdmin]);

  const handleResolve = async (ticketId) => {
    const data = await resolveSupportTicket(ticketId);

    if (data.ticket) {
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === ticketId ? data.ticket : ticket,
        ),
      );
    } else {
      setError(data.message || "Failed to resolve ticket");
    }
  };

  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <section className="admin-page">
          <p className="section-tag">CUSTOMER CARE</p>
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
        <p className="section-tag">CUSTOMER CARE</p>
        <h2>Support Requests</h2>

        {error && <p className="auth-error">{error}</p>}

        {tickets.length === 0 ? (
          <div className="empty-orders">
            <p>No support requests yet.</p>
            <span>Customer queries and complaints will appear here.</span>
          </div>
        ) : (
          <div className="orders-list">
            {tickets.map((ticket) => (
              <div className="order-card" key={ticket._id}>
                <div className="order-header">
                  <h3>Ticket #{ticket._id.slice(-6)}</h3>
                  <span>{ticket.status}</span>
                </div>

                <p className="order-date">
                  Customer: {ticket.user?.name} | {ticket.user?.email}
                </p>

                <p>
                  <strong>Order:</strong> #{ticket.order?._id?.slice(-6)}
                </p>

                <p>
                  <strong>Issue:</strong> {ticket.issue}
                </p>

                <p>
                  <strong>Message:</strong> {ticket.message}
                </p>

                {ticket.status !== "Resolved" && (
                  <button
                    className="resolve-btn"
                    onClick={() => handleResolve(ticket._id)}
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
