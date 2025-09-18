import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom"; 

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
      // NOTE: This is a placeholder for the actual login logic
      const res = await fetch("http://localhost:8000/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (res.ok && data.success) {
        // Assume data.data.user and data.data.accessToken exist
        login(data.data.user, data.data.accessToken); 
        navigate("/");
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please check your network connection.");
    }
  };

  return (
    // **Enhanced outer container for a clean, full-screen look**
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        // **Modernized form container styling**
        className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-sm border border-gray-100 transform transition-all hover:shadow-3xl duration-300"
      >
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Sign In
        </h2>

        {error && (
          // **Slightly more attention-grabbing error styling**
          <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm font-medium">
            {error}
          </p>
        )}

        {/* --- Username/Email Input --- */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username or Email
          </label>
          <input
            id="username"
            type="text"
            placeholder="john.doe@example.com"
            // **Improved input field focus and styling**
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            name="username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
          />
        </div>

        {/* --- Password Input --- */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="********"
            // **Improved input field focus and styling**
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
        </div>

        {/* --- Login Button --- */}
        <button
          type="submit"
          // **Primary button styling: vibrant, shadow, hover effects**
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Login
        </button>
        
        {/* --- Register Link --- */}
        <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
                Don't have an account? 
            </span>
            <Link 
              to="/register" 
              // **Secondary link styling: less prominent than primary button**
              className="text-sm font-medium text-blue-600 hover:text-blue-700 ml-1 transition duration-150"
            >
              Register here
            </Link>
        </div>
      </form>
    </div>
  );
}