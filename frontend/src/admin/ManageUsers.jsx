import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getAllUsers, updateUserRole } from "../api/adminApi";

const roles = ["customer", "admin", "superadmin"];

export default function ManageUsers() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isSuperAdmin = user && user.role === "superadmin";

  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSuperAdmin) return;

    const loadUsers = async () => {
      const data = await getAllUsers();

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setError(data.message || "Failed to load users");
      }
    };

    loadUsers();
  }, [isSuperAdmin]);

  const handleRoleChange = async (userId, role) => {
    const data = await updateUserRole(userId, role);

    if (data.user) {
      setUsers((prevUsers) =>
        prevUsers.map((item) => (item._id === userId ? data.user : item)),
      );
    } else {
      setError(data.message || "Failed to update role");
    }
  };

  if (!isSuperAdmin) {
    return (
      <>
        <Navbar />

        <section className="admin-page">
          <p className="section-tag">SUPERADMIN</p>
          <h2>Access Denied</h2>
          <p className="auth-error">Only superadmin can manage users.</p>
        </section>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="admin-page">
        <p className="section-tag">SUPERADMIN</p>
        <h2>Manage Users</h2>

        {error && <p className="auth-error">{error}</p>}

        {users.length === 0 ? (
          <p className="empty-cart">No users found.</p>
        ) : (
          <div className="users-table">
            {users.map((item) => (
              <div className="user-row" key={item._id}>
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.email}</p>
                </div>

                <select
                  className="status-select"
                  value={item.role}
                  onChange={(e) => handleRoleChange(item._id, e.target.value)}
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
