import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function handleLogin(event) {
        event.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Login failed");
            }

            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));

            setEmail("");
            setPassword("");

            navigate("/students");
        } catch (error) {
            alert(error.message);
            console.error("Login error:", error);
        }
    }

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="login-email">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={function (event) {
                            setEmail(event.target.value);
                        }}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="login-password">Password</label>
                    <input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={function (event) {
                            setPassword(event.target.value);
                        }}
                        required
                    />
                </div>

                <button type="submit">Login</button>
            </form>

            <p>
                Don't have an account?{" "}
                <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}

export default Login;