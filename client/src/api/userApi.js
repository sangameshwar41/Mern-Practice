const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Reusable function for sending requests to the backend
async function request(url, options = {}) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
    }

    return result;
}

// Get all users (Admin only)
export function getAllUsers() {
    return request("/users");
}

// Update a user's role (Admin only)
export function updateUserRole(userId, role) {
    return request(`/users/${userId}/role`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ role: role })
    });
}