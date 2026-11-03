import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole } from "../api/userApi";

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [updatingUserId, setUpdatingUserId] = useState(null);

    async function fetchUsers() {
        try {
            setLoading(true);
            setError("");

            const result = await getAllUsers();

            const userList = Array.isArray(result.users)
                ? result.users
                : Array.isArray(result.data)
                    ? result.data
                    : [];

            setUsers(userList);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(function () {
        fetchUsers();
    }, []);

    async function handleRoleChange(userId, newRole) {
        try {
            setError("");
            setMessage("");
            setUpdatingUserId(userId);

            await updateUserRole(userId, newRole);

            setMessage("User role updated successfully.");
            await fetchUsers();
        } catch (error) {
            setError(error.message);
        } finally {
            setUpdatingUserId(null);
        }
    }

    return (
        <div>
            <h2>User Management</h2>
            <p>View users and manage their assigned roles.</p>

            {error && <p className="error-message">{error}</p>}
            {message && <p>{message}</p>}

            {loading && <p>Loading users...</p>}

            {!loading && !error && users.length === 0 && (
                <p>No users found.</p>
            )}

            {!loading && users.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Created At</th>
                            <th>Change Role</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map(function (user) {
                            return (
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        {user.createdAt
                                            ? new Date(
                                                user.createdAt
                                            ).toLocaleDateString()
                                            : "N/A"}
                                    </td>
                                    <td>
                                        <select
                                            value={user.role}
                                            disabled={
                                                updatingUserId === user._id
                                            }
                                            onChange={function (event) {
                                                const newRole = event.target.value;

                                                if (newRole !== user.role) {
                                                    handleRoleChange(
                                                        user._id,
                                                        newRole
                                                    );
                                                }
                                            }}
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="staff">Staff</option>
                                            <option value="viewer">Viewer</option>
                                        </select>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default UserManagement;