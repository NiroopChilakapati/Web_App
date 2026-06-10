const API_URL = "http://localhost:5000/api/analytics";

export const getAnalytics = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};
