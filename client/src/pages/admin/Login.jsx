import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";

function Login() {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!form.password.trim()) {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/login", {
        username: form.username.trim(),
        password: form.password
      });

      localStorage.setItem("token", data.token);
      toast.success("Login successful");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-2xl w-full max-w-md space-y-4 border border-slate-800"
      >
        <h1 className="text-3xl font-bold text-cyan-400 text-center">
          Admin Login
        </h1>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-800 outline-none border border-slate-700 focus:border-cyan-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-800 outline-none border border-slate-700 focus:border-cyan-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 p-3 rounded font-semibold disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;