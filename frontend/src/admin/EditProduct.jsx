import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProductById, updateProduct } from "../api/productApi";
import { uploadFiles } from "../api/uploadApi";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin = user && (user.role === "admin" || user.role === "superadmin");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    productType: "custom",
    stock: "",
    customizationFields: "",
    hamperItems: "",
  });

  const [newImage, setNewImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      const product = await getProductById(id);

      if (product._id) {
        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          image: product.image || "",
          category: product.category || "",
          productType: product.productType || "custom",
          stock: product.stock || "",
          customizationFields:
            product.customizationFields
              ?.map(
                (field) =>
                  `${field.label}|${field.type}|${
                    field.required ? "required" : "optional"
                  }`,
              )
              .join("\n") || "",
          hamperItems:
            product.hamperItems?.map((item) => item.name).join(", ") || "",
        });
      } else {
        setError(product.message || "Product not found");
      }
    };

    if (isAdmin) {
      loadProduct();
    }
  }, [id, isAdmin]);

  const parseCustomizationFields = () => {
    return formData.customizationFields
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, type, requiredStatus] = line
          .split("|")
          .map((item) => item.trim());

        return {
          label,
          type: type || "text",
          required: requiredStatus === "required",
        };
      });
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      let imageUrl = formData.image;

      if (newImage) {
        const uploaded = await uploadFiles([newImage]);

        if (!uploaded.files || uploaded.files.length === 0) {
          setError("Image upload failed");
          return;
        }

        imageUrl = uploaded.files[0];
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        image: imageUrl,
        category: formData.category || "Custom Gift",
        productType: formData.productType,
        stock: Number(formData.stock),
        soldOut: Number(formData.stock) <= 0,
        isHamper: formData.productType === "hamper",
        hamperItems:
          formData.productType === "hamper" ? parseHamperItems() : [],
        customizationFields: parseCustomizationFields(),
      };

      const data = await updateProduct(id, productData);

      if (data.product) {
        navigate("/admin/manage-stock");
      } else {
        setError(data.message || "Failed to update product");
      }
    } catch {
      setError("Something went wrong while updating product");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <>
      <Navbar />

      <section className="admin-page">
        <p className="section-tag">EDIT PRODUCT</p>
        <h2>Update Product</h2>

        <div className="admin-form-card">
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

            {formData.image && (
              <img
                src={formData.image}
                alt="Current Product"
                className="edit-preview-img"
              />
            )}

            <label className="upload-box">
              Change Product Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewImage(e.target.files[0])}
              />
            </label>

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
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

            <input
              type="number"
              name="stock"
              placeholder="Stock Count"
              value={formData.stock}
              onChange={handleChange}
              required
            />

            <textarea
              name="customizationFields"
              placeholder="Upload Photos|file|required"
              value={formData.customizationFields}
              onChange={handleChange}
              required
            ></textarea>

            {formData.productType === "hamper" && (
              <input
                type="text"
                name="hamperItems"
                placeholder="Hamper items comma separated"
                value={formData.hamperItems}
                onChange={handleChange}
              />
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Product"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
