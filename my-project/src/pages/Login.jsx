import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api"; // Import the API function

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const data = await loginUser(form); // Use the centralized API function

            if (data.success) {
                login(data.data.user, data.data.accessToken);
                navigate("/");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.message || "Something went wrong. Please check your network connection.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-sm border border-gray-100 transform transition-all hover:shadow-3xl duration-300"
            >
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
                    Sign In
                </h2>

                {error && (
                    <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm font-medium">
                        {error}
                    </p>
                )}

                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Username or Email
                    </label>
                    <input
                        id="username"
                        type="text"
                        placeholder="john.doe@example.com"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        autoComplete="username"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="********"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Login
                </button>

                <div className="mt-6 text-center">
                    <span className="text-sm text-gray-600">
                        Don't have an account?
                    </span>
                    <Link
                        to="/register"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 ml-1 transition duration-150"
                    >
                        Register here
                    </Link>
                </div>
            </form>
        </div>
    );
}