import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  getAllSupportTickets,
  updateSupportTicketStatus,
} from "../api/supportApi";

const statuses = ["Open", "In Progress", "Resolved"];

export default function SupportManagement() {
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

  const handleStatusChange = async (ticketId, status) => {
    const data = await updateSupportTicketStatus(ticketId, status);

    if (data.ticket) {
      setTickets((prev) =>
        prev.map((ticket) => (ticket._id === ticketId ? data.ticket : ticket)),
      );
    } else {
      setError(data.message || "Failed to update ticket status");
    }
  };

  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <section className="admin-page">
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
        <p className="section-tag">CUSTOMER SUPPORT</p>
        <h2>Support Ticket Management</h2>

        {error && <p className="auth-error">{error}</p>}

        {tickets.length === 0 ? (
          <div className="empty-orders">
            <p>No support tickets yet.</p>
            <span>Customer support requests will appear here.</span>
          </div>
        ) : (
          <div className="support-ticket-grid">
            {tickets.map((ticket) => (
              <div className="support-ticket-card" key={ticket._id}>
                <div className="support-ticket-header">
                  <div>
                    <h3>{ticket.issue}</h3>
                    <p>
                      {ticket.user?.name} | {ticket.user?.email}
                    </p>
                  </div>

                  <select
                    value={ticket.status}
                    onChange={(e) =>
                      handleStatusChange(ticket._id, e.target.value)
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="support-ticket-body">
                  <p>{ticket.message}</p>

                  <span>
                    Created: {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
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
