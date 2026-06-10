import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProducts } from "../api/productApi";
import { uploadFiles } from "../api/uploadApi";

const MAX_HAMPER_ITEMS = 5;

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [selectedHamperItems, setSelectedHamperItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [hamperExtras, setHamperExtras] = useState({
    polaroidImageCount: "",
    polaroidQuantity: "",
    polaroidNote: "",
    frameSize: "",
    frameMessage: "",
    letterRecipient: "",
    letterContent: "",
  });

  const [hamperExtraFiles, setHamperExtraFiles] = useState({
    polaroidPhotos: null,
    framePhoto: null,
  });

  useEffect(() => {
    const loadProduct = async () => {
      const data = await getProducts();

      if (Array.isArray(data)) {
        const foundProduct = data.find((item) => item._id === id);
        setProduct(foundProduct);
      }
    };

    loadProduct();
  }, [id]);

  if (!product) {
    return (
      <>
        <Navbar />
        <section className="product-details-page">
          <h2>Loading product...</h2>
        </section>
        <Footer />
      </>
    );
  }

  const fields = product.customizationFields || [];

  const hasPolaroid = selectedHamperItems.includes("Polaroid Prints");
  const hasFrame = selectedHamperItems.includes("Photo Frame");
  const hasLetter = selectedHamperItems.includes("Greeting Letter");

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (field, files) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [field]: files,
    }));
  };

  const handleHamperExtraChange = (field, value) => {
    setHamperExtras((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleHamperExtraFileChange = (field, files) => {
    setHamperExtraFiles((prev) => ({
      ...prev,
      [field]: files,
    }));
  };

  const handleHamperItemChange = (itemName) => {
    if (selectedHamperItems.includes(itemName)) {
      setSelectedHamperItems(
        selectedHamperItems.filter((item) => item !== itemName),
      );
      return;
    }

    if (selectedHamperItems.length >= MAX_HAMPER_ITEMS) {
      setError(`You can select only ${MAX_HAMPER_ITEMS} hamper items`);
      return;
    }

    setError("");
    setSelectedHamperItems([...selectedHamperItems, itemName]);
  };

  const validateRequiredFields = () => {
    for (const field of fields) {
      if (!field.required) continue;

      if (field.type === "file") {
        const files = selectedFiles[field.label];

        if (!files || files.length === 0) {
          return `${field.label} is required`;
        }
      } else if (!formData[field.label]) {
        return `${field.label} is required`;
      }
    }

    if (product.isHamper && selectedHamperItems.length !== MAX_HAMPER_ITEMS) {
      return `Please select exactly ${MAX_HAMPER_ITEMS} hamper items`;
    }

    if (product.productType === "polaroid") {
      const imageCount = Number(formData["Number of Images"]);
      const uploadedFiles = selectedFiles["Upload Photos"];

      if (
        imageCount > 0 &&
        uploadedFiles &&
        uploadedFiles.length !== imageCount
      ) {
        return `Please upload exactly ${imageCount} photo(s)`;
      }
    }

    if (hasPolaroid) {
      const count = Number(hamperExtras.polaroidImageCount);
      const files = hamperExtraFiles.polaroidPhotos;

      if (!count || count <= 0) {
        return "Number of Polaroid images is required";
      }

      if (!hamperExtras.polaroidQuantity) {
        return "Polaroid quantity is required";
      }

      if (!files || files.length === 0) {
        return "Please upload Polaroid photos";
      }

      if (files.length !== count) {
        return `Please upload exactly ${count} Polaroid photo(s)`;
      }
    }

    if (hasFrame) {
      if (
        !hamperExtraFiles.framePhoto ||
        hamperExtraFiles.framePhoto.length === 0
      ) {
        return "Please upload frame photo";
      }

      if (!hamperExtras.frameSize) {
        return "Frame size is required";
      }
    }

    if (hasLetter) {
      if (!hamperExtras.letterRecipient) {
        return "Letter recipient name is required";
      }

      if (!hamperExtras.letterContent) {
        return "Letter content is required";
      }
    }

    return "";
  };

  const uploadNormalCustomizations = async () => {
    const customizations = [];

    for (const field of fields) {
      if (field.type === "file") {
        const files = selectedFiles[field.label];

        if (files && files.length > 0) {
          const uploaded = await uploadFiles(files);

          customizations.push({
            label: field.label,
            value: `${uploaded.files.length} file(s) uploaded`,
            files: uploaded.files,
          });
        } else {
          customizations.push({
            label: field.label,
            value: "No files uploaded",
            files: [],
          });
        }
      } else {
        customizations.push({
          label: field.label,
          value: formData[field.label] || "Not provided",
        });
      }
    }

    return customizations;
  };

  const uploadHamperExtraCustomizations = async () => {
    const customizations = [];

    customizations.push({
      label: "Selected Hamper Items",
      value: selectedHamperItems.join(", "),
    });

    if (hasPolaroid) {
      const uploadedPolaroids = await uploadFiles(
        hamperExtraFiles.polaroidPhotos,
      );

      customizations.push(
        {
          label: "Hamper Polaroid Number of Images",
          value: hamperExtras.polaroidImageCount,
        },
        {
          label: "Hamper Polaroid Quantity",
          value: hamperExtras.polaroidQuantity,
        },
        {
          label: "Hamper Polaroid Note",
          value: hamperExtras.polaroidNote || "Not provided",
        },
        {
          label: "Hamper Polaroid Photos",
          value: `${uploadedPolaroids.files.length} file(s) uploaded`,
          files: uploadedPolaroids.files,
        },
      );
    }

    if (hasFrame) {
      const uploadedFrame = await uploadFiles(hamperExtraFiles.framePhoto);

      customizations.push(
        {
          label: "Hamper Frame Size",
          value: hamperExtras.frameSize,
        },
        {
          label: "Hamper Frame Message",
          value: hamperExtras.frameMessage || "Not provided",
        },
        {
          label: "Hamper Frame Photo",
          value: `${uploadedFrame.files.length} file(s) uploaded`,
          files: uploadedFrame.files,
        },
      );
    }

    if (hasLetter) {
      customizations.push(
        {
          label: "Hamper Letter Recipient",
          value: hamperExtras.letterRecipient,
        },
        {
          label: "Hamper Letter Content",
          value: hamperExtras.letterContent,
        },
      );
    }

    return customizations;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateRequiredFields();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setUploading(true);
      setError("");

      const normalCustomizations = await uploadNormalCustomizations();
      const hamperExtraCustomizations = product.isHamper
        ? await uploadHamperExtraCustomizations()
        : [];

      const cartItem = {
        cartId: crypto.randomUUID(),
        productId: product._id,
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        customizations: [...normalCustomizations, ...hamperExtraCustomizations],
      };

      const oldCart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedCart = [...oldCart, cartItem];

      localStorage.setItem("cart", JSON.stringify(updatedCart));

      navigate("/cart");
    } catch {
      setError("Something went wrong while adding product");
    } finally {
      setUploading(false);
    }
  };

  const renderField = (field) => {
    if (field.type === "file") {
      const imageCount = Number(formData["Number of Images"]) || 0;
      const isPolaroidUpload =
        product.productType === "polaroid" && field.label === "Upload Photos";

      return (
        <label className="upload-box" key={field.label}>
          {field.label} {field.required && "*"}
          {isPolaroidUpload && imageCount > 0 && (
            <span className="upload-note">
              Upload exactly {imageCount} photo(s)
            </span>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            required={field.required}
            onChange={(e) => handleFileChange(field.label, e.target.files)}
          />
        </label>
      );
    }

    if (field.type === "textarea") {
      return (
        <textarea
          key={field.label}
          placeholder={`${field.label}${field.required ? " *" : ""}`}
          required={field.required}
          onChange={(e) => handleChange(field.label, e.target.value)}
        ></textarea>
      );
    }

    return (
      <input
        key={field.label}
        type={field.type === "number" ? "number" : "text"}
        min={field.type === "number" ? "1" : undefined}
        placeholder={`${field.label}${field.required ? " *" : ""}`}
        required={field.required}
        onChange={(e) => handleChange(field.label, e.target.value)}
      />
    );
  };

  return (
    <>
      <Navbar />

      <section className="product-details-page">
        <div className="product-details-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-details-content">
          <p className="section-tag">
            {product.isHamper ? "BUILD YOUR HAMPER" : "CUSTOMIZE PRODUCT"}
          </p>

          <h2>{product.name}</h2>
          <h3>₹{product.price}</h3>

          <p>{product.description}</p>

          {error && <p className="auth-error">{error}</p>}

          {product.stock <= 0 || product.soldOut ? (
            <button className="disabled-btn" disabled>
              Sold Out
            </button>
          ) : (
            <form className="custom-form" onSubmit={handleSubmit}>
              {product.isHamper && (
                <div className="hamper-builder">
                  <h3>
                    Choose Any {MAX_HAMPER_ITEMS} Items (
                    {selectedHamperItems.length}/{MAX_HAMPER_ITEMS})
                  </h3>

                  {product.hamperItems && product.hamperItems.length > 0 ? (
                    <div className="hamper-items-grid">
                      {product.hamperItems.map((item, index) => (
                        <label className="hamper-item" key={index}>
                          <input
                            type="checkbox"
                            checked={selectedHamperItems.includes(item.name)}
                            onChange={() => handleHamperItemChange(item.name)}
                          />

                          <span>{item.name}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p>No hamper items added by admin.</p>
                  )}
                </div>
              )}

              {product.isHamper && hasPolaroid && (
                <div className="hamper-extra-section">
                  <h3>Polaroid Prints Details</h3>

                  <input
                    type="number"
                    min="1"
                    placeholder="Number of Images"
                    value={hamperExtras.polaroidImageCount}
                    onChange={(e) =>
                      handleHamperExtraChange(
                        "polaroidImageCount",
                        e.target.value,
                      )
                    }
                    required
                  />

                  <input
                    type="number"
                    min="1"
                    placeholder="Quantity"
                    value={hamperExtras.polaroidQuantity}
                    onChange={(e) =>
                      handleHamperExtraChange(
                        "polaroidQuantity",
                        e.target.value,
                      )
                    }
                    required
                  />

                  <label className="upload-box">
                    Upload Polaroid Photos *
                    {hamperExtras.polaroidImageCount && (
                      <span className="upload-note">
                        Upload exactly {hamperExtras.polaroidImageCount}{" "}
                        photo(s)
                      </span>
                    )}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        handleHamperExtraFileChange(
                          "polaroidPhotos",
                          e.target.files,
                        )
                      }
                      required
                    />
                  </label>

                  <textarea
                    placeholder="Polaroid Note"
                    value={hamperExtras.polaroidNote}
                    onChange={(e) =>
                      handleHamperExtraChange("polaroidNote", e.target.value)
                    }
                  ></textarea>
                </div>
              )}

              {product.isHamper && hasFrame && (
                <div className="hamper-extra-section">
                  <h3>Photo Frame Details</h3>

                  <label className="upload-box">
                    Upload Frame Photo *
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleHamperExtraFileChange(
                          "framePhoto",
                          e.target.files,
                        )
                      }
                      required
                    />
                  </label>

                  <input
                    type="text"
                    placeholder="Frame Size"
                    value={hamperExtras.frameSize}
                    onChange={(e) =>
                      handleHamperExtraChange("frameSize", e.target.value)
                    }
                    required
                  />

                  <input
                    type="text"
                    placeholder="Frame Message"
                    value={hamperExtras.frameMessage}
                    onChange={(e) =>
                      handleHamperExtraChange("frameMessage", e.target.value)
                    }
                  />
                </div>
              )}

              {product.isHamper && hasLetter && (
                <div className="hamper-extra-section">
                  <h3>Greeting Letter Details</h3>

                  <input
                    type="text"
                    placeholder="Recipient Name"
                    value={hamperExtras.letterRecipient}
                    onChange={(e) =>
                      handleHamperExtraChange("letterRecipient", e.target.value)
                    }
                    required
                  />

                  <textarea
                    placeholder="Letter Content"
                    value={hamperExtras.letterContent}
                    onChange={(e) =>
                      handleHamperExtraChange("letterContent", e.target.value)
                    }
                    required
                  ></textarea>
                </div>
              )}

              {fields.map((field) => renderField(field))}

              <button type="submit" disabled={uploading}>
                {uploading
                  ? "Uploading..."
                  : product.isHamper
                    ? "Add Hamper To Cart"
                    : "Add Customized Product"}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
