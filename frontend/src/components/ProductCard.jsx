import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const productId = product._id || product.id;

  return (
    <div className="product-card">
      <div className="product-img-box">
        <img src={product.image} alt={product.name} />

        {product.soldOut && <span className="sold-out-badge">Sold Out</span>}

        {product.isHamper && <span className="hamper-badge">Hamper</span>}
      </div>

      <div className="product-content">
        <h3>{product.name}</h3>
        <p>₹{product.price}</p>

        {product.soldOut ? (
          <button disabled className="disabled-btn">
            Sold Out
          </button>
        ) : (
          <Link to={`/product/${productId}`}>View & Customize</Link>
        )}
      </div>
    </div>
  );
}
