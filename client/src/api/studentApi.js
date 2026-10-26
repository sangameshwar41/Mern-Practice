
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Reusable function for sending requests to the backend
async function request(url, options = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, options);

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
    }

    return result;
}

// Get all students
export function getAllStudents() {
    return request("/students");
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
