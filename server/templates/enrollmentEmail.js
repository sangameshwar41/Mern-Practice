function enrollmentEmail(studentName, courseName) {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Enrollment Confirmation</h2>

            <p>Hello ${studentName},</p>

            <p>
                Your enrollment has been completed successfully.
            </p>

            <p>
                <strong>Student Name:</strong> ${studentName}
            </p>

            <p>
                <strong>Course Name:</strong> ${courseName}
            </p>

            <p>Thank you for choosing us!</p>

            <p>Regards,<br>Student Management System</p>
        </div>
    `;
}

module.exports = enrollmentEmail;