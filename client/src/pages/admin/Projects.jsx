import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    technologies: "",
    githubLink: "",
    liveLink: "",
    year: "",
    image: null
  });

  const fetchProjects = async () => {
    try {
      setPageLoading(true);
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (error) {
      toast.error("Failed to fetch projects");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setForm({
      ...form,
      image: file || null
    });

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview("");
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      subtitle: "",
      description: "",
      technologies: "",
      githubLink: "",
      liveLink: "",
      year: "",
      image: null
    });
    setPreview("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Project title required");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Project description required");
      return;
    }

    try {
      setActionLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("subtitle", form.subtitle);
      formData.append("description", form.description);
      formData.append("technologies", form.technologies);
      formData.append("githubLink", form.githubLink);
      formData.append("liveLink", form.liveLink);
      formData.append("year", form.year);

      if (form.image) {
        formData.append("image", form.image);
      }

      if (editingId) {
        await api.put(`/projects/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Project updated");
      } else {
        await api.post("/projects", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Project added");
      }

      resetForm();
      fetchProjects();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title || "",
      subtitle: project.subtitle || "",
      description: project.description || "",
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : "",
      githubLink: project.githubLink || "",
      liveLink: project.liveLink || "",
      year: project.year || "",
      image: null
    });

    setPreview(project.image ? `http://localhost:5000${project.image}` : "");
    setEditingId(project._id);
  };

  const confirmDeleteProject = async () => {
    if (!deleteId) return;

    try {
      setActionLoading(true);
      await api.delete(`/projects/${deleteId}`);
      toast.success("Project deleted");
      setDeleteId(null);
      fetchProjects();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) =>
    `${project.title} ${project.subtitle} ${project.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Projects</h1>

      <input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-6 rounded bg-slate-800 border border-slate-700"
      />

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-6 rounded-xl border border-slate-800 mb-8 space-y-4"
      >
        <h2 className="text-2xl font-semibold">
          {editingId ? "Edit Project" : "Add Project"}
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={form.title}
          onChange={handleChange}
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        <input
          type="text"
          name="subtitle"
          placeholder="Project Subtitle"
          value={form.subtitle}
          onChange={handleChange}
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        <textarea
          name="description"
          placeholder="Project Description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        <input
          type="text"
          name="technologies"
          placeholder="React, Node, Mongo"
          value={form.technologies}
          onChange={handleChange}
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        <input
          type="text"
          name="githubLink"
          placeholder="GitHub Link"
          value={form.githubLink}
          onChange={handleChange}
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        <input
          type="text"
          name="liveLink"
          placeholder="Live Link"
          value={form.liveLink}
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

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        {preview && (
          <div className="mt-2">
            <p className="text-sm text-slate-400 mb-2">Image Preview</p>
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-28 object-cover rounded border border-slate-700"
            />
          </div>
        )}

        <button
          disabled={actionLoading}
          className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded text-white font-semibold disabled:opacity-60"
        >
          {actionLoading
            ? editingId
              ? "Updating..."
              : "Adding..."
            : editingId
            ? "Update Project"
            : "Add Project"}
        </button>
      </form>

      {pageLoading ? (
        <LoadingSpinner text="Loading projects..." />
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-slate-900 p-4 rounded-xl border border-slate-800"
            >
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <p className="text-slate-300">{project.subtitle}</p>
              <p className="text-slate-400 mt-2">{project.description}</p>

              {project.image && (
                <img
                  src={`http://localhost:5000${project.image}`}
                  alt="project"
                  className="w-40 mt-3 rounded"
                />
              )}

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleEdit(project)}
                  disabled={actionLoading}
                  className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-white disabled:opacity-60"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteId(project._id)}
                  disabled={actionLoading}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <p className="text-slate-400">No projects found.</p>
          )}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Delete Project"
        message="Are you sure you want to delete this project?"
        onConfirm={confirmDeleteProject}
        onCancel={() => setDeleteId(null)}
        loading={actionLoading}
      />
    </div>
  );
}

export default Projects;