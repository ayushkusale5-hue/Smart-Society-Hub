import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Plus, X, Phone, Tag, IndianRupee, Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { marketplaceService } from '../../services/marketplace.service';
import { useAuthStore } from '../../store/authStore';

const CATEGORIES = ['furniture', 'electronics', 'books', 'clothing', 'vehicles', 'appliances', 'sports', 'other'];
const CONDITIONS = ['new', 'like_new', 'good', 'fair', 'poor'];

export default function MarketplacePage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    title: '', description: '', price: '', category: 'furniture', condition: 'good', isNegotiable: false, contactPhone: user?.phone || ''
  });

  const { data: res, isLoading } = useQuery({
    queryKey: ['marketplace', filter, search],
    queryFn: () => marketplaceService.getListings({ category: filter, search }),
  });

  const listings = res?.data || [];

  const { mutate: createListing, isPending: isCreating } = useMutation({
    mutationFn: (data) => marketplaceService.createListing(data),
    onSuccess: () => {
      toast.success('Listing posted successfully!');
      setIsModalOpen(false);
      queryClient.invalidateQueries(['marketplace']);
      setForm({ ...form, title: '', description: '', price: '' });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to post listing')
  });

  const { mutate: expressInterest } = useMutation({
    mutationFn: (id) => marketplaceService.expressInterest(id),
    onSuccess: (res) => toast.success(res.message),
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to express interest')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.description) return toast.error('Fill in all required fields');
    createListing(form);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Community Marketplace</h1>
          <p className="text-sm text-slate-500 mt-1">Buy, sell, or exchange items within the society</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
          <Plus size={18} /> Post Ad
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search items..." 
          className="input flex-1 bg-white border border-slate-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          <button onClick={() => setFilter('')} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${!filter ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white text-slate-600 border border-slate-200'}`}>All</button>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-colors ${filter === c ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white text-slate-600 border border-slate-200'}`}>
              {c.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-slate-500">Loading listings...</div>
        ) : listings.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <ShoppingBag size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No items found</h3>
            <p className="text-slate-500">Be the first to post an item for sale!</p>
          </div>
        ) : (
          listings.map((item, i) => {
            const isMine = item.sellerId === user?.id;
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={item._id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col"
              >
                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden flex items-center justify-center text-slate-300">
                  <ShoppingBag size={40} />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-slate-800">
                    {item.category.replace('_', ' ')}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 leading-snug line-clamp-2" title={item.title}>{item.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">{item.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-50">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-1 text-2xl font-black text-indigo-700">
                          <IndianRupee size={20} />
                          {item.price.toLocaleString()}
                        </div>
                        {item.isNegotiable && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Negotiable</span>}
                      </div>
                      <span className="text-xs font-semibold text-slate-500 capitalize bg-slate-50 px-2 py-1 rounded-md">
                        {item.condition.replace('_', ' ')}
                      </span>
                    </div>

                    {!isMine ? (
                      <button 
                        onClick={() => expressInterest(item._id)}
                        className="w-full btn btn-primary py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm"
                      >
                        I'm Interested
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <div className="flex-1 py-2.5 bg-indigo-50 text-indigo-700 font-bold text-sm text-center rounded-xl flex items-center justify-center gap-2">
                          <Tag size={16} /> My Listing
                        </div>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this listing?')) {
                              marketplaceService.deleteListing(item._id)
                                .then(() => toast.success('Listing deleted'))
                                .catch(err => toast.error('Failed to delete listing'))
                                .finally(() => queryClient.invalidateQueries(['marketplace']));
                            }
                          }}
                          className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center"
                          title="Delete Listing"
                        >
                          <X size={16} strokeWidth={3} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-backdrop">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content">
              <div className="modal-header">
                <h2>Post an Ad</h2>
                <button onClick={() => setIsModalOpen(false)} className="modal-close">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="modal-body pb-6">
                <div className="form-group">
                  <label className="label">Title <span className="text-red-500">*</span></label>
                  <input className="input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Almost new Bicycle" />
                </div>
                
                <div className="form-group">
                  <label className="label">Description <span className="text-red-500">*</span></label>
                  <textarea className="input" required rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Condition, reason for selling, features..." />
                </div>

                <div className="grid grid-cols-2 gap-4 form-group">
                  <div>
                    <label className="label">Price (₹) <span className="text-red-500">*</span></label>
                    <input type="number" min="0" required className="input" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                  </div>
                  <div>
                    <label className="label">Category</label>
                    <select className="input capitalize" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 form-group">
                  <div>
                    <label className="label">Condition</label>
                    <select className="input capitalize" value={form.condition} onChange={e => setForm({...form, condition: e.target.value})}>
                      {CONDITIONS.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Contact Phone</label>
                    <input type="tel" className="input" value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})} />
                  </div>
                </div>

                <label className="checkbox-label pt-2">
                  <input type="checkbox" checked={form.isNegotiable} onChange={e => setForm({...form, isNegotiable: e.target.checked})} className="checkbox-input" />
                  Price is negotiable
                </label>

                <div className="mt-2">
                  <button type="submit" disabled={isCreating} className="btn btn-primary w-full py-3.5">
                    {isCreating ? 'Posting...' : 'Post Ad'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
