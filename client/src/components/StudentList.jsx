
import { useEffect, useState } from "react";
import {
    getAllStudents,
    deleteStudent
} from "../api/studentApi";
import { getAllCourses } from "../api/courseApi";

function StudentList({ onEdit, onView }) {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Get the logged-in user's role
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const role = user ? user.role : "viewer";

    // Check permissions
    const canEdit = role === "admin" || role === "staff";
    const canDelete = role === "admin";

    // Search and filters
    const [search, setSearch] = useState("");
    const [course, setCourse] = useState("");
    const [gender, setGender] = useState("");

    // Sorting
    const [sortBy, setSortBy] = useState("createdAt");
    const [order, setOrder] = useState("desc");

    // Pagination
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [pagination, setPagination] = useState({
        totalStudents: 0,
        currentPage: 1,
        pageSize: 10,
        totalPages: 0
    });

    // Fetch courses for the filter dropdown
    useEffect(function () {
        async function fetchCourses() {
            try {
                const result = await getAllCourses();
                setCourses(result.courses || []);
            } catch (error) {
                setError(error.message);
            }
        }

        fetchCourses();
    }, []);

    // Fetch students from the backend
    async function fetchStudents() {
        try {
            setLoading(true);
            setError("");

            const result = await getAllStudents({
                search: search,
                course: course,
                gender: gender,
                sortBy: sortBy,
                order: order,
                page: page,
                limit: limit
            });

            setStudents(result.data || []);
            setPagination(result.pagination || {
                totalStudents: 0,
                currentPage: 1,
                pageSize: limit,
                totalPages: 0
            });
        } catch (error) {
            setError(error.message);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    }

    // Fetch again when search or display options change
    useEffect(function () {
        fetchStudents();
    }, [search, course, gender, sortBy, order, page, limit]);

    // Reset pagination when search/filter/sort options change
    function handleSearchChange(value) {
        setSearch(value);
        setPage(1);
    }

    function handleCourseChange(value) {
        setCourse(value);
        setPage(1);
    }

    function handleGenderChange(value) {
        setGender(value);
        setPage(1);
    }

    function handleSortByChange(value) {
        setSortBy(value);
        setPage(1);
    }

    function handleOrderChange(value) {
        setOrder(value);
        setPage(1);
    }

    function handleLimitChange(value) {
        setLimit(Number(value));
        setPage(1);
    }

    // View the selected student's details
    function handleView(student) {
        if (typeof onView === "function") {
            onView(student._id);
        }
    }

    // Delete a student - Admin only
    async function handleDelete(studentId) {
        if (!canDelete) {
            setError("You do not have permission to delete students.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deleteStudent(studentId);
            await fetchStudents();
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className="student-list">
            <h2>Student List</h2>

            <div className="student-list-filters">
                <label>
                    Search by name or email
                    <input
                        type="text"
                        value={search}
                        onChange={function (event) {
                            handleSearchChange(event.target.value);
                        }}
                        placeholder="Enter student name or email"
                    />
                </label>

                <label>
                    Filter by course
                    <select
                        value={course}
                        onChange={function (event) {
                            handleCourseChange(event.target.value);
                        }}
                    >
                        <option value="">All Courses</option>

                        {courses.map(function (item) {
                            return (
                                <option key={item._id} value={item._id}>
                                    {item.courseName} ({item.courseCode})
                                </option>
                            );
                        })}
                    </select>
                </label>

                <label>
                    Filter by gender
                    <select
                        value={gender}
                        onChange={function (event) {
                            handleGenderChange(event.target.value);
                        }}
                    >
                        <option value="">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </label>

                <label>
                    Sort by
                    <select
                        value={sortBy}
                        onChange={function (event) {
                            handleSortByChange(event.target.value);
                        }}
                    >
                        <option value="fullName">Student Name</option>
                        <option value="createdAt">Creation Date</option>
                    </select>
                </label>

                <label>
                    Sort order
                    <select
                        value={order}
                        onChange={function (event) {
                            handleOrderChange(event.target.value);
                        }}
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </label>

                <label>
                    Students per page
                    <select
                        value={limit}
                        onChange={function (event) {
                            handleLimitChange(event.target.value);
                        }}
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </label>
            </div>

            {loading && <p>Loading students...</p>}

            {error && (
                <p className="error-message">{error}</p>
            )}

            {!loading && !error && (
                <p>
                    Total matching students: {pagination.totalStudents}
                </p>
            )}

            {!loading && !error && students.length === 0 && (
                <p>No students match your search or filters.</p>
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
                                    <td>
                                        {student.course &&
                                        typeof student.course === "object"
                                            ? student.course.courseName +
                                              " (" +
                                              student.course.courseCode +
                                              ")"
                                            : "Course unavailable"}
                                    </td>
                                    <td>{student.address}</td>

                                    <td>
                                        <button
                                            type="button"
                                            onClick={function () {
                                                handleView(student);
                                            }}
                                        >
                                            View
                                        </button>

                                        {canEdit &&
                                            typeof onEdit === "function" && (
                                                <button
                                                    type="button"
                                                    onClick={function () {
                                                        onEdit(student._id);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            )}

                                        {canDelete && (
                                            <button
                                                type="button"
                                                onClick={function () {
                                                    handleDelete(student._id);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            {!loading && !error && (
                <div className="pagination-controls">
                    <button
                        type="button"
                        disabled={page <= 1}
                        onClick={function () {
                            setPage(page - 1);
                        }}
                    >
                        Previous
                    </button>

                    <span>
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>

                    <button
                        type="button"
                        disabled={
                            page >= pagination.totalPages ||
                            pagination.totalPages === 0
                        }
                        onClick={function () {
                            setPage(page + 1);
                        }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default StudentList;
