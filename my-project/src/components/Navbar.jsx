import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <nav className="bg-indigo-600 shadow-xl sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to="/" className="text-2xl font-extrabold text-white tracking-wider hover:text-indigo-200 transition duration-200">
            BlogApp
          </Link>

          {/* Navigation and Auth Links */}
          <div className="flex items-center space-x-6">
            
            {/* Main Nav Links (Visible to all) */}
            <Link 
              to="/" 
              className="text-white hover:text-indigo-200 font-medium transition duration-200"
            >
              Home
            </Link>

            {/* Create Post Link (Only visible when logged in) */}
            {token && (
              <Link 
                // Fix: Assuming the path is '/createPost' based on App.jsx, not '/create'
                to="/createPost" 
                className="bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-indigo-800 transition duration-200"
              >
                + Post
              </Link>
            )}

            {/* Authentication Status / Links */}
            {!token ? (
              // Not Logged In
              <>
                <Link 
                  to="/login" 
                  className="text-white hover:text-indigo-200 font-medium transition duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-indigo-600 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-gray-100 transition duration-200"
                >
                  Register
                </Link>
              </>
            ) : (
              // Logged In
              <div className="flex items-center space-x-4">
                <span className="text-sm font-light text-indigo-200 hidden sm:block">
                  Welcome, <strong className="font-semibold">{user?.name ?? "User"}</strong>
                </span>
                <button 
                  onClick={handleLogout} 
                  className="text-sm font-medium text-red-300 hover:text-red-100 transition duration-200 hover:underline"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}