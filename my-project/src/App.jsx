// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PostDetails from "./pages/PostDetails";
import UpdateBlog from "./pages/UpdateBlog";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <AuthProvider>
      {/* ✅ Fix: BrowserRouter must wrap all components that use routing features (like Navbar's Links).
        Move Navbar inside BrowserRouter.
      */}
      <BrowserRouter>
        <Navbar /> 
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/createPost"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/PostDetails/:id" 
            element={
              <ProtectedRoute>
                <PostDetails/>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/UpdateBlog/:id" 
            element={
              <ProtectedRoute>
                <UpdateBlog/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}