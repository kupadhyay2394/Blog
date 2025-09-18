import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate(); // ✅ Initialize useNavigate hook
  
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });

  // ✅ Single change handler for all inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch("http://localhost:8000/api/v1/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Response from server:", data);
      
      if (res.ok && data.success) { // ✅ Check both res.ok and data.success
        // Your backend returns `data.user` and `data.token`
        login(data.data.user, data.data.accessToken); // ✅ Access the correct properties
        navigate("/login"); // ✅ Redirect on success
      } else {
        alert(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed due to a network or server error.");
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
          name="username" // ✅ Add name attribute
          value={form.username}
          onChange={handleChange} // ✅ Use the single handler
        />
        <input
          type="text"
          placeholder="Full Name" // ✅ Better placeholder
          className="w-full p-2 mb-3 border rounded"
          name="fullName" // ✅ Add name attribute
          value={form.fullName}
          onChange={handleChange} // ✅ Use the single handler
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          name="email" // ✅ Add name attribute
          value={form.email}
          onChange={handleChange} // ✅ Use the single handler
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
          name="password" // ✅ Add name attribute
          value={form.password}
          onChange={handleChange} // ✅ Use the single handler
        />
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}