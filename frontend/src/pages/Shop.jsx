import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

export default function Shop() {
  return (
    <>
      <Navbar />

      <section className="shop-page">
        <p className="section-tag">BYND BOX SHOP</p>
        <h2>Handmade Products</h2>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
