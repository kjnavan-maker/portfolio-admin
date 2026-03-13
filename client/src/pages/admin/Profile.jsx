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
    image: null,
  });

  const [currentImage, setCurrentImage] = useState("");
  const [preview, setPreview] = useState("");
  const [removeImage, setRemoveImage] = useState(false);

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
        image: null,
      });

      setCurrentImage(data.image || "");
      setPreview(data.image ? `${import.meta.env.VITE_IMAGE_BASE_URL || "https://portfolio-admin-i6v3.onrender.com"}${data.image}` : "");
      setRemoveImage(false);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setForm({
      ...form,
      image: file || null,
    });

    if (file) {
      setPreview(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const handleRemoveImage = () => {
    setForm({
      ...form,
      image: null,
    });
    setPreview("");
    setCurrentImage("");
    setRemoveImage(true);
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

      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("location", form.location);
      formData.append("bio", form.bio);
      formData.append("removeImage", removeImage);

      if (form.image) {
        formData.append("image", form.image);
      }

      const { data } = await api.put("/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setCurrentImage(data.image || "");
      setPreview(
        data.image
          ? `${import.meta.env.VITE_IMAGE_BASE_URL || "https://portfolio-admin-i6v3.onrender.com"}${data.image}`
          : ""
      );
      setRemoveImage(false);

      setForm((prev) => ({
        ...prev,
        image: null,
      }));

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

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        {preview && (
          <div className="space-y-3">
            <p className="text-sm text-slate-400">Profile Image Preview</p>
            <img
              src={preview}
              alt="Profile Preview"
              className="w-40 h-40 object-cover rounded-full border border-slate-700"
            />

            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={actionLoading}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white disabled:opacity-60"
            >
              Remove Image
            </button>
          </div>
        )}

        {!preview && currentImage && (
          <div className="space-y-3">
            <p className="text-sm text-slate-400">Current Profile Image</p>
            <img
              src={`${import.meta.env.VITE_IMAGE_BASE_URL || "https://portfolio-admin-i6v3.onrender.com"}${currentImage}`}
              alt="Current Profile"
              className="w-40 h-40 object-cover rounded-full border border-slate-700"
            />

            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={actionLoading}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white disabled:opacity-60"
            >
              Remove Image
            </button>
          </div>
        )}

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