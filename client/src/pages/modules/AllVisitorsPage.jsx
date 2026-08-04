import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  LogIn,
  LogOut,
  XCircle,
  Clock,
  User,
  Phone,
  Car,
  Calendar,
  Filter,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import { visitorService } from "../../services/visitor.service";
import { toast } from "react-hot-toast";

const STATUSES = ["Expected", "Inside", "Exited", "Denied"];
const STATUS_CONFIG = {
  Expected: { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", icon: Clock },
  Inside: { color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0", icon: LogIn },
  Exited: { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", icon: LogOut },
  Denied: { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", icon: XCircle },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Expected;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <Icon size={11} /> {status}
    </span>
  );
}

export default function AllVisitorsPage() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [page, setPage] = useState(1);

  const { data: res, isLoading } = useQuery({
    queryKey: ["all-visitors", filterStatus, filterDate, page],
    queryFn: () =>
      visitorService.getAllVisitors({
        status: filterStatus,
        date: filterDate,
        page,
        limit: 25,
      }),
  });

  const visitors = res?.data?.visitors || [];
  const total = res?.data?.total || 0;

  const { mutate: markEntry } = useMutation({
    mutationFn: (id) => visitorService.markEntry(id),
    onSuccess: () => {
      toast.success("Entry marked");
      queryClient.invalidateQueries(["all-visitors"]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed"),
  });

  const { mutate: markExit } = useMutation({
    mutationFn: (id) => visitorService.markExit(id),
    onSuccess: () => {
      toast.success("Exit marked");
      queryClient.invalidateQueries(["all-visitors"]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed"),
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            All Visitors
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Society gate log and visitor history
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setFilterStatus("")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${!filterStatus ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
          >
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${filterStatus === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="input py-2 text-sm max-w-[180px]"
          style={{ height: 40 }}
        />
        {filterDate && (
          <button
            onClick={() => setFilterDate("")}
            className="text-xs text-slate-400 hover:text-slate-600 underline"
          >
            Clear date
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-14 bg-slate-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : visitors.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <User size={36} className="mx-auto mb-3 text-slate-300" />
            <p className="font-semibold">No visitors found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-3.5 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                    Visitor
                  </th>
                  <th className="text-left px-4 py-3.5 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="text-left px-4 py-3.5 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                    Host
                  </th>
                  <th className="text-left px-4 py-3.5 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3.5 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                    Entry / Exit
                  </th>
                  <th className="text-left px-4 py-3.5 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {visitors.map((v) => (
                  <motion.tr
                    key={v._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {v.name}
                      </div>
                      <div className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                        <Phone size={10} />
                        {v.phone}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{v.purpose}</td>
                    <td className="px-4 py-4">
                      {v.host ? (
                        <div>
                          <div className="font-medium text-slate-800 text-xs">
                            {v.host.name}
                          </div>
                          <div className="text-slate-400 text-xs">
                            Flat {v.host.flatNumber}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {v.actualEntry && (
                        <div>
                          In: {format(new Date(v.actualEntry), "MMM d, h:mm a")}
                        </div>
                      )}
                      {v.actualExit && (
                        <div className="text-slate-400">
                          Out: {format(new Date(v.actualExit), "h:mm a")}
                        </div>
                      )}
                      {!v.actualEntry && v.expectedArrival && (
                        <div className="text-amber-600">
                          Exp:{" "}
                          {format(new Date(v.expectedArrival), "MMM d, h:mm a")}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1.5">
                        {v.status === "Expected" && (
                          <button
                            onClick={() => markEntry(v._id)}
                            title="Mark Entry"
                            className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                          >
                            <LogIn size={14} />
                          </button>
                        )}
                        {v.status === "Inside" && (
                          <button
                            onClick={() => markExit(v._id)}
                            title="Mark Exit"
                            className="p-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                          >
                            <LogOut size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > 25 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing {(page - 1) * 25 + 1}–{Math.min(page * 25, total)} of{" "}
              {total}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-xl text-sm font-semibold border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                Prev
              </button>
              <button
                disabled={page * 25 >= total}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-xl text-sm font-semibold border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
