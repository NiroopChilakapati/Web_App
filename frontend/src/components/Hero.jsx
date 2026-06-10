import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">
      <div className="overlay"></div>

      <div className="hero-content">
        <p className="tagline">BYND THE ORDINARY INTO THE EXTRAORDINARY</p>

        <h1>
          Handmade Gifts <br />
          Crafted With Love
        </h1>

        <p className="hero-description">
          Personalized handmade gifts made with photos, messages, memories, and
          love.
        </p>

        <Link to="/shop" className="primary-btn">
          Shop Now
        </Link>
      </div>
    </section>
  );
}
