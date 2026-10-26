
import { useState } from 'react';

import StudentForm from './StudentForm';
import StudentList from './StudentList';
import StudentDetails from './StudentDetails';

function StudentManagement() {
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    function handleEdit(studentId) {
        setEditingStudentId(studentId);
    }

    function handleUpdateSuccess() {
        setEditingStudentId(null);

        setRefreshKey(function (previousKey) {
            return previousKey + 1;
        });
    }

    return (
        <div>
            <StudentForm
                key={editingStudentId || 'new-student'}
                studentId={editingStudentId}
                onUpdateSuccess={handleUpdateSuccess}
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
