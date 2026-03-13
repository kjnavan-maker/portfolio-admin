import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    level: "",
    icon: ""
  });

  const fetchSkills = async () => {
    try {
      setPageLoading(true);
      const { data } = await api.get("/skills");
      setSkills(data);
    } catch (error) {
      toast.error("Failed to fetch skills");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      level: "",
      icon: ""
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Skill name is required");
      return;
    }

    try {
      setActionLoading(true);

      const payload = {
        name: form.name.trim(),
        level: form.level.trim() || "Beginner",
        icon: form.icon.trim()
      };

      if (editingId) {
        await api.put(`/skills/${editingId}`, payload);
        toast.success("Skill updated");
      } else {
        await api.post("/skills", payload);
        toast.success("Skill added");
      }

      resetForm();
      fetchSkills();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (skill) => {
    setForm({
      name: skill.name || "",
      level: skill.level || "",
      icon: skill.icon || ""
    });

    setEditingId(skill._id);
  };

  const confirmDeleteSkill = async () => {
    if (!deleteId) return;

    try {
      setActionLoading(true);
      await api.delete(`/skills/${deleteId}`);
      toast.success("Skill deleted");
      setDeleteId(null);
      fetchSkills();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredSkills = skills.filter((skill) =>
    `${skill.name} ${skill.level} ${skill.icon}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Skills</h1>

      <input
        type="text"
        placeholder="Search skills..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-6 rounded bg-slate-800 border border-slate-700"
      />

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-6 rounded-xl border border-slate-800 mb-8 space-y-4"
      >
        <h2 className="text-2xl font-semibold">
          {editingId ? "Edit Skill" : "Add Skill"}
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Skill Name"
          value={form.name}
          onChange={handleChange}
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        <input
          type="text"
          name="level"
          placeholder="Skill Level"
          value={form.level}
          onChange={handleChange}
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        <input
          type="text"
          name="icon"
          placeholder="Icon class or URL"
          value={form.icon}
          onChange={handleChange}
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        <button
          disabled={actionLoading}
          className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded text-white font-semibold disabled:opacity-60"
        >
          {actionLoading
            ? editingId
              ? "Updating..."
              : "Adding..."
            : editingId
            ? "Update Skill"
            : "Add Skill"}
        </button>
      </form>

      {pageLoading ? (
        <LoadingSpinner text="Loading skills..." />
      ) : (
        <div className="space-y-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill._id}
              className="bg-slate-900 p-4 rounded-xl border border-slate-800"
            >
              <h2 className="text-xl font-semibold">{skill.name}</h2>
              <p className="text-slate-300">{skill.level}</p>
              {skill.icon && (
                <p className="text-slate-400 mt-2">{skill.icon}</p>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleEdit(skill)}
                  disabled={actionLoading}
                  className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-white disabled:opacity-60"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteId(skill._id)}
                  disabled={actionLoading}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredSkills.length === 0 && (
            <p className="text-slate-400">No skills found.</p>
          )}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Delete Skill"
        message="Are you sure you want to delete this skill?"
        onConfirm={confirmDeleteSkill}
        onCancel={() => setDeleteId(null)}
        loading={actionLoading}
      />
    </div>
  );
}

export default Skills;