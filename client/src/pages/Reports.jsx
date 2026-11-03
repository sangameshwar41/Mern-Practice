import { useEffect, useState } from "react";
import { getReports } from "../api/reportApi";

function Reports() {
    const [reports, setReports] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(function () {
        async function loadReports() {
            try {
                const result = await getReports();
                setReports(result.reports);
            } catch (error) {
                setError(error.message || "Unable to load reports.");
            } finally {
                setLoading(false);
            }
        }

        loadReports();
    }, []);

    if (loading) {
        return (
            <main className="reports-page">
                <h1>Admin Reports</h1>
                <p>Loading reports...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="reports-page">
                <h1>Admin Reports</h1>
                <p role="alert">{error}</p>
            </main>
        );
    }

    return (
        <main className="reports-page">
            <h1>Admin Reports</h1>
            <p>Overview of records in the Student Management System.</p>

            <div className="reports-grid">
                <div className="report-card">
                    <h2>Total Students</h2>
                    <p>{reports.students}</p>
                </div>

                <div className="report-card">
                    <h2>Total Courses</h2>
                    <p>{reports.courses}</p>
                </div>

                <div className="report-card">
                    <h2>Total Instructors</h2>
                    <p>{reports.instructors}</p>
                </div>

                <div className="report-card">
                    <h2>Total Users</h2>
                    <p>{reports.users}</p>
                </div>
            </div>
        </main>
    );
}

export default Reports;