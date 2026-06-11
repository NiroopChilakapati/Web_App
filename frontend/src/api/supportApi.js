const API_URL = "https://web-app-q19o.onrender.com/api/support";
const ADMIN_API_URL = "https://web-app-q19o.onrender.com/api/admin/support";

export const submitSupportTicket = async (ticketData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(ticketData),
  });

  return response.json();
};

export const getAllSupportTickets = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(ADMIN_API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const updateSupportTicketStatus = async (ticketId, status) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${ADMIN_API_URL}/${ticketId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  return response.json();
};

export const resolveSupportTicket = async (ticketId) => {
  return updateSupportTicketStatus(ticketId, "Resolved");
};
