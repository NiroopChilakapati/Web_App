const API_URL = "https://web-app-q19o.onrender.com/api/upload";

export const uploadFiles = async (files) => {
  const formData = new FormData();

  Array.from(files).forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  return response.json();
};
