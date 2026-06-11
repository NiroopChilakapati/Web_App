const API_URL = "https://web-app-q19o.onrender.com/api/payment";

export const createPaymentOrder = async (amount) => {
  const response = await fetch(`${API_URL}/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  });

  return response.json();
};
