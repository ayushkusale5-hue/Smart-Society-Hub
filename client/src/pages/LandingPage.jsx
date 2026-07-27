import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, QrCode, Wrench, FileText, BarChart3, Bell,
  Users, Car, Building2, Vote, ShoppingBag, MessageSquare,
  ArrowRight, Star, CheckCircle, Zap
} from 'lucide-react';

const features = [
  { icon: QrCode, title: 'QR Visitor Passes', desc: 'Instant digital passes with real-time gate tracking', color: '#6366f1' },
  { icon: Wrench, title: 'Smart Complaints', desc: 'AI-powered categorization with priority auto-assignment', color: '#a855f7' },
  { icon: FileText, title: 'Digital Billing', desc: 'Online maintenance bills, payments and receipts', color: '#3b82f6' },
  { icon: Bell, title: 'Notice Board', desc: 'Announcements, events and emergency alerts in real-time', color: '#f59e0b' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Society insights, visitor trends, revenue reports', color: '#16a34a' },
  { icon: Shield, title: 'Security & SOS', desc: 'CCTV incidents, emergency SOS with instant alerts', color: '#dc2626' },
  { icon: Car, title: 'Parking Management', desc: 'Vehicle registration, slot allocation and guest parking', color: '#0ea5e9' },
  { icon: Vote, title: 'Polls & Voting', desc: 'Digital elections, surveys and community decisions', color: '#ea580c' },
  { icon: ShoppingBag, title: 'Community Market', desc: 'Buy, sell and exchange items with neighbors', color: '#059669' },
  { icon: Building2, title: 'Facility Booking', desc: 'Clubhouse, gym, pool and court reservations', color: '#db2777' },
  { icon: MessageSquare, title: 'Community Chat', desc: 'Real-time society chat with role-based channels', color: '#7c3aed' },
  { icon: Users, title: 'Role Management', desc: '5 user roles with granular permission control', color: '#0d9488' },
];

const roles = [
  { emoji: '🏠', title: 'Resident', color: '#6366f1', perks: ['Visitor passes', 'Complaint filing', 'Bill payments', 'Event RSVP'] },
  { emoji: '🛡️', title: 'Committee', color: '#7c3aed', perks: ['Society analytics', 'Resident management', 'Notice creation', 'Vendor control'] },
  { emoji: '🔒', title: 'Security', color: '#2563eb', perks: ['QR gate scanning', 'Incident reports', 'SOS alerts', 'Visitor logs'] },
  { emoji: '🔧', title: 'Maintenance', color: '#d97706', perks: ['Task management', 'Status updates', 'Photo uploads', 'Work history'] },
  { emoji: '🏪', title: 'Vendor', color: '#059669', perks: ['Service requests', 'Job management', 'Bill uploads', 'Earnings tracking'] },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans bg-slate-50">
      {/* Navbar */}
      <nav className="topbar fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center gap-2.5 flex-1 max-w-7xl mx-auto w-full px-6 py-4">
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-600 shadow-md shadow-indigo-200">
              <Building2 size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 text-sm tracking-tight">Smart Society Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-4 py-2">Sign In</Link>
            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-24 pb-12 overflow-hidden bg-white">
        {/* Background decorative elements */}
        <div className="absolute top-0 inset-x-0 h-full overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute top-40 -left-40 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-60"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center z-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-8 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 shadow-sm">
            <Zap size={14} className="text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-700">All-in-one Residential Management Platform</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
            Manage your society <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              smarter.
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Smart Society Hub replaces WhatsApp groups, paper registers and spreadsheets with one
            beautiful digital platform connecting residents, committee, security, maintenance and vendors.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/register" id="hero-get-started" 
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold px-8 py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" id="hero-sign-in" 
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-base font-semibold px-8 py-4 rounded-xl shadow-sm transition-all hover:-translate-y-0.5">
              Sign In →
            </Link>
          </motion.div>

          {/* Hero stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex justify-center gap-12 flex-wrap pt-8 border-t border-slate-100">
            {[
              { val: '15+', label: 'Modules' },
              { val: '5', label: 'User Roles' },
              { val: 'Real-time', label: 'Updates' },
              { val: '100%', label: 'Digital' },
            ].map((s) => (
              <div key={s.label} className="text-center px-4">
                <div className="text-3xl font-black text-slate-800">{s.val}</div>
                <div className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-bold tracking-wider uppercase text-indigo-600 mb-4 block">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything your society needs
            </h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto">
              15+ modules designed for every aspect of residential society management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.05 * (i % 3) }} whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${f.color}15` }}>
                  <f.icon size={24} style={{ color: f.color }} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-bold tracking-wider uppercase text-indigo-600 mb-4 block">User Roles</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Built for everyone
            </h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto">
              Role-based access ensures the right features for every user.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {roles.map((role, i) => (
              <motion.div key={role.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.1 * i }}
                className="bg-slate-50 p-6 text-center rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                <div className="text-4xl mb-4 bg-white w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-sm">{role.emoji}</div>
                <h3 className="font-bold text-slate-900 text-lg mb-4">{role.title}</h3>
                <ul className="space-y-3 text-left">
                  {role.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm font-medium text-slate-600">
                      <CheckCircle size={16} className="mt-0.5 flex-shrink-0" style={{ color: role.color }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="p-12 md:p-16 rounded-3xl relative overflow-hidden bg-indigo-600 shadow-xl shadow-indigo-200">
            
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-32 -left-32 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-400 opacity-20 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="text-5xl mb-6 inline-block bg-white/20 p-4 rounded-2xl backdrop-blur-sm shadow-sm">🏠</div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to modernize<br />your society?
              </h2>
              <p className="text-indigo-100 mb-10 text-lg max-w-xl mx-auto">
                Join Smart Society Hub today and transform how your residential community operates.
              </p>
              <Link to="/register" id="cta-get-started" 
                className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-slate-50 text-lg font-bold px-8 py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-1">
                Get Started Free <ArrowRight size={20} />
              </Link>
              <div className="flex items-center justify-center gap-2 mt-8 text-sm font-medium text-indigo-200">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span>No credit card required • Free to get started</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 px-6 text-center">
        <div className="flex items-center justify-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-indigo-600">
            <Building2 size={14} className="text-white" />
          </div>
          <span className="font-bold text-slate-800 text-sm">Smart Society Hub</span>
        </div>
        <p className="text-sm text-slate-500 font-medium">© 2026 Smart Society Hub. Smarter Living Together.</p>
      </footer>
    </div>
  );
}
