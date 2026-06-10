import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { submitSupportTicket } from "../api/supportApi";

export default function CustomerSupport() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    issue: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await submitSupportTicket({
      orderId,
      issue: formData.issue,
      message: formData.message,
    });

    if (data.ticket) {
      setSuccess("Support request submitted successfully");
      setError("");

      setTimeout(() => {
        navigate("/orders");
      }, 1200);
    } else {
      setError(data.message || "Support request failed");
      setSuccess("");
    }
  };

  return (
    <>
      <Navbar />

      <section className="support-page">
        <div className="support-card">
          <p className="section-tag">CUSTOMER CARE</p>
          <h2>How Can We Help?</h2>

          <p className="support-subtitle">
            Tell us your issue and our BYND BOX team will help you soon.
          </p>

          {success && <p className="success-message">{success}</p>}
          {error && <p className="auth-error">{error}</p>}

          <form className="support-form" onSubmit={handleSubmit}>
            <select
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              required
            >
              <option value="">Select Issue Type</option>
              <option value="Order Status">Order Status</option>
              <option value="Payment Issue">Payment Issue</option>
              <option value="Product Customization">
                Product Customization
              </option>
              <option value="Delivery Issue">Delivery Issue</option>
              <option value="Damaged Product">Damaged Product</option>
              <option value="Other">Other</option>
            </select>

            <textarea
              name="message"
              placeholder="Explain your issue clearly..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit">Submit Support Request</button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
