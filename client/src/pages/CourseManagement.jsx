
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getAllCourses,
    createCourse,
    updateCourse,
    deleteCourse
} from "../api/courseApi";

import { getAllInstructors } from "../api/instructorApi";

function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);

    const [courseName, setCourseName] = useState("");
    const [courseCode, setCourseCode] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState("");
    const [fee, setFee] = useState("");
    const [status, setStatus] = useState("active");
    const [instructor, setInstructor] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const isAdmin = user && user.role === "admin";

    async function fetchCourses() {
        try {
            setLoading(true);
            setError("");

            const result = await getAllCourses();
            setCourses(result.courses || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function fetchInstructors() {
        try {
            const result = await getAllInstructors();
            setInstructors(result.instructors || []);
        } catch (error) {
            setError(error.message);
        }
    }

    useEffect(function () {
        fetchCourses();
        fetchInstructors();
    }, []);

    function resetForm() {
        setCourseName("");
        setCourseCode("");
        setDescription("");
        setDuration("");
        setFee("");
        setStatus("active");
        setInstructor("");
        setEditingId(null);
    }

    function handleEdit(course) {
        setCourseName(course.courseName || "");
        setCourseCode(course.courseCode || "");
        setDescription(course.description || "");
        setDuration(course.duration || "");
        setFee(String(course.fee ?? ""));
        setStatus(course.status || "active");
        setInstructor(course.instructor?._id || "");
        setEditingId(course._id);
        setError("");
        setMessage("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setError("");
            setMessage("");

            const courseData = {
                courseName: courseName.trim(),
                courseCode: courseCode.trim().toUpperCase(),
                description: description.trim(),
                duration: duration.trim(),
                fee: Number(fee),
                status: status,
                instructor: instructor || null
            };

            if (editingId) {
                await updateCourse(editingId, courseData);
                setMessage("Course updated successfully.");
            } else {
                await createCourse(courseData);
                setMessage("Course created successfully.");
            }

            resetForm();
            await fetchCourses();
        } catch (error) {
            setError(error.message);
        }
    }

    async function handleDelete(courseId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this course? Courses with enrolled students cannot be deleted."
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            await deleteCourse(courseId);
            setMessage("Course deleted successfully.");

            if (editingId === courseId) {
                resetForm();
            }

            await fetchCourses();
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div>
            <h2>Course Management</h2>

            <p>
                Manage courses offered by the Student Management System.
            </p>

            {error && (
                <p className="error-message">{error}</p>
            )}

            {message && <p>{message}</p>}

            {isAdmin && (
                <form onSubmit={handleSubmit}>
                    <h3>
                        {editingId ? "Edit Course" : "Add Course"}
                    </h3>

                    <div>
                        <label htmlFor="courseName">
                            Course Name
                        </label>

                        <input
                            id="courseName"
                            type="text"
                            value={courseName}
                            onChange={function (event) {
                                setCourseName(event.target.value);
                            }}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="courseCode">
                            Course Code
                        </label>

                        <input
                            id="courseCode"
                            type="text"
                            value={courseCode}
                            onChange={function (event) {
                                setCourseCode(event.target.value);
                            }}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description">
                            Description
                        </label>

                        <textarea
                            id="description"
                            value={description}
                            onChange={function (event) {
                                setDescription(event.target.value);
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor="duration">
                            Duration
                        </label>

                        <input
                            id="duration"
                            type="text"
                            value={duration}
                            onChange={function (event) {
                                setDuration(event.target.value);
                            }}
                            placeholder="Example: 6 months"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="fee">Fee</label>

                        <input
                            id="fee"
                            type="number"
                            min="0"
                            step="0.01"
                            value={fee}
                            onChange={function (event) {
                                setFee(event.target.value);
                            }}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="status">Status</label>

                        <select
                            id="status"
                            value={status}
                            onChange={function (event) {
                                setStatus(event.target.value);
                            }}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="instructor">
                            Instructor
                        </label>

                        <select
                            id="instructor"
                            value={instructor}
                            onChange={function (event) {
                                setInstructor(event.target.value);
                            }}
                        >
                            <option value="">Not assigned</option>

                            {instructors.map(function (item) {
                                return (
                                    <option
                                        key={item._id}
                                        value={item._id}
                                    >
                                        {item.instructorName}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <button type="submit">
                        {editingId ? "Update Course" : "Add Course"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>
                    )}
                </form>
            )}

            {loading && <p>Loading courses...</p>}

            {!loading && !error && courses.length === 0 && (
                <p>No courses found.</p>
            )}

            {!loading && courses.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Course Code</th>
                            <th>Description</th>
                            <th>Duration</th>
                            <th>Fee</th>
                            <th>Status</th>
                            <th>Instructor</th>
                            <th>Enrolled Students</th>
                            <th>Details</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {courses.map(function (course) {
                            return (
                                <tr key={course._id}>
                                    <td>{course.courseName}</td>
                                    <td>{course.courseCode}</td>
                                    <td>{course.description || "N/A"}</td>
                                    <td>{course.duration}</td>
                                    <td>{course.fee}</td>
                                    <td>{course.status}</td>

                                    <td>
                                        {course.instructor
                                            ? course.instructor.instructorName
                                            : "Not assigned"}
                                    </td>

                                    <td>{course.studentCount ?? 0}</td>

                                    <td>
                                        <Link to={`/courses/${course._id}`}>
                                            View Details
                                        </Link>
                                    </td>

                                    {isAdmin && (
                                        <td>
                                            <button
                                                type="button"
                                                onClick={function () {
                                                    handleEdit(course);
                                                }}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={function () {
                                                    handleDelete(course._id);
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

export default CourseManagement;
