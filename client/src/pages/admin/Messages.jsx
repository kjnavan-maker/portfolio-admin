import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");

  const fetchMessages = async () => {
    try {
      setPageLoading(true);
      const { data } = await api.get("/messages");
      setMessages(data);
    } catch (error) {
      toast.error("Failed to fetch messages");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const confirmDeleteMessage = async () => {
    if (!deleteId) return;

    try {
      setActionLoading(true);
      await api.delete(`/messages/${deleteId}`);
      toast.success("Message deleted");
      setDeleteId(null);
      fetchMessages();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredMessages = messages.filter((msg) =>
    `${msg.name} ${msg.email} ${msg.subject} ${msg.message}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Contact Messages</h1>

      <input
        type="text"
        placeholder="Search messages..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-6 rounded bg-slate-800 border border-slate-700"
      />

      {pageLoading ? (
        <LoadingSpinner text="Loading messages..." />
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg._id}
              className="bg-slate-900 p-4 rounded-xl border border-slate-800"
            >
              <h2 className="text-lg font-semibold">{msg.name}</h2>
              <p className="text-slate-300">{msg.email}</p>
              <p className="text-slate-300">{msg.subject}</p>
              <p className="text-slate-400 mt-2">{msg.message}</p>

              <button
                type="button"
                onClick={() => setDeleteId(msg._id)}
                disabled={actionLoading}
                className="mt-4 bg-red-500 px-3 py-1 rounded text-white disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          ))}

          {filteredMessages.length === 0 && (
            <p className="text-slate-400">No messages found.</p>
          )}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Delete Message"
        message="Are you sure you want to delete this message?"
        onConfirm={confirmDeleteMessage}
        onCancel={() => setDeleteId(null)}
        loading={actionLoading}
      />
    </div>
  );
}

export default Messages;