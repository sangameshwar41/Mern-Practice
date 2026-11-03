
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCourseById } from "../api/courseApi";

function CourseDetails() {
    const { id } = useParams();

    const [course, setCourse] = useState(null);
    const [studentCount, setStudentCount] = useState(0);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(function () {
        async function fetchCourse() {
            try {
                setLoading(true);
                setError("");

                const result = await getCourseById(id);

                setCourse(result.course);
                setStudentCount(result.studentCount || 0);
                setStudents(result.students || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchCourse();
    }, [id]);

    if (loading) {
        return <p>Loading course details...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!course) {
        return <p>Course not found.</p>;
    }

    return (
        <div className="course-details">
            <h2>Course Details</h2>

            <p>
                <strong>Course Name:</strong> {course.courseName}
            </p>

            <p>
                <strong>Course Code:</strong> {course.courseCode}
            </p>

            <p>
                <strong>Description:</strong>{" "}
                {course.description || "No description available"}
            </p>

            <p>
                <strong>Duration:</strong> {course.duration}
            </p>

            <p>
                <strong>Fee:</strong> {course.fee}
            </p>

            <p>
                <strong>Status:</strong> {course.status}
            </p>

            <p>
                <strong>Instructor:</strong>{" "}
                {course.instructor
                    ? course.instructor.instructorName
                    : "No instructor assigned"}
            </p>

            <p>
                <strong>Instructor Email:</strong>{" "}
                {course.instructor
                    ? course.instructor.email
                    : "N/A"}
            </p>

            <h3>Enrolled Students ({studentCount})</h3>

            {students.length === 0 ? (
                <p>No students are enrolled in this course.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Mobile Number</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map(function (student) {
                            return (
                                <tr key={student._id}>
                                    <td>{student.fullName}</td>
                                    <td>{student.email}</td>
                                    <td>{student.mobileNumber}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            <p>
                <Link to="/courses">Back to Courses</Link>
            </p>
        </div>
    );
}

export default CourseDetails;
