import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { getProducts, updateStock, deleteProduct } from "../api/productApi";

export default function ManageStock() {
  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin = user && (user.role === "admin" || user.role === "superadmin");

  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts();

      if (Array.isArray(data)) {
        setProducts(data);
      }
    };

    loadProducts();
  }, []);

  const handleStockUpdate = async (id, stock) => {
    const data = await updateStock(id, Number(stock));

    if (data._id) {
      setProducts((prev) =>
        prev.map((item) => (item._id === id ? data : item)),
      );

      setMessage("Stock updated successfully");
      setError("");
    } else {
      setError(data.message || "Failed to update stock");
      setMessage("");
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    const data = await deleteProduct(id);

    if (data.productId) {
      setProducts((prev) => prev.filter((item) => item._id !== id));
      setMessage("Product deleted successfully");
      setError("");
    } else {
      setError(data.message || "Failed to delete product");
      setMessage("");
    }
  };

  if (!isAdmin) {
    return (
      <>
        <Navbar />

        <section className="admin-page">
          <h2>Access Denied</h2>
        </section>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="admin-page">
        <p className="section-tag">PRODUCT STOCK</p>

        <h2>Manage Stock</h2>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="auth-error">{error}</p>}

        <div className="stock-grid">
          {products.map((product) => (
            <div className="stock-card" key={product._id}>
              <img src={product.image} alt={product.name} />

              <h3>{product.name}</h3>

              <p>
                Current Stock:
                <strong> {product.stock}</strong>
              </p>

              <p>
                Status:
                <strong> {product.soldOut ? "Sold Out" : "Available"}</strong>
              </p>

              <input
                type="number"
                min="0"
                defaultValue={product.stock}
                onBlur={(e) => handleStockUpdate(product._id, e.target.value)}
              />

              <div className="product-admin-actions">
                <Link
                  to={`/admin/edit-product/${product._id}`}
                  className="edit-product-btn"
                >
                  Edit Product
                </Link>

                <button
                  className="delete-product-btn"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  Delete Product
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
