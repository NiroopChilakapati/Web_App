const categories = [
  "Rose Bouquet Gifts",
  "Polaroid Photo Combo",
  "Memory Letter Book",
  "Custom Scrapbook",
  "Photo Frames",
];

export default function Categories() {
  return (
    <section className="categories-section">
      <p className="section-tag">OUR HANDMADE COLLECTIONS</p>

      <h2>Crafted Gifts Made Special</h2>

      <div className="categories-grid">
        {categories.map((category) => (
          <div className="category-card" key={category}>
            <h3>{category}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
