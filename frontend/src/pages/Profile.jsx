import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getMyOrders } from "../api/orderApi";
import { getMyProfile, updateMyProfile } from "../api/profileApi";

export default function Profile() {
  const savedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(savedUser);
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: savedUser?.name || "",
    phone: "",
    fullName: "",
    addressPhone: "",
    address: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    let isMounted = true;

    const loadData = async () => {
      try {
        const profileData = await getMyProfile();

        if (isMounted && profileData._id) {
          setUser(profileData);

          setFormData({
            name: profileData.name || "",
            phone: profileData.phone || "",
            fullName: profileData.savedAddress?.fullName || "",
            addressPhone: profileData.savedAddress?.phone || "",
            address: profileData.savedAddress?.address || "",
            city: profileData.savedAddress?.city || "",
            pincode: profileData.savedAddress?.pincode || "",
          });
        }

        const orderData = await getMyOrders();

        if (isMounted && Array.isArray(orderData)) {
          setOrders(orderData);
        }
      } catch {
        if (isMounted) {
          setError("Unable to load profile data");
        }
      }
    };

    if (localUser) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  if (!savedUser) {
    return (
      <>
        <Navbar />
        <section className="auth-page">
          <div className="auth-card">
            <h2>Please Login</h2>
            <Link to="/login" className="profile-btn">
              Login
            </Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const latestOrder = orders[0];
  const savedAddress = user?.savedAddress;

  const displayAddress =
    savedAddress?.address || latestOrder?.deliveryDetails?.address || "";

  const displayPhone =
    user?.phone ||
    savedAddress?.phone ||
    latestOrder?.deliveryDetails?.phone ||
    "";

  const displayFullName =
    savedAddress?.fullName ||
    latestOrder?.deliveryDetails?.fullName ||
    user?.name;

  const displayCity =
    savedAddress?.city || latestOrder?.deliveryDetails?.city || "";

  const displayPincode =
    savedAddress?.pincode || latestOrder?.deliveryDetails?.pincode || "";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const profileData = {
      name: formData.name,
      phone: formData.phone,
      savedAddress: {
        fullName: formData.fullName,
        phone: formData.addressPhone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
      },
    };

    const data = await updateMyProfile(profileData);

    if (data.user) {
      setUser(data.user);
      setIsEditing(false);
      setMessage("Profile updated successfully");
      setError("");

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        }),
      );
    } else {
      setError(data.message || "Failed to update profile");
      setMessage("");
    }
  };

  return (
    <>
      <Navbar />

      <section className="profile-page">
        <p className="section-tag">MY ACCOUNT</p>
        <h2>Profile</h2>

        <div className="profile-card">
          {message && <p className="success-message">{message}</p>}
          {error && <p className="auth-error">{error}</p>}

          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <h3>{user?.name}</h3>
          <p>{user?.email}</p>

          {!isEditing ? (
            <>
              <div className="profile-section">
                <h4>Personal Information</h4>

                <p>
                  <strong>Name:</strong> {user?.name}
                </p>

                <p>
                  <strong>Email:</strong> {user?.email}
                </p>

                <p>
                  <strong>Phone:</strong> {displayPhone || "Not added"}
                </p>
              </div>

              <div className="profile-section">
                <h4>Saved Delivery Address</h4>

                {displayAddress ? (
                  <>
                    <p>{displayFullName}</p>
                    <p>{displayPhone}</p>
                    <p>{displayAddress}</p>
                    <p>
                      {displayCity} - {displayPincode}
                    </p>
                  </>
                ) : (
                  <p>No saved address added yet.</p>
                )}
              </div>

              <div className="profile-section">
                <h4>Recent Orders</h4>

                {orders.length === 0 ? (
                  <p>No orders yet.</p>
                ) : (
                  orders.slice(0, 3).map((order) => (
                    <div className="recent-order-row" key={order._id}>
                      <span>{order.orderNumber || order._id.slice(-6)}</span>
                      <span>{order.status}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="profile-actions">
                <button
                  className="profile-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>

                <Link to="/orders">My Orders</Link>
                <Link to="/customer-care">Customer Care</Link>
              </div>
            </>
          ) : (
            <form className="profile-edit-form" onSubmit={handleSaveProfile}>
              <div className="profile-section">
                <h4>Edit Personal Information</h4>

                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-section">
                <h4>Edit Saved Delivery Address</h4>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Receiver Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="addressPhone"
                  placeholder="Delivery Phone Number"
                  value={formData.addressPhone}
                  onChange={handleChange}
                />

                <textarea
                  name="address"
                  placeholder="Full Delivery Address"
                  value={formData.address}
                  onChange={handleChange}
                ></textarea>

                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-actions">
                <button className="profile-btn" type="submit">
                  Save Profile
                </button>

                <button
                  className="profile-cancel-btn"
                  type="button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
