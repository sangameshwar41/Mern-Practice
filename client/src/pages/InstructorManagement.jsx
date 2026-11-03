import { useEffect, useState } from "react";
import {
    getAllInstructors,
    createInstructor,
    updateInstructor,
    deleteInstructor
} from "../api/instructorApi";

function InstructorManagement() {
    const [instructors, setInstructors] = useState([]);
    const [instructorName, setInstructorName] = useState("");
    const [email, setEmail] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [experience, setExperience] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const isAdmin = user && user.role === "admin";

    async function fetchInstructors() {
        try {
            setLoading(true);
            setError("");

            const result = await getAllInstructors();

            setInstructors(result.instructors);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(function () {
        fetchInstructors();
    }, []);

    function resetForm() {
        setInstructorName("");
        setEmail("");
        setSpecialization("");
        setExperience("");
        setEditingId(null);
    }

    function handleEdit(instructor) {
        setInstructorName(instructor.instructorName || "");
        setEmail(instructor.email || "");
        setSpecialization(instructor.specialization || "");
        setExperience(String(instructor.experience ?? ""));
        setEditingId(instructor._id);
        setError("");
        setMessage("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setError("");
            setMessage("");

            const instructorData = {
                instructorName: instructorName.trim(),
                email: email.trim(),
                specialization: specialization.trim(),
                experience: Number(experience)
            };

            if (editingId) {
                await updateInstructor(editingId, instructorData);
                setMessage("Instructor updated successfully.");
            } else {
                await createInstructor(instructorData);
                setMessage("Instructor created successfully.");
            }

            resetForm();
            await fetchInstructors();
        } catch (error) {
            setError(error.message);
        }
    }

    async function handleDelete(instructorId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this instructor?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            await deleteInstructor(instructorId);
            setMessage("Instructor deleted successfully.");

            if (editingId === instructorId) {
                resetForm();
            }

            await fetchInstructors();
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div>
            <h2>Instructor Management</h2>
            <p>View and manage instructors.</p>

            {error && <p className="error-message">{error}</p>}
            {message && <p>{message}</p>}

            {isAdmin && (
                <form onSubmit={handleSubmit}>
                    <h3>
                        {editingId ? "Edit Instructor" : "Add Instructor"}
                    </h3>

                    <div>
                        <label htmlFor="instructorName">Instructor Name</label>
                        <input
                            id="instructorName"
                            type="text"
                            value={instructorName}
                            onChange={function (event) {
                                setInstructorName(event.target.value);
                            }}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="instructorEmail">Email</label>
                        <input
                            id="instructorEmail"
                            type="email"
                            value={email}
                            onChange={function (event) {
                                setEmail(event.target.value);
                            }}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="specialization">Specialization</label>
                        <input
                            id="specialization"
                            type="text"
                            value={specialization}
                            onChange={function (event) {
                                setSpecialization(event.target.value);
                            }}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="experience">
                            Experience (years)
                        </label>
                        <input
                            id="experience"
                            type="number"
                            min="0"
                            value={experience}
                            onChange={function (event) {
                                setExperience(event.target.value);
                            }}
                            required
                        />
                    </div>

                    <button type="submit">
                        {editingId ? "Update Instructor" : "Add Instructor"}
                    </button>

                    {editingId && (
                        <button type="button" onClick={resetForm}>
                            Cancel
                        </button>
                    )}
                </form>
            )}

            {loading && <p>Loading instructors...</p>}

            {!loading && !error && instructors.length === 0 && (
                <p>No instructors found.</p>
            )}

            {!loading && instructors.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Specialization</th>
                            <th>Experience</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {instructors.map(function (instructor) {
                            return (
                                <tr key={instructor._id}>
                                    <td>{instructor.instructorName}</td>
                                    <td>{instructor.email}</td>
                                    <td>{instructor.specialization}</td>
                                    <td>{instructor.experience} years</td>

                                    {isAdmin && (
                                        <td>
                                            <button
                                                type="button"
                                                onClick={function () {
                                                    handleEdit(instructor);
                                                }}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={function () {
                                                    handleDelete(instructor._id);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default InstructorManagement;