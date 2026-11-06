
import { useEffect, useMemo, useState } from "react";
import { getReports } from "../api/reportApi";
import "./Reports.css";

function SummaryCard({ title, count, description }) {
    return (
        <div className="dashboard-card">
            <h3>{title}</h3>
            <p className="dashboard-count">{count ?? 0}</p>
            <span>{description}</span>
        </div>
    );
}

function Reports() {
    const [reports, setReports] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [courseFilter, setCourseFilter] = useState("all");

    useEffect(function () {
        async function loadReports() {
            try {
                const result = await getReports();
                setReports(result.reports);
            } catch (error) {
                setError(error.message || "Unable to load dashboard.");
            } finally {
                setLoading(false);
            }
        }

        loadReports();
    }, []);

    const filteredStudents = useMemo(function () {
        if (!reports) {
            return [];
        }

        return reports.recentStudents.filter(function (student) {
            const matchesSearch =
                student.fullName.toLowerCase().includes(search.toLowerCase()) ||
                student.email.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "all" ||
                student.enrollmentStatus === statusFilter;

            const matchesCourse =
                courseFilter === "all" ||
                student.course?._id === courseFilter;

            return matchesSearch && matchesStatus && matchesCourse;
        });
    }, [reports, search, statusFilter, courseFilter]);

    if (loading) {
        return <main className="reports-page"><h1>Dashboard</h1><p>Loading dashboard...</p></main>;
    }

    if (error) {
        return <main className="reports-page"><h1>Dashboard</h1><p role="alert">{error}</p></main>;
    }

    if (!reports) {
        return <main className="reports-page"><h1>Dashboard</h1><p>No dashboard data available.</p></main>;
    }

    const statusColors = {
        enrolled: "status-enrolled",
        completed: "status-completed",
        cancelled: "status-cancelled"
    };

    const totalStatusStudents = reports.statusDistribution.reduce(
        function (total, item) {
            return total + item.count;
        },
        0
    );

    return (
        <main className="reports-page">

            <div className="dashboard-heading">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Overview of student management activities.</p>
                </div>
            </div>

            <section className="dashboard-summary">
                <SummaryCard
                    title="Total Students"
                    count={reports.students}
                    description="Registered students"
                />

                <SummaryCard
                    title="Active Courses"
                    count={reports.activeCourses}
                    description="Currently active courses"
                />

                <SummaryCard
                    title="Total Instructors"
                    count={reports.instructors}
                    description="Registered instructors"
                />

                <SummaryCard
                    title="Total Users"
                    count={reports.users}
                    description="System users"
                />
            </section>

            <section className="dashboard-section">
                <h2>Course-wise Student Distribution</h2>

                {reports.courseDistribution.length === 0 ? (
                    <p>No course data available.</p>
                ) : (
                    <div className="distribution-list">
                        {reports.courseDistribution.map(function (course) {
                            const percentage =
                                reports.students > 0
                                    ? (course.studentCount / reports.students) * 100
                                    : 0;

                            return (
                                <div className="distribution-item" key={course.courseCode}>
                                    <div className="distribution-info">
                                        <span>
                                            {course.courseName} ({course.courseCode})
                                        </span>
                                        <strong>{course.studentCount} students</strong>
                                    </div>

                                    <div className="bar-background">
                                        <div
                                            className="course-bar"
                                            style={{ width: percentage + "%" }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <section className="dashboard-section">
                <h2>Enrollment Status Distribution</h2>

                {totalStatusStudents === 0 ? (
                    <p>No enrollment records available.</p>
                ) : (
                    <div className="status-list">
                        {reports.statusDistribution.map(function (item) {
                            const percentage =
                                (item.count / totalStatusStudents) * 100;

                            return (
                                <div className="status-item" key={item.status}>
                                    <div className="distribution-info">
                                        <span className={statusColors[item.status] || ""}>
                                            {item.status}
                                        </span>
                                        <strong>{item.count} ({percentage.toFixed(1)}%)</strong>
                                    </div>
                                    <div className="bar-background">
                                        <div
                                            className={"status-bar " + (statusColors[item.status] || "")}
                                            style={{ width: percentage + "%" }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <section className="dashboard-section">
                <h2>Recently Registered Students</h2>

                <div className="report-filters">
                    <input
                        type="text"
                        placeholder="Search student name or email"
                        value={search}
                        onChange={function (event) {
                            setSearch(event.target.value);
                        }}
                    />

                    <select
                        value={statusFilter}
                        onChange={function (event) {
                            setStatusFilter(event.target.value);
                        }}
                    >
                        <option value="all">All Statuses</option>
                        <option value="enrolled">Enrolled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <select
                        value={courseFilter}
                        onChange={function (event) {
                            setCourseFilter(event.target.value);
                        }}
                    >
                        <option value="all">All Courses</option>
                        {reports.courseDistribution.map(function (course) {
                            return (
                                <option
                                    key={course.courseCode}
                                    value={course._id}
                                >
                                    {course.courseName}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="table-container">
                    <table className="recent-students-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Email</th>
                                <th>Course</th>
                                <th>Status</th>
                                <th>Registered Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="5">No students found.</td>
                                </tr>
                            ) : (
                                filteredStudents.map(function (student) {
                                    return (
                                        <tr key={student._id}>
                                            <td>{student.fullName}</td>
                                            <td>{student.email}</td>
                                            <td>
                                                {student.course?.courseName || "N/A"}
                                            </td>
                                            <td>
                                                <span className={
                                                    "student-status " +
                                                    (statusColors[student.enrollmentStatus] || "")
                                                }>
                                                    {student.enrollmentStatus}
                                                </span>
                                            </td>
                                            <td>
                                                {new Date(student.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

        </main>
    );
}

export default Reports;
