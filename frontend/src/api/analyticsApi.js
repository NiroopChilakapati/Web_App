const API_URL = "https://web-app-q19o.onrender.com/api/analytics";

export const getAnalytics = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};
