import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  return (
    <>
      <Navbar />

      <section className="contact-page">
        <p className="section-tag">CONTACT US</p>

        <h2>Connect With BYND BOX</h2>

        <p className="contact-intro">
          Reach out to us for orders, customization queries, or collaborations.
        </p>

        <div className="contact-card">
          <h3>Contact Details</h3>

          <div className="contact-item">
            <span>Email</span>
            <p>support@byndbox.com</p>
          </div>

          <div className="contact-item">
            <span>Phone/Whatsapp</span>
            <p>+91 98765 43210</p>
          </div>

          <div className="contact-item">
            <span>Instagram</span>
            <p>@byndbox</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
