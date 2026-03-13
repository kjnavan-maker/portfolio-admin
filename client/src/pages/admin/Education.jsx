import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";

function Education() {
  const [education, setEducation] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    title: "",
    institution: "",
    year: "",
    description: ""
  });

  const fetchEducation = async () => {
    try {
      setPageLoading(true);
      const { data } = await api.get("/education");
      setEducation(data);
    } catch (error) {
      toast.error("Failed to fetch education");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      institution: "",
      year: "",
      description: ""
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Education title required");
      return;
    }

    if (!form.institution.trim()) {
      toast.error("Institution is required");
      return;
    }

    try {
      setActionLoading(true);

      if (editingId) {
        await api.put(`/education/${editingId}`, form);
        toast.success("Education updated");
      } else {
        await api.post("/education", form);
        toast.success("Education added");
      }

      resetForm();
      fetchEducation();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title || "",
      institution: item.institution || "",
      year: item.year || "",
      description: item.description || ""
    });

    setEditingId(item._id);
  };

  const confirmDeleteEducation = async () => {
    if (!deleteId) return;

    try {
      setActionLoading(true);
      await api.delete(`/education/${deleteId}`);
      toast.success("Education deleted");
      setDeleteId(null);
      fetchEducation();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredEducation = education.filter((item) =>
    `${item.title} ${item.institution} ${item.year}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Education</h1>

      <input
        type="text"
        placeholder="Search education..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-6 rounded bg-slate-800 border border-slate-700"
      />

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-6 rounded-xl border border-slate-800 mb-8 space-y-4"
      >
        <h2 className="text-2xl font-semibold">
          {editingId ? "Edit Education" : "Add Education"}
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Education Title"
          value={form.title}
          onChange={handleChange}
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        <input
          type="text"
          name="institution"
          placeholder="Institution"
          value={form.institution}
          onChange={handleChange}
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        <input
          type="text"
          name="year"
          placeholder="Year"
          value={form.year}
          onChange={handleChange}
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        <button
          disabled={actionLoading}
          className="bg-cyan-500 px-4 py-2 rounded text-white disabled:opacity-60"
        >
          {actionLoading
            ? editingId
              ? "Updating..."
              : "Adding..."
            : editingId
            ? "Update Education"
            : "Add Education"}
        </button>
      </form>

      {pageLoading ? (
        <LoadingSpinner text="Loading education..." />
      ) : (
        <div className="space-y-4">
          {filteredEducation.map((item) => (
            <div
              key={item._id}
              className="bg-slate-900 p-4 rounded-xl border border-slate-800"
            >
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-slate-300">{item.institution}</p>
              <p className="text-slate-400">{item.year}</p>
              <p className="text-slate-400 mt-2">{item.description}</p>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleEdit(item)}
                  disabled={actionLoading}
                  className="bg-yellow-500 px-3 py-1 rounded text-white disabled:opacity-60"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteId(item._id)}
                  disabled={actionLoading}
                  className="bg-red-500 px-3 py-1 rounded text-white disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredEducation.length === 0 && (
            <p className="text-slate-400">No education records found.</p>
          )}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Delete Education"
        message="Are you sure you want to delete this education?"
        onConfirm={confirmDeleteEducation}
        onCancel={() => setDeleteId(null)}
        loading={actionLoading}
      />
    </div>
  );
}

export default Education;