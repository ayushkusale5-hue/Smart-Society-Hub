import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Pin,
  Bell,
  AlertTriangle,
  Calendar,
  Wrench,
  CreditCard,
  Users,
  Info,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { noticeService } from "../../services/notice.service";

const TYPE_CONFIG = {
  general: { icon: Bell, color: "#6366f1", bg: "#eef2ff", label: "General" },
  emergency: {
    icon: AlertTriangle,
    color: "#ef4444",
    bg: "#fef2f2",
    label: "Emergency",
  },
  event: { icon: Calendar, color: "#8b5cf6", bg: "#f5f3ff", label: "Event" },
  maintenance: {
    icon: Wrench,
    color: "#f59e0b",
    bg: "#fffbeb",
    label: "Maintenance",
  },
  payment: {
    icon: CreditCard,
    color: "#10b981",
    bg: "#ecfdf5",
    label: "Payment",
  },
  meeting: { icon: Users, color: "#0ea5e9", bg: "#f0f9ff", label: "Meeting" },
};

const PRIORITY_STYLE = {
  low: { color: "#9ca3af", label: "Low" },
  normal: { color: "#6366f1", label: "Normal" },
  high: { color: "#f59e0b", label: "High" },
  urgent: { color: "#ef4444", label: "Urgent" },
};

const TYPES = Object.keys(TYPE_CONFIG);

export default function NoticeBoardPage() {
  const { data: res, isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: () => noticeService.getNotices({ limit: 50 }),
  });

  const notices = res?.data?.notices || [];
  const pinned = notices.filter((n) => n.isPinned);
  const regular = notices.filter((n) => !n.isPinned);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notice Board</h1>
        <p className="text-slate-500 text-sm mt-1">
          Society announcements and updates
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-36 bg-slate-100 rounded-3xl animate-pulse"
            />
          ))}
        </div>
      ) : notices.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <Bell size={36} className="mx-auto mb-3 text-slate-300" />
          <h3 className="font-bold text-slate-900 mb-1">No notices yet</h3>
          <p className="text-slate-500 text-sm">
            Your committee hasn't posted anything yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pinned.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Pin size={16} className="text-indigo-500" />
                <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">
                  Pinned
                </span>
              </div>
              <div className="space-y-4">
                {pinned.map((notice, i) => (
                  <NoticeCard
                    key={notice._id}
                    notice={notice}
                    index={i}
                    pinned
                  />
                ))}
              </div>
            </div>
          )}

          {regular.length > 0 && (
            <div>
              {pinned.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <Bell size={14} className="text-slate-400" />
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    All Notices
                  </span>
                </div>
              )}
              <div className="space-y-4">
                {regular.map((notice, i) => (
                  <NoticeCard key={notice._id} notice={notice} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NoticeCard({ notice, index, pinned = false }) {
  const typeConfig = TYPE_CONFIG[notice.type] || TYPE_CONFIG.general;
  const TypeIcon = typeConfig.icon;
  const priorityStyle =
    PRIORITY_STYLE[notice.priority] || PRIORITY_STYLE.normal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-3xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      style={{
        borderColor: pinned ? `${typeConfig.color}30` : "#e2e8f0",
        borderLeftWidth: pinned ? 4 : 1,
        borderLeftColor: pinned ? typeConfig.color : "#e2e8f0",
      }}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: typeConfig.bg }}
          >
            <TypeIcon size={18} style={{ color: typeConfig.color }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h3 className="font-bold text-slate-900 text-base">
                {notice.title}
              </h3>
              {pinned && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100">
                  <Pin size={9} /> Pinned
                </span>
              )}
              {notice.priority !== "normal" && (
                <span
                  className="px-2 py-0.5 text-xs font-bold rounded-full"
                  style={{
                    background: `${priorityStyle.color}15`,
                    color: priorityStyle.color,
                  }}
                >
                  {priorityStyle.label}
                </span>
              )}
              <span
                className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: typeConfig.bg, color: typeConfig.color }}
              >
                {typeConfig.label}
              </span>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              {notice.content}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span>
                By{" "}
                <strong className="text-slate-600">
                  {notice.author || "Committee"}
                </strong>
              </span>
              <span title={format(new Date(notice.createdAt), "PPpp")}>
                {formatDistanceToNow(new Date(notice.createdAt), {
                  addSuffix: true,
                })}
              </span>
              {notice.expiresAt && (
                <span className="text-amber-600 font-medium">
                  Expires {format(new Date(notice.expiresAt), "MMM d")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
