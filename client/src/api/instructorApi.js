const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Send a request to the backend
async function request(url, options = {}) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}

// Get all instructors
export async function getAllInstructors() {
    return request("/instructors");
}

// Get one instructor by ID
export async function getInstructorById(id) {
    return request(`/instructors/${id}`);
}

// Create a new instructor
export async function createInstructor(instructorData) {
    return request("/instructors", {
        method: "POST",
        body: JSON.stringify(instructorData)
    });
}

// Update an instructor
export async function updateInstructor(id, instructorData) {
    return request(`/instructors/${id}`, {
        method: "PATCH",
        body: JSON.stringify(instructorData)
    });
}

// Delete an instructor
export async function deleteInstructor(id) {
    return request(`/instructors/${id}`, {
        method: "DELETE"
    });
}