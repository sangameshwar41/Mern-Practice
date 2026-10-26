
import { useEffect, useState } from "react";
import {
    getAllStudents,
    deleteStudent
} from "../api/studentApi";

function StudentList({ onEdit }) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch all students from the backend
    async function fetchStudents() {
        try {
            setLoading(true);
            setError("");

            const result = await getAllStudents();

            setStudents(result.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    // Fetch students when the component loads
    useEffect(function () {
        fetchStudents();
    }, []);

    // Delete a student
    async function handleDelete(studentId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deleteStudent(studentId);

            // Fetch the updated student list
            await fetchStudents();
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className="student-list">
            <h2>Student List</h2>

            {loading && <p>Loading students...</p>}

            {error && (
                <p className="error-message">{error}</p>
            )}

            {!loading && !error && students.length === 0 && (
                <p>No students found.</p>
            )}

            {!loading && students.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Mobile Number</th>
                            <th>Gender</th>
                            <th>Course</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map(function (student) {
                            return (
                                <tr key={student._id}>
                                    <td>{student.fullName}</td>
                                    <td>{student.email}</td>
                                    <td>{student.mobileNumber}</td>
                                    <td>{student.gender}</td>
                                    <td>{student.course}</td>
                                    <td>{student.address}</td>

                                    <td>
                                        <button
                                            type="button"
                                            onClick={function () {
                                                onEdit(student._id);
                                            }}
                                        >
                                            Edit
                                        </button>

                                        {" "}

                                        <button
                                            type="button"
                                            onClick={function () {
                                                handleDelete(student._id);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default StudentList;
