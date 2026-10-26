import { useEffect, useState } from "react";
import { getStudentById } from "../api/studentApi";

function StudentDetails({ studentId }) {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(function () {
        async function fetchStudent() {
            try {
                setLoading(true);
                setError("");

                const result = await getStudentById(studentId);
                setStudent(result.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchStudent();
    }, [studentId]);

    if (loading) {
        return <p>Loading student details...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!student) {
        return <p>Student not found.</p>;
    }

    return (
        <div className="student-details">
            <h2>Student Details</h2>

            <p><strong>Full Name:</strong> {student.fullName}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Mobile Number:</strong> {student.mobileNumber}</p>
            <p><strong>Gender:</strong> {student.gender}</p>
            <p><strong>Course:</strong> {student.course}</p>
            <p><strong>Address:</strong> {student.address}</p>
        </div>
    );
}

export default StudentDetails;