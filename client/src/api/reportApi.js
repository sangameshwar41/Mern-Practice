const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getReports() {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/reports`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Unable to load reports.");
    }

    return result;
}