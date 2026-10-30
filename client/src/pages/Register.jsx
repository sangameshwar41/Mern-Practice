import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleRegister(event) {
        event.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Registration failed"
                );
            }

            alert("Registration successful!");

            setUsername("");
            setEmail("");
            setPassword("");
        } catch (error) {
            alert(error.message);
            console.error("Registration error:", error);
        }
    }

    return (
        <div>
            <h2>Register</h2>

            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={function (event) {
                            setUsername(event.target.value);
                        }}
                        minLength={3}
                        maxLength={30}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={function (event) {
                            setEmail(event.target.value);
                        }}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={function (event) {
                            setPassword(event.target.value);
                        }}
                        minLength={8}
                        required
                    />
                </div>

                <button type="submit">Register</button>

                <p>
                    Already have an account?{" "}
                    <Link to="/login">Login here</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;