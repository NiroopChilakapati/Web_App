import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartItem from "../components/CartItem";

export default function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const removeItem = (cartId) => {
    const updatedCart = cart.filter((item) => item.cartId !== cartId);

    setCart(updatedCart);

    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const proceedToCheckout = () => {
    navigate("/checkout");
  };

  return (
    <>
      <Navbar />

      <section className="cart-page">
        <p className="section-tag">YOUR CART</p>

        <h2>Customized Products</h2>

        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-list">
              {cart.map((item) => (
                <CartItem key={item.cartId} item={item} onRemove={removeItem} />
              ))}
            </div>

            <div className="cart-summary">
              <h3>Total: ₹{total}</h3>

              <button onClick={proceedToCheckout}>Proceed To Checkout</button>
            </div>
          </>
        )}
      </section>

      <Footer />
    </>
  );
}
