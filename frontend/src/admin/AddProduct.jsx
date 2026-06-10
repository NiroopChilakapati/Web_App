import { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { addProduct } from "../api/productApi";
import { uploadFiles } from "../api/uploadApi";

const fieldOptions = {
  polaroid: [
    { label: "Upload Photos", type: "file", required: true },
    { label: "Number of Images", type: "number", required: true },
    { label: "Quantity", type: "number", required: true },
    { label: "Note", type: "textarea", required: false },
  ],

  frame: [
    { label: "Upload Photo / Reference Image", type: "file", required: true },
    { label: "Frame Size", type: "text", required: true },
    { label: "Message / Name", type: "text", required: false },
  ],

  bouquet: [
    { label: "Reference Image", type: "file", required: false },
    { label: "Flower Color / Theme", type: "text", required: true },
    { label: "Gift Message", type: "textarea", required: false },
  ],

  letterBook: [
    { label: "Letter Content", type: "textarea", required: true },
    { label: "Recipient Name", type: "text", required: true },
    { label: "Theme / Occasion", type: "text", required: false },
  ],

  hamper: [
    { label: "Reference Image", type: "file", required: false },
    { label: "Gift Message", type: "textarea", required: false },
    { label: "Add Frame Details", type: "text", required: false },
    { label: "Add Polaroid Notes", type: "textarea", required: false },
  ],

  custom: [
    { label: "Upload Image", type: "file", required: true },
    { label: "Quantity", type: "number", required: true },
    { label: "Gift Message", type: "textarea", required: false },
    { label: "Reference Image", type: "file", required: false },
    { label: "Special Instructions", type: "textarea", required: false },
    { label: "Theme Color", type: "text", required: false },
  ],
};

export default function AddProduct() {
  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin = user && (user.role === "admin" || user.role === "superadmin");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    productType: "custom",
    stock: "",
    hamperItems: "",
  });

  const [productImage, setProductImage] = useState(null);
  const [selectedFields, setSelectedFields] = useState(fieldOptions.custom);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "productType") {
      setFormData({
        ...formData,
        productType: value,
      });

      setSelectedFields(fieldOptions[value] || []);
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleField = (field) => {
    const exists = selectedFields.some((item) => item.label === field.label);

    if (exists) {
      setSelectedFields(
        selectedFields.filter((item) => item.label !== field.label),
      );
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const toggleRequired = (label) => {
    setSelectedFields(
      selectedFields.map((field) =>
        field.label === label ? { ...field, required: !field.required } : field,
      ),
    );
  };

  const parseHamperItems = () => {
    return formData.hamperItems
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => ({
        name: item,
        price: 0,
      }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productImage) {
      setError("Please upload product image");
      return;
    }

    if (selectedFields.length === 0) {
      setError("Please select at least one customization field");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const uploaded = await uploadFiles([productImage]);

      if (!uploaded.files || uploaded.files.length === 0) {
        setError("Image upload failed");
        return;
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        image: uploaded.files[0],
        category: formData.category || "Custom Gift",
        productType: formData.productType,
        stock: Number(formData.stock),
        soldOut: Number(formData.stock) <= 0,
        isHamper: formData.productType === "hamper",
        hamperItems:
          formData.productType === "hamper" ? parseHamperItems() : [],
        customizationFields: selectedFields,
      };

      const data = await addProduct(productData);

      if (data.product) {
        setMessage("Product added successfully");
        setError("");

        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          productType: "custom",
          stock: "",
          hamperItems: "",
        });

        setProductImage(null);
        setSelectedFields(fieldOptions.custom);
      } else {
        setError(data.message || "Failed to add product");
      }
    } catch {
      setError("Something went wrong while adding product");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="admin-page">
        <p className="section-tag">ADMIN PRODUCTS</p>
        <h2>Add New Product</h2>

        <div className="admin-form-card">
          {message && <p className="success-message">{message}</p>}
          {error && <p className="auth-error">{error}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Product Description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
            />

            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              required
            >
              <option value="custom">Custom Product</option>
              <option value="polaroid">Polaroid Prints</option>
              <option value="frame">Photo Frame</option>
              <option value="bouquet">Flower Bouquet</option>
              <option value="letterBook">Letter Book</option>
              <option value="hamper">Hamper</option>
            </select>

            <label className="upload-box">
              Upload Product Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProductImage(e.target.files[0])}
                required
              />
            </label>

            {productImage && (
              <p className="selected-file">Selected: {productImage.name}</p>
            )}

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
            />

            <input
              type="number"
              name="stock"
              placeholder="Stock Count"
              value={formData.stock}
              onChange={handleChange}
              required
            />

            <div className="field-selector">
              <h3>Select Customer Input Fields</h3>

              {(fieldOptions[formData.productType] || []).map((field) => {
                const selected = selectedFields.some(
                  (item) => item.label === field.label,
                );

                const currentField = selectedFields.find(
                  (item) => item.label === field.label,
                );

                return (
                  <div className="field-option-row" key={field.label}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleField(field)}
                      />
                      {field.label} ({field.type})
                    </label>

                    {selected && (
                      <label className="required-check">
                        <input
                          type="checkbox"
                          checked={currentField?.required || false}
                          onChange={() => toggleRequired(field.label)}
                        />
                        Required
                      </label>
                    )}
                  </div>
                );
              })}
            </div>

            {formData.productType === "hamper" && (
              <input
                type="text"
                name="hamperItems"
                placeholder="Hamper items e.g. Chocolates, Frame, Polaroid Prints, Greeting Letter"
                value={formData.hamperItems}
                onChange={handleChange}
                required
              />
            )}

            <button type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Add Product"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
