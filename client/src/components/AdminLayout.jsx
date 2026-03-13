import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  const navLinks = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/profile", label: "Profile" },
    { to: "/admin/projects", label: "Projects" },
    { to: "/admin/skills", label: "Skills" },
    { to: "/admin/certificates", label: "Certificates" },
    { to: "/admin/education", label: "Education" },
    { to: "/admin/messages", label: "Messages" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside className="w-64 bg-slate-900 p-6 space-y-4 border-r border-slate-800">
        <h2 className="text-2xl font-bold text-cyan-400">Admin Panel</h2>

        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded transition ${
                  active
                    ? "bg-cyan-500 text-white"
                    : "hover:bg-slate-800 text-slate-200"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="mt-4 text-left px-3 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;