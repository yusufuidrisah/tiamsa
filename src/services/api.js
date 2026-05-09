const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:4001/api";

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch (error) {
    throw new Error(
      "Cannot reach the API server on http://localhost:4001. Start the FastAPI backend and try again.",
    );
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const studentsApi = {
  list: () => request("/students"),
  create: (payload) =>
    request("/students", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (regNo, payload) =>
    request(`/students/${encodeURIComponent(regNo)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  updateStatus: (regNo, status) =>
    request(`/students/${encodeURIComponent(regNo)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  remove: (regNo) =>
    request(`/students/${encodeURIComponent(regNo)}`, {
      method: "DELETE",
    }),
  bulkUpdateStatus: (regNos, status) =>
    request("/students/bulk-status", {
      method: "POST",
      body: JSON.stringify({ regNos, status }),
    }),
  bulkDelete: (regNos) =>
    request("/students/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ regNos }),
    }),
};

export const announcementsApi = {
  list: () => request("/announcements"),
  create: (payload) =>
    request("/announcements", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    request(`/announcements/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  remove: (id) =>
    request(`/announcements/${id}`, {
      method: "DELETE",
    }),
  bulkDelete: (ids) =>
    request("/announcements/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
    }),
};
