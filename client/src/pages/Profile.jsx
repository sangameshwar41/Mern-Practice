import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserProfile } from "../api/authApi";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(function () {
        async function fetchProfile() {
            try {
                const result = await getUserProfile();

                setUser(result.user);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, []);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>
                <Link to="/login">Go to Login</Link>
            </div>
        );
    }

    if (!user) {
        return <p>User profile not found.</p>;
    }

    return (
        <div className="profile-container">
            <h2>My Profile</h2>

            <div className="profile-details">
                <p>
                    <strong>Username:</strong> {user.username}
                </p>

                <p>
                    <strong>Email:</strong> {user.email}
                </p>
            </div>

            <Link to="/students">Back to Student Management</Link>
        </div>
    );
}

export default Profile;