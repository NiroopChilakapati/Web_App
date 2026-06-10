import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { getFeaturedProducts } from "../api/productApi";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      const data = await getFeaturedProducts();

      if (Array.isArray(data)) {
        setFeaturedProducts(data);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <>
      <Navbar />

      <Hero />

      <section className="products-section">
        <h2>Featured Products</h2>

        {featuredProducts.length === 0 ? (
          <p className="empty-cart">No featured products yet.</p>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
