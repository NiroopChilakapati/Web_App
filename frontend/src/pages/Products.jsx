import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../api/productApi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("All");
  const [productType, setProductType] = useState("All");

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts();

      if (Array.isArray(data)) {
        setProducts(data);
      }
    };

    loadProducts();
  }, []);

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  const productTypes = [
    "All",
    "polaroid",
    "frame",
    "bouquet",
    "letterBook",
    "hamper",
    "custom",
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.description.toLowerCase().includes(searchText.toLowerCase());

    const matchesCategory = category === "All" || product.category === category;

    const matchesType =
      productType === "All" || product.productType === productType;

    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <>
      <Navbar />

      <section className="shop-page">
        <p className="section-tag">BYND BOX SHOP</p>
        <h2>Handmade Products</h2>

        <div className="shop-filters">
          <input
            type="text"
            placeholder="Search products..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
          >
            {productTypes.map((type) => (
              <option key={type} value={type}>
                {type === "All" ? "All Types" : type}
              </option>
            ))}
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="empty-cart">No products found.</p>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
