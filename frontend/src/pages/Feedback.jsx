import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { submitFeedback } from "../api/feedbackApi";

export default function Feedback() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a star rating");
      return;
    }

    const data = await submitFeedback({
      orderId,
      rating,
      message,
    });

    if (data.feedback) {
      navigate("/orders");
    } else {
      setError(data.message || "Feedback failed");
    }
  };

  return (
    <>
      <Navbar />

      <section className="auth-page">
        <div className="auth-card feedback-card">
          <p className="section-tag">ORDER FEEDBACK</p>
          <h2>Give Feedback</h2>

          {error && <p className="auth-error">{error}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= rating ? "active" : ""}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>

            <p className="star-rating-text">
              Click a star to rate your experience
            </p>

            <textarea
              placeholder="Write your feedback"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>

            <button type="submit">Submit Feedback</button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
