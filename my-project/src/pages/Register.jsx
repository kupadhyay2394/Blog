import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api"; // Import the API function

export default function Register() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        fullName: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await registerUser(form); // Use the centralized API function

            if (data.success) {
                // Log in the user automatically after successful registration
                login(data.data.user, data.data.accessToken);
                navigate("/"); // Redirect to home page
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert(error.message || "Registration failed due to a network or server error.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-80"
            >
                <h2 className="text-xl font-bold mb-4">Register</h2>

                <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-2 mb-3 border rounded"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-2 mb-3 border rounded"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 mb-3 border rounded"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 mb-3 border rounded"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
                    Register
                </button>
            </form>
        </div>
    );
}