import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/authApi";

function ResetPassword() {
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();

        setMessage("");
        setError("");

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }

        setLoading(true);

        try {
            const result = await resetPassword({
                token: token.trim(),
                newPassword: newPassword
            });

            setMessage(result.message || "Password reset successfully.");

            setToken("");
            setNewPassword("");
            setConfirmPassword("");

            // Give the user time to read the success message.
            setTimeout(function () {
                navigate("/login");
            }, 2000);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="reset-password-container">
            <h2>Reset Password</h2>

            <p>Enter the reset token and choose your new password.</p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="token">Reset Token</label>

                    <input
                        type="text"
                        id="token"
                        value={token}
                        onChange={function (event) {
                            setToken(event.target.value);
                        }}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="newPassword">New Password</label>

                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={function (event) {
                            setNewPassword(event.target.value);
                        }}
                        minLength={6}
                        required
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
                        minLength={6}
                        required
                    />
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}

                {message && <p style={{ color: "green" }}>{message}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>

            <p>
                <Link to="/login">Back to Login</Link>
            </p>
        </div>
    );
}

export default ResetPassword;