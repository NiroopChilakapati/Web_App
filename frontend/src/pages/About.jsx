import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Navbar />

      <section className="about-page">
        <p className="section-tag">ABOUT BYND BOX</p>

        <h2>Handmade Gifts With Personal Meaning</h2>

        <p>
          BYND BOX is a handmade gifting brand created to turn simple moments
          into memorable keepsakes. Every product is crafted with care,
          creativity, and love.
        </p>

        <p>
          From rose bouquets and polaroid combos to memory letters, scrapbooks,
          and custom photo frames, our products are designed to be personalized
          according to your photos, messages, themes, and special instructions.
        </p>

        <div className="about-cards">
          <div>
            <h3>Handmade</h3>
            <p>Every product is carefully made with a personal touch.</p>
          </div>

          <div>
            <h3>Customizable</h3>
            <p>Customers can add photos, messages, names, and themes.</p>
          </div>

          <div>
            <h3>Meaningful</h3>
            <p>We create gifts that feel emotional, premium, and memorable.</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
