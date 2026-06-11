const API_URL = "https://web-app-q19o.onrender.com/api/profile";

export const getMyProfile = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const updateMyProfile = async (profileData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  return response.json();
};
