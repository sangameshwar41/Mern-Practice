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

// Get students with search, filters, sorting, and pagination
export function getAllStudents(filters = {}) {
    const queryParams = new URLSearchParams();

    if (filters.search) {
        queryParams.set("search", filters.search);
    }

    if (filters.course) {
        queryParams.set("course", filters.course);
    }

    if (filters.gender) {
        queryParams.set("gender", filters.gender);
    }

    queryParams.set("sortBy", filters.sortBy || "createdAt");
    queryParams.set("order", filters.order || "desc");
    queryParams.set("page", filters.page || 1);
    queryParams.set("limit", filters.limit || 10);

    return request(`/students?${queryParams.toString()}`);
}

// Get one student by ID
export function getStudentById(id) {
    return request(`/students/${id}`);
}

// Register a new student
export function createStudent(studentData) {
    return request("/students", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(studentData)
    });
}

// Update an existing student
export function updateStudent(id, studentData) {
    return request(`/students/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(studentData)
    });
}

// Delete a student
export function deleteStudent(id) {
    return request(`/students/${id}`, {
        method: "DELETE"
    });
}

 // Upload a student photo
export function uploadStudentPhoto(id, photoFile) {
    const formData = new FormData();

    formData.append("photo", photoFile);

    return request(`/students/${id}`, {
        method: "PATCH",
        body: formData
    });
}

// Upload a student PDF document
export function uploadStudentDocument(id, documentFile) {
    const formData = new FormData();

    formData.append("document", documentFile);

    return request(`/students/${id}/document`, {
        method: "POST",
        body: formData
    });
}

// Download a student PDF document
export async function downloadStudentDocument(id) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_BASE_URL}/students/${id}/document`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        let message = "Unable to download document";

        try {
            const result = await response.json();
            message = result.message || message;
        } catch (error) {
            // Keep the default error message if the response isn't JSON.
        }

        throw new Error(message);
    }

    return response.blob();
}
// Remove a student's photo
export function removeStudentPhoto(id) {
    return request(`/students/${id}/photo`, {
        method: "DELETE"
    });
}

// Remove a student's PDF document
export function removeStudentDocument(id) {
    return request(`/students/${id}/document`, {
        method: "DELETE"
    });
}
// Get a student's photo
export async function getStudentPhoto(id) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_BASE_URL}/students/${id}/photo`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        let message = "Unable to load student photo";

        try {
            const result = await response.json();
            message = result.message || message;
        } catch (error) {
            // Keep the default error message.
        }

        throw new Error(message);
    }

    return response.blob();
}