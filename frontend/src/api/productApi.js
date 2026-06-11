const API_URL = "https://web-app-q19o.onrender.com/api/products";

export const getProducts = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return response.json();
};

export const getFeaturedProducts = async () => {
  const response = await fetch(`${API_URL}/featured/latest`);
  return response.json();
};

export const addProduct = async (productData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  return response.json();
};

export const updateProduct = async (id, productData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  return response.json();
};

export const updateStock = async (id, stock) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/${id}/stock`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ stock }),
  });

  return response.json();
};

export const deleteProduct = async (id) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};
