import { useState } from "react";
import { Link } from "react-router-dom";
import { changePassword } from "../api/authApi";

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setMessage("");
        setError("");

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }

        if (currentPassword === newPassword) {
            setError("New password must be different from the current password.");
            return;
        }

        setLoading(true);

        try {
            const result = await changePassword({
                currentPassword: currentPassword,
                newPassword: newPassword
            });

            setMessage(result.message || "Password changed successfully.");

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="change-password-container">
            <h2>Change Password</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="currentPassword">
                        Current Password
                    </label>

                    <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={function (event) {
                            setCurrentPassword(event.target.value);
                        }}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="newPassword">
                        New Password
                    </label>

                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={function (event) {
                            setNewPassword(event.target.value);
                        }}
                        required
                        minLength={6}
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword">
                        Confirm New Password
                    </label>

                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={function (event) {
                            setConfirmPassword(event.target.value);
                        }}
                        required
                        minLength={6}
                    />
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}

                {message && <p style={{ color: "green" }}>{message}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Changing Password..." : "Change Password"}
                </button>
            </form>

            <p>
                <Link to="/profile">Back to Profile</Link>
            </p>
        </div>
    );
}

export default ChangePassword;