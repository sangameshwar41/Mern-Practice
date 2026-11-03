
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/authApi";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const result = await forgotPassword(email);

            setMessage(
                result.message ||
                "If the account exists, reset instructions will be provided."
            );

            setEmail("");

            navigate("/reset-password");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="forgot-password-container">
            <h2>Forgot Password</h2>

            <p>
                Enter your registered email address to request a password reset.
            </p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email Address</label>

                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={function (event) {
                            setEmail(event.target.value);
                        }}
                        required
                    />
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}
                {message && <p style={{ color: "green" }}>{message}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Request Password Reset"}
                </button>
            </form>

            <p>
                <Link to="/login">Back to Login</Link>
            </p>
        </div>
    );
}

export default ForgotPassword;
