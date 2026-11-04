import { useEffect, useState } from "react";
import {
    getStudentById,
    getStudentPhoto,
    removeStudentPhoto
} from "../api/studentApi";
import StudentDocuments from "./StudentDocuments.jsx";

function StudentDetails({ studentId }) {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [photoError, setPhotoError] = useState("");
    const [photoMessage, setPhotoMessage] = useState("");
    const [removingPhoto, setRemovingPhoto] = useState(false);

    const role = localStorage.getItem("role");
    const canManageFiles = role === "admin" || role === "staff";

    // Fetch student details
    useEffect(function () {
        async function fetchStudent() {
            try {
                setLoading(true);
                setError("");
                setStudent(null);

                const result = await getStudentById(studentId);
                setStudent(result.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        if (studentId) {
            fetchStudent();
        }
    }, [studentId]);

    // Fetch and display the student's photo
    useEffect(function () {
        let objectUrl = "";

        async function fetchPhoto() {
            setPhotoUrl("");
            setPhotoError("");

            if (!student || !student.photo) {
                return;
            }

            try {
                const photoBlob = await getStudentPhoto(student._id);
                objectUrl = URL.createObjectURL(photoBlob);
                setPhotoUrl(objectUrl);
            } catch (error) {
                setPhotoError(error.message);
            }
        }

        fetchPhoto();

        // Release the temporary image URL
        return function () {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [student]);

    // Remove the student's photo
    async function handleRemovePhoto() {
        const confirmed = window.confirm(
            "Are you sure you want to remove this student's photo?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setRemovingPhoto(true);
            setPhotoError("");
            setPhotoMessage("");

            await removeStudentPhoto(student._id);

            setStudent(function (previousStudent) {
                return {
                    ...previousStudent,
                    photo: null
                };
            });

            setPhotoUrl("");
            setPhotoMessage("Student photo removed successfully.");
        } catch (error) {
            setPhotoError(error.message);
        } finally {
            setRemovingPhoto(false);
        }
    }

    if (loading) {
        return <p>Loading student details...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!student) {
        return <p>Student not found.</p>;
    }

    return (
        <div className="student-details">
            <h2>Student Details</h2>

            <div className="student-photo-section">
                <h3>Student Photo</h3>

                {photoUrl ? (
                    <img
                        src={photoUrl}
                        alt={student.fullName + "'s photo"}
                        className="student-detail-photo"
                    />
                ) : (
                    <p>No student photo available.</p>
                )}

                {photoError && (
                    <p className="error-message">{photoError}</p>
                )}

                {photoMessage && (
                    <p className="success-message">{photoMessage}</p>
                )}

                {canManageFiles && student.photo && (
                    <button
                        type="button"
                        onClick={handleRemovePhoto}
                        disabled={removingPhoto}
                    >
                        {removingPhoto ? "Removing..." : "Remove Photo"}
                    </button>
                )}
            </div>

            <hr />

            <p>
                <strong>Full Name:</strong> {student.fullName}
            </p>

            <p>
                <strong>Email:</strong> {student.email}
            </p>

            <p>
                <strong>Mobile Number:</strong> {student.mobileNumber}
            </p>

            <p>
                <strong>Gender:</strong> {student.gender}
            </p>

            <p>
                <strong>Course:</strong>{" "}
                {student.course && typeof student.course === "object"
                    ? student.course.courseName +
                      " (" +
                      student.course.courseCode +
                      ")"
                    : "Course unavailable"}
            </p>

            <p>
                <strong>Course Duration:</strong>{" "}
                {student.course && typeof student.course === "object"
                    ? student.course.duration
                    : "N/A"}
            </p>

            <p>
                <strong>Course Fee:</strong>{" "}
                {student.course && typeof student.course === "object"
                    ? student.course.fee
                    : "N/A"}
            </p>

            <p>
                <strong>Address:</strong> {student.address}
            </p>

            <hr />

            <StudentDocuments studentId={student._id} />
        </div>
    );
}

export default StudentDetails;