import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Pin,
  PinOff,
  Pencil,
  Trash2,
  Bell,
  AlertTriangle,
  Calendar,
  Wrench,
  CreditCard,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { noticeService } from "../../services/notice.service";

const TYPES = [
  { value: "general", label: "General", icon: Bell },
  { value: "emergency", label: "Emergency", icon: AlertTriangle },
  { value: "event", label: "Event", icon: Calendar },
  { value: "maintenance", label: "Maintenance", icon: Wrench },
  { value: "payment", label: "Payment", icon: CreditCard },
  { value: "meeting", label: "Meeting", icon: Users },
];

const PRIORITIES = ["low", "normal", "high", "urgent"];

const TYPE_CONFIG = {
  general: { color: "#6366f1", bg: "#eef2ff" },
  emergency: { color: "#ef4444", bg: "#fef2f2" },
  event: { color: "#8b5cf6", bg: "#f5f3ff" },
  maintenance: { color: "#f59e0b", bg: "#fffbeb" },
  payment: { color: "#10b981", bg: "#ecfdf5" },
  meeting: { color: "#0ea5e9", bg: "#f0f9ff" },
};

const PRIORITY_COLORS = {
  low: "#9ca3af",
  normal: "#6366f1",
  high: "#f59e0b",
  urgent: "#ef4444",
};

export default function ManageNoticesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const { data: res, isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: () => noticeService.getNotices({ limit: 100 }),
  });

  const notices = res?.data?.notices || [];

  const { mutate: deleteNotice } = useMutation({
    mutationFn: (id) => noticeService.deleteNotice(id),
    onSuccess: () => {
      toast.success("Notice deleted");
      queryClient.invalidateQueries(["notices"]);
    },
    onError: () => toast.error("Failed to delete"),
  });

  const { mutate: togglePin } = useMutation({
    mutationFn: (id) => noticeService.togglePin(id),
    onSuccess: (res) => {
      const pinned = res?.data?.isPinned;
      toast.success(pinned ? "Notice pinned 📌" : "Notice unpinned");
      queryClient.invalidateQueries(["notices"]);
    },
    onError: () => toast.error("Failed to update pin"),
  });

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this notice? This cannot be undone."))
      deleteNotice(id);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Notices</h1>
          <p className="text-slate-500 text-sm mt-1">
            Publish and manage society announcements
          </p>
        </div>
        <button
          onClick={() => {
            setEditingNotice(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary shadow-lg shadow-indigo-200 w-full sm:w-auto"
        >
          <Plus size={18} /> New Notice
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-slate-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : notices.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <Bell size={36} className="mx-auto mb-3 text-slate-300" />
          <h3 className="font-bold text-slate-900 mb-2">
            No notices published yet
          </h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary mt-2"
          >
            <Plus size={16} /> Post First Notice
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => {
            const typeCfg = TYPE_CONFIG[notice.type] || TYPE_CONFIG.general;
            const typeInfo = TYPES.find((t) => t.value === notice.type);
            const TypeIcon = typeInfo?.icon || Bell;
            return (
              <motion.div
                key={notice._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start gap-4 hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: typeCfg.bg }}
                >
                  <TypeIcon size={18} style={{ color: typeCfg.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 truncate">
                      {notice.title}
                    </h3>
                    {notice.isPinned && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">
                        <Pin size={9} /> Pinned
                      </span>
                    )}
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: `${PRIORITY_COLORS[notice.priority]}15`,
                        color: PRIORITY_COLORS[notice.priority],
                      }}
                    >
                      {notice.priority}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-2">
                    {notice.content}
                  </p>
                  <div className="text-xs text-slate-400">
                    {format(new Date(notice.createdAt), "MMM d, yyyy · h:mm a")}
                    {notice.expiresAt &&
                      ` · Expires ${format(new Date(notice.expiresAt), "MMM d")}`}
                  </div>
                </div>

                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => togglePin(notice._id)}
                    className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                    style={{ color: notice.isPinned ? "#6366f1" : "#94a3b8" }}
                    title={notice.isPinned ? "Unpin" : "Pin"}
                  >
                    {notice.isPinned ? <PinOff size={16} /> : <Pin size={16} />}
                  </button>
                  <button
                    onClick={() => handleEdit(notice)}
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(notice._id)}
                    className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <NoticeModal
            notice={editingNotice}
            onClose={() => {
              setIsModalOpen(false);
              setEditingNotice(null);
            }}
            onSuccess={() => {
              setIsModalOpen(false);
              setEditingNotice(null);
              queryClient.invalidateQueries(["notices"]);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NoticeModal({ notice, onClose, onSuccess }) {
  const isEdit = Boolean(notice);
  const [form, setForm] = useState({
    title: notice?.title || "",
    content: notice?.content || "",
    type: notice?.type || "general",
    priority: notice?.priority || "normal",
    isPinned: notice?.isPinned || false,
    expiresAt: notice?.expiresAt
      ? format(new Date(notice.expiresAt), "yyyy-MM-dd'T'HH:mm")
      : "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) =>
      isEdit
        ? noticeService.updateNotice(notice._id, data)
        : noticeService.createNotice(data),
    onSuccess: () => {
      toast.success(isEdit ? "Notice updated" : "Notice published! 📢");
      onSuccess();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.content)
      return toast.error("Title and content are required");
    mutate(form);
  };

  return (
    <div className="modal-backdrop">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="modal-content"
      >
        <div className="modal-header">
          <h2 className="text-xl font-bold text-slate-900">
            {isEdit ? "Edit Notice" : "Publish Notice"}
          </h2>
          <button
            onClick={onClose}
            className="modal-close"
          >
            <X size={16} />
          </button>
        </div>

        <form
          id="noticeForm"
          onSubmit={handleSubmit}
          className="modal-body"
        >
          <div className="form-group">
            <label className="label">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              className="input"
              placeholder="Notice heading..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">Type</label>
              <select
                className="input"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Priority</label>
              <select
                className="input"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="label">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              className="input min-h-[120px] resize-none"
              placeholder="Write the notice content..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Expires At (optional)</label>
            <input
              type="datetime-local"
              className="input"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={form.isPinned}
                onChange={(e) =>
                  setForm({ ...form, isPinned: e.target.checked })
                }
              />
              <div
                className={`w-10 h-6 rounded-full transition-colors ${form.isPinned ? "bg-indigo-600" : "bg-slate-200"}`}
              />
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isPinned ? "translate-x-5" : "translate-x-1"}`}
              />
            </div>
            <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <Pin size={14} /> Pin this notice
            </span>
          </label>
        </form>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button
            type="submit"
            form="noticeForm"
            disabled={isPending}
            className="btn btn-primary"
          >
            {isPending
              ? "Saving..."
              : isEdit
                ? "Update Notice"
                : "Publish Notice"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
