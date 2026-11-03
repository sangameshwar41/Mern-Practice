import { useState } from "react";
import { useNavigate } from "react-router-dom";

import StudentForm from "./StudentForm";
import StudentList from "./StudentList";
import StudentDetails from "./StudentDetails";

function StudentManagement() {
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedStudentId, setSelectedStudentId] = useState(null);

    const navigate = useNavigate();

    // Get the logged-in user's information
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const role = user ? user.role : "viewer";

    // Check permissions
    const canCreate = role === "admin" || role === "staff";
    const canEdit = role === "admin" || role === "staff";

    // Handle editing a student
    function handleEdit(studentId) {
        if (!canEdit) {
            return;
        }

        setEditingStudentId(studentId);
        setSelectedStudentId(null);
    }

    // Handle viewing a student
    function handleView(studentId) {
        setSelectedStudentId(studentId);
        setEditingStudentId(null);
    }

    // Handle successful student update
    function handleUpdateSuccess() {
        setEditingStudentId(null);

        setRefreshKey(function (previousKey) {
            return previousKey + 1;
        });
    }

    // Handle successful student creation
    function handleCreateSuccess() {
        setRefreshKey(function (previousKey) {
            return previousKey + 1;
        });
    }

    // Handle logout
    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    }

    return (
        <div>
            <h2>Student Management</h2>

            <p>
                Logged-in role: <strong>{role}</strong>
            </p>

            <button
                type="button"
                onClick={handleLogout}
            >
                Logout
            </button>

            {canCreate && (
                <StudentForm
                    key={editingStudentId || "new-student"}
                    studentId={editingStudentId}
                    onUpdateSuccess={handleUpdateSuccess}
                    onCreateSuccess={handleCreateSuccess}
                />
            )}

            <StudentList
                key={refreshKey}
                onEdit={canEdit ? handleEdit : undefined}
                onView={handleView}
            />

            {selectedStudentId && (
                <StudentDetails
                    studentId={selectedStudentId}
                />
            )}
        </div>
    );
}

export default StudentManagement;