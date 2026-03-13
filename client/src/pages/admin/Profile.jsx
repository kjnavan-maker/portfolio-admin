import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";

function Profile() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });

  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      setPageLoading(true);
      const { data } = await api.get("/profile");
      setForm({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        bio: data.bio || "",
      });
    } catch (error) {
      toast.error("Failed to fetch profile");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setActionLoading(true);
      await api.put("/profile", form);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (pageLoading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Profile</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4"
      >
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        <textarea
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
          rows="4"
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        <button
          disabled={actionLoading}
          className="bg-cyan-500 px-4 py-2 rounded text-white disabled:opacity-60"
        >
          {actionLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}

export default Profile;