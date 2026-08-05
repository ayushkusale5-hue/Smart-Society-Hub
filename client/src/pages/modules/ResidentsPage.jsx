import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, UserCheck, UserX, Filter, Shield, Wrench, ShoppingBag, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import api from '../../services/api';

const ROLE_COLORS = {
  resident: { color: '#6366f1', bg: '#eef2ff', label: 'Resident' },
  committee: { color: '#7c3aed', bg: '#f5f3ff', label: 'Committee' },
  security: { color: '#2563eb', bg: '#eff6ff', label: 'Security' },
  maintenance: { color: '#d97706', bg: '#fffbeb', label: 'Maintenance' },
  vendor: { color: '#059669', bg: '#f0fdf4', label: 'Vendor' },
};

const ROLES = ['', 'resident', 'committee', 'security', 'maintenance', 'vendor'];

export default function ResidentsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [page, setPage] = useState(1);

  const { data: res, isLoading } = useQuery({
    queryKey: ['users', search, filterRole, page],
    queryFn: () => api.get('/users', { params: { search: search || undefined, role: filterRole || undefined, page, limit: 20 } }),
    keepPreviousData: true,
  });

  const users = res?.data || [];
  const total = res?.total || 0;

  const { mutate: toggleActive } = useMutation({
    mutationFn: (id) => api.patch(`/users/${id}/toggle-active`),
    onSuccess: (res) => {
      const active = res?.data?.isActive;
      toast.success(`User ${active ? 'activated' : 'deactivated'}`);
      queryClient.invalidateQueries(['users']);
    },
    onError: () => toast.error('Failed to update user status'),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Residents & Members</h1>
        <p className="text-slate-500 text-sm mt-1">Manage all society members — {total} total</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9 py-2.5"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar whitespace-nowrap pb-2 md:pb-0">
          {ROLES.map((role) => {
            const config = ROLE_COLORS[role];
            return (
              <button
                key={role}
                onClick={() => { setFilterRole(role); setPage(1); }}
                className="px-4 py-2 rounded-2xl text-sm font-bold transition-all"
                style={{
                  background: filterRole === role ? '#0f172a' : (config?.bg || '#f8fafc'),
                  color: filterRole === role ? '#fff' : (config?.color || '#64748b'),
                  border: `1px solid ${filterRole === role ? '#0f172a' : (config ? `${config.color}30` : '#e2e8f0')}`,
                }}
              >
                {role ? config?.label : 'All Roles'}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}</div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <User size={36} className="mx-auto mb-3 text-slate-300" />
            <p className="font-semibold">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-3.5 text-slate-500 font-semibold text-xs uppercase tracking-wider">Member</th>
                  <th className="text-left px-4 py-3.5 text-slate-500 font-semibold text-xs uppercase tracking-wider">Role</th>
                  <th className="text-left px-4 py-3.5 text-slate-500 font-semibold text-xs uppercase tracking-wider">Flat</th>
                  <th className="text-left px-4 py-3.5 text-slate-500 font-semibold text-xs uppercase tracking-wider">Joined</th>
                  <th className="text-left px-4 py-3.5 text-slate-500 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3.5 text-slate-500 font-semibold text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => {
                  const roleCfg = ROLE_COLORS[user.role] || ROLE_COLORS.resident;
                  return (
                    <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${roleCfg.color}, ${roleCfg.color}bb)` }}
                          >
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{user.firstName} {user.lastName}</div>
                            <div className="text-slate-400 text-xs">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-full" style={{ background: roleCfg.bg, color: roleCfg.color }}>
                          {roleCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-600 font-mono text-xs">
                        {user.flatNumber ? `${user.tower || ''}${user.flatNumber}` : '—'}
                      </td>
                      <td className="px-4 py-4 text-slate-500 text-xs">
                        {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : '—'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${user.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                          {user.isActive ? <UserCheck size={11} /> : <UserX size={11} />}
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => toggleActive(user.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            user.isActive
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {total > 20 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-xl text-sm font-semibold border border-slate-200 disabled:opacity-40 hover:bg-slate-50">Prev</button>
              <button disabled={page * 20 >= total} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-xl text-sm font-semibold border border-slate-200 disabled:opacity-40 hover:bg-slate-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
