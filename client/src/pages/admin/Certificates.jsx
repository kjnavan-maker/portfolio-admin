import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";

function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    title: "",
    issuer: "",
    date: "",
    credentialLink: "",
    image: null
  });

  const fetchCertificates = async () => {
    try {
      setPageLoading(true);
      const { data } = await api.get("/certificates");
      setCertificates(data);
    } catch (error) {
      toast.error("Failed to fetch certificates");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
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
      issuer: "",
      date: "",
      credentialLink: "",
      image: null
    });
    setPreview("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Certificate title required");
      return;
    }

    if (!form.issuer.trim()) {
      toast.error("Issuer is required");
      return;
    }

    try {
      setActionLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("issuer", form.issuer);
      formData.append("date", form.date);
      formData.append("credentialLink", form.credentialLink);

      if (form.image) {
        formData.append("image", form.image);
      }

      if (editingId) {
        await api.put(`/certificates/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Certificate updated");
      } else {
        await api.post("/certificates", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Certificate added");
      }

      resetForm();
      fetchCertificates();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (certificate) => {
    setForm({
      title: certificate.title || "",
      issuer: certificate.issuer || "",
      date: certificate.date || "",
      credentialLink: certificate.credentialLink || "",
      image: null
    });

    setPreview(
      certificate.image ? `http://localhost:5000${certificate.image}` : ""
    );
    setEditingId(certificate._id);
  };

  const confirmDeleteCertificate = async () => {
    if (!deleteId) return;

    try {
      setActionLoading(true);
      await api.delete(`/certificates/${deleteId}`);
      toast.success("Certificate deleted");
      setDeleteId(null);
      fetchCertificates();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredCertificates = certificates.filter((certificate) =>
    `${certificate.title} ${certificate.issuer} ${certificate.date}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Certificates</h1>

      <input
        type="text"
        placeholder="Search certificates..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-6 rounded bg-slate-800 border border-slate-700"
      />

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-6 rounded-xl border border-slate-800 mb-8 space-y-4"
      >
        <h2 className="text-2xl font-semibold">
          {editingId ? "Edit Certificate" : "Add Certificate"}
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Certificate Title"
          value={form.title}
          onChange={handleChange}
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        <input
          type="text"
          name="issuer"
          placeholder="Issuer"
          value={form.issuer}
          onChange={handleChange}
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        <input
          type="text"
          name="date"
          placeholder="Date"
          value={form.date}
          onChange={handleChange}
          disabled={actionLoading}
          className="w-full p-3 rounded bg-slate-800 disabled:opacity-60"
        />

        <input
          type="text"
          name="credentialLink"
          placeholder="Credential Link"
          value={form.credentialLink}
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
            ? "Update Certificate"
            : "Add Certificate"}
        </button>
      </form>

      {pageLoading ? (
        <LoadingSpinner text="Loading certificates..." />
      ) : (
        <div className="space-y-4">
          {filteredCertificates.map((certificate) => (
            <div
              key={certificate._id}
              className="bg-slate-900 p-4 rounded-xl border border-slate-800"
            >
              <h2 className="text-xl font-semibold">{certificate.title}</h2>
              <p className="text-slate-300">{certificate.issuer}</p>
              <p className="text-slate-400 mt-2">{certificate.date}</p>

              {certificate.image && (
                <img
                  src={`http://localhost:5000${certificate.image}`}
                  alt="certificate"
                  className="w-40 mt-3 rounded"
                />
              )}

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleEdit(certificate)}
                  disabled={actionLoading}
                  className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-white disabled:opacity-60"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteId(certificate._id)}
                  disabled={actionLoading}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredCertificates.length === 0 && (
            <p className="text-slate-400">No certificates found.</p>
          )}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Delete Certificate"
        message="Are you sure you want to delete this certificate?"
        onConfirm={confirmDeleteCertificate}
        onCancel={() => setDeleteId(null)}
        loading={actionLoading}
      />
    </div>
  );
}

export default Certificates;