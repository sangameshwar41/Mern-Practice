
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

// Get all courses
export function getAllCourses() {
    return request("/courses");
}

// Get one course by its ID
export function getCourseById(id) {
    return request(`/courses/${id}`);
}

// Create a new course
export function createCourse(courseData) {
    return request("/courses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(courseData)
    });
}

// Update an existing course
export function updateCourse(id, courseData) {
    return request(`/courses/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(courseData)
    });
}

// Delete a course
export function deleteCourse(id) {
    return request(`/courses/${id}`, {
        method: "DELETE"
    });
}
