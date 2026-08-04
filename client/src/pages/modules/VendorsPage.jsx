import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Phone, Star, ShieldCheck, Mail, Globe } from 'lucide-react';

const CATEGORIES = ['All', 'Plumbing', 'Electrical', 'Carpentry', 'Cleaning', 'Appliance Repair', 'Pest Control', 'Painting', 'Other'];

// Static mock data for Phase 3 vendors directory
const MOCK_VENDORS = [
  { id: 1, name: 'QuickFix Plumbing Services', category: 'Plumbing', rating: 4.8, reviews: 124, phone: '+1 234 567 8901', address: '123 Main St, Block B', verified: true, desc: 'Professional plumbing services for all your needs. 24/7 emergency support.' },
  { id: 2, name: 'Spark Electricals', category: 'Electrical', rating: 4.6, reviews: 89, phone: '+1 987 654 3210', address: 'Shop 4, Market Square', verified: true, desc: 'Licensed electricians for residential and commercial repairs and installations.' },
  { id: 3, name: 'WoodCraft Carpentry', category: 'Carpentry', rating: 4.9, reviews: 210, phone: '+1 555 123 4567', address: '45 Oak Lane', verified: false, desc: 'Custom furniture, repairs, and modular kitchen specialists.' },
  { id: 4, name: 'ShinePro Cleaning', category: 'Cleaning', rating: 4.5, reviews: 56, phone: '+1 444 987 6543', address: 'Level 2, Plaza Complex', verified: true, desc: 'Deep cleaning, sanitization, and daily maid services.' },
  { id: 5, name: 'CoolBreeze AC Repair', category: 'Appliance Repair', rating: 4.7, reviews: 178, phone: '+1 333 444 5555', address: 'Shop 12, High Street', verified: true, desc: 'AC installation, repair, and regular maintenance.' },
  { id: 6, name: 'SafeHome Pest Control', category: 'Pest Control', rating: 4.4, reviews: 45, phone: '+1 222 333 4444', address: 'Block C Commercial', verified: false, desc: 'Effective and eco-friendly pest control solutions.' },
];

export default function VendorsPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = MOCK_VENDORS.filter(v => 
    (filter === 'All' || v.category === filter) &&
    (v.name.toLowerCase().includes(search.toLowerCase()) || v.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trusted Vendors</h1>
          <p className="text-slate-500 text-sm mt-1">Directory of verified service providers</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-11 py-3 bg-white border-slate-200/60 shadow-sm rounded-2xl w-full text-sm" placeholder="Search vendors by name or service..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === c ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white text-slate-600 border border-slate-200/60 hover:bg-slate-50'}`}>
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
          <ShieldCheck size={40} className="mx-auto mb-3 text-indigo-300" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">No vendors found</h3>
          <p className="text-slate-500 text-sm">Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((vendor, i) => (
            <motion.div key={vendor.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all flex flex-col group">
              
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl">
                  {vendor.name.charAt(0)}
                </div>
                <div className="flex flex-col items-end gap-1">
                  {vendor.verified && <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded-full"><ShieldCheck size={12} /> Verified</span>}
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">{vendor.category}</span>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-indigo-600 transition-colors">{vendor.name}</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-amber-700">{vendor.rating}</span>
                </div>
                <span className="text-xs text-slate-400">({vendor.reviews} reviews)</span>
              </div>

              <p className="text-sm text-slate-500 mb-6 flex-1">{vendor.desc}</p>
              
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <a href={`tel:${vendor.phone}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Phone size={14} /></div>
                  <span className="font-medium">{vendor.phone}</span>
                </a>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><MapPin size={14} /></div>
                  <span className="truncate">{vendor.address}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
