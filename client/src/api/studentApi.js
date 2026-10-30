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