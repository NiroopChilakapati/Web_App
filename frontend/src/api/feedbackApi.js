const API_URL = "https://web-app-q19o.onrender.com/api/feedback";

export const submitFeedback = async (feedbackData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(feedbackData),
  });

  return response.json();
};

export const getAllFeedback = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};
