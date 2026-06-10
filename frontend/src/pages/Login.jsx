import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { loginUser } from "../api/authApi";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    const data = await loginUser(formData);

    console.log("LOGIN RESPONSE:", data);

    if (data.token && data.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "/";
    } else {
      setError(data.message || "Login failed");
    }
  };

  return (
    <>
      <Navbar />

      <section className="auth-page">
        <div className="auth-card">
          <p className="section-tag">WELCOME BACK</p>
          <h2>Login</h2>

          {error && <p className="auth-error">{error}</p>}

          <form className="auth-form" onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit">Login</button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Signup</Link>
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
