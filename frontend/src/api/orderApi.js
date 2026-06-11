const API_URL = "https://web-app-q19o.onrender.com/api/orders";

export const placeOrder = async (orderData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  return response.json();
};

export const getMyOrders = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/my-orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};
