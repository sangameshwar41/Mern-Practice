import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import StudentForm from './StudentForm';
import StudentList from './StudentList';
import StudentDetails from './StudentDetails';

function StudentManagement() {
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const navigate = useNavigate();

    function handleEdit(studentId) {
        setEditingStudentId(studentId);
    }

    function handleUpdateSuccess() {
        setEditingStudentId(null);

        setRefreshKey(function (previousKey) {
            return previousKey + 1;
        });
    }

    function handleCreateSuccess() {
        setRefreshKey(function (previousKey) {
            return previousKey + 1;
        });
    }

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        navigate('/login');
    }

    return (
        <div>
            <button onClick={handleLogout}>
                Logout
            </button>

            <StudentForm
                key={editingStudentId || 'new-student'}
                studentId={editingStudentId}
                onUpdateSuccess={handleUpdateSuccess}
                onCreateSuccess={handleCreateSuccess}
            />

            <StudentList
                key={refreshKey}
                onEdit={handleEdit}
            />

            <StudentDetails studentId="6adb609e3f1524e76169356a" />
        </div>
    );
}

export default StudentManagement;