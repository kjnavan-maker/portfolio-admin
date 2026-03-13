import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/public/Home";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Projects from "./pages/admin/Projects";
import Skills from "./pages/admin/Skills";
import Certificates from "./pages/admin/Certificates";
import Education from "./pages/admin/Education";
import Messages from "./pages/admin/Messages";
import Profile from "./pages/admin/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="projects" element={<Projects />} />
          <Route path="skills" element={<Skills />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="education" element={<Education />} />
          <Route path="messages" element={<Messages />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;