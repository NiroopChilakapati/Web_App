import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin = user && (user.role === "admin" || user.role === "superadmin");

  const isSuperAdmin = user && user.role === "superadmin";

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "/";
  };

  return (
    <nav className={`navbar ${isAdmin ? "admin-navbar" : ""}`}>
      <Link to="/" className="brand">
        <img src={logo} alt="BYND BOX Logo" />

        <div>
          <h1>BYND BOX</h1>
          <span>Handmade Luxury</span>
        </div>
      </Link>

      {!isAdmin ? (
        <>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>

            {user && <Link to="/orders">Orders</Link>}
            {user && <Link to="/profile">Profile</Link>}
          </div>

          <div className="right-nav">
            <Link to="/cart" className="cart-icon">
              <span className="cart-symbol">🛒</span>
            </Link>

            {user ? (
              <>
                <span className="user-name">Hi, {user.name}</span>

                <button onClick={logout} className="logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="admin-center-menu">
            <div className="admin-links-row">
              <Link to="/">Home</Link>
              <Link to="/admin/dashboard">Orders</Link>
              <Link to="/admin/analytics">Analytics</Link>
              <Link to="/admin/add-product">Add Product</Link>
              <Link to="/admin/manage-stock">Manage Stock</Link>
            </div>

            <div className="admin-links-row">
              <Link to="/feedback">Feedback</Link>
              <Link to="/admin/support">Customer Care</Link>

              {isSuperAdmin && <Link to="/admin/users">Manage Users</Link>}
            </div>
          </div>

          <div className="right-nav admin-user-right">
            <span className="user-name">Hi, {user.name}</span>

            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </>
      )}
    </nav>
  );
}
