const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Reusable function for authentication requests
async function authRequest(url, options = {}, requiresToken = false) {
    const headers = {
        ...options.headers
    };

    // Add the JWT token for protected requests
    if (requiresToken) {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Please log in first.");
        }

        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: headers
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Authentication request failed"
        );
    }

    return result;
}

// Register a new user
export function registerUser(userData) {
    return authRequest("/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });
}

// Log in an existing user
export function loginUser(credentials) {
    return authRequest("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    });
}

// Get the logged-in user's profile
export function getUserProfile() {
    return authRequest("/auth/profile", {
        method: "GET"
    }, true);
}

// Change the logged-in user's password
export function changePassword(passwordData) {
    return authRequest("/auth/change-password", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(passwordData)
    }, true);
}

// Request password-reset instructions
export function forgotPassword(email) {
    return authRequest("/auth/forgot-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email
        })
    });
}

// Reset password using a reset token
export function resetPassword(resetData) {
    return authRequest("/auth/reset-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(resetData)
    });
}