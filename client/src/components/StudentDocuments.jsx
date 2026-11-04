
import { useState } from "react";

import {
    uploadStudentDocument,
    downloadStudentDocument,
    removeStudentDocument
} from "../api/studentApi";

function StudentDocuments({ studentId }) {
    const [documentFile, setDocumentFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleUpload() {
        if (!documentFile) {
            setError("Please select a PDF document.");
            return;
        }

        if (documentFile.type !== "application/pdf") {
            setError("Only PDF documents are allowed.");
            return;
        }

        if (documentFile.size > 5 * 1024 * 1024) {
            setError("PDF size must not exceed 5 MB.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setMessage("");

            await uploadStudentDocument(studentId, documentFile);

            setMessage("PDF uploaded successfully!");
            setDocumentFile(null);

            const fileInput = document.getElementById("student-document");

            if (fileInput) {
                fileInput.value = "";
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDownload() {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            const fileBlob = await downloadStudentDocument(studentId);
            const fileUrl = URL.createObjectURL(fileBlob);

            const link = document.createElement("a");
            link.href = fileUrl;
            link.download = "student-document.pdf";

            document.body.appendChild(link);
            link.click();
            link.remove();

            setTimeout(function () {
                URL.revokeObjectURL(fileUrl);
            }, 1000);

            setMessage("Download started.");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleRemove() {
        const confirmed = window.confirm(
            "Are you sure you want to remove this student's PDF document?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);
            setError("");
            setMessage("");

            await removeStudentDocument(studentId);

            setMessage("PDF document removed successfully!");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="form-group">
            <h3>Student Document</h3>

            <label htmlFor="student-document">
                Select PDF document
            </label>

            <input
                id="student-document"
                type="file"
                accept=".pdf,application/pdf"
                onChange={function (event) {
                    setDocumentFile(event.target.files[0] || null);
                    setError("");
                    setMessage("");
                }}
            />

            <button
                type="button"
                onClick={handleUpload}
                disabled={loading}
            >
                {loading ? "Please wait..." : "Upload PDF"}
            </button>

            <button
                type="button"
                onClick={handleDownload}
                disabled={loading}
            >
                Download PDF
            </button>

            <button
                type="button"
                onClick={handleRemove}
                disabled={loading}
            >
                Remove PDF
            </button>

            {message && (
                <p className="success-message">{message}</p>
            )}

            {error && (
                <p className="error-message">{error}</p>
            )}
        </div>
    );
}

export default StudentDocuments;
