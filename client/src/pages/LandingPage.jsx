import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, QrCode, Wrench, FileText, BarChart3, Bell,
  Users, Car, Building2, Vote, ShoppingBag, MessageSquare,
  ArrowRight, Star, CheckCircle, Zap, Home, Lock, Hammer, Store,
  TrendingUp, Globe, Award
} from 'lucide-react';

const features = [
  { icon: QrCode,       title: 'QR Visitor Passes',    desc: 'Instant digital passes with real-time gate tracking', color: '#6366f1' },
  { icon: Wrench,       title: 'Smart Complaints',     desc: 'AI-powered categorization with priority auto-assignment', color: '#a855f7' },
  { icon: FileText,     title: 'Digital Billing',      desc: 'Online maintenance bills, payments and receipts', color: '#3b82f6' },
  { icon: Bell,         title: 'Notice Board',         desc: 'Announcements, events and emergency alerts in real-time', color: '#f59e0b' },
  { icon: BarChart3,    title: 'Analytics Dashboard',  desc: 'Society insights, visitor trends, revenue reports', color: '#16a34a' },
  { icon: Shield,       title: 'Security & SOS',       desc: 'CCTV incidents, emergency SOS with instant alerts', color: '#dc2626' },
  { icon: Car,          title: 'Parking Management',   desc: 'Vehicle registration, slot allocation and guest parking', color: '#0ea5e9' },
  { icon: Vote,         title: 'Polls & Voting',       desc: 'Digital elections, surveys and community decisions', color: '#ea580c' },
  { icon: ShoppingBag,  title: 'Community Market',     desc: 'Buy, sell and exchange items with neighbors', color: '#059669' },
  { icon: Building2,    title: 'Facility Booking',     desc: 'Clubhouse, gym, pool and court reservations', color: '#db2777' },
  { icon: MessageSquare,title: 'Community Chat',       desc: 'Real-time society chat with role-based channels', color: '#7c3aed' },
  { icon: Users,        title: 'Role Management',      desc: '5 user roles with granular permission control', color: '#0d9488' },
];

const roles = [
  { icon: Home,    title: 'Resident',    color: '#6366f1', bg: '#eef2ff', perks: ['Visitor QR passes', 'Complaint filing', 'Bill payments', 'Event RSVP'] },
  { icon: Shield,  title: 'Committee',   color: '#7c3aed', bg: '#f5f3ff', perks: ['Society analytics', 'Resident management', 'Notice creation', 'Vendor control'] },
  { icon: Lock,    title: 'Security',    color: '#2563eb', bg: '#eff6ff', perks: ['QR gate scanning', 'Incident reports', 'SOS alerts', 'Visitor logs'] },
  { icon: Hammer,  title: 'Maintenance', color: '#d97706', bg: '#fffbeb', perks: ['Task management', 'Status updates', 'Photo uploads', 'Work history'] },
  { icon: Store,   title: 'Vendor',      color: '#059669', bg: '#f0fdf4', perks: ['Service requests', 'Job management', 'Bill uploads', 'Earnings tracking'] },
];

const stats = [
  { icon: Users,    value: '5',        label: 'User Roles',    color: '#6366f1' },
  { icon: Globe,    value: '15+',      label: 'Modules',       color: '#7c3aed' },
  { icon: TrendingUp, value: '100%',  label: 'Digital',       color: '#059669' },
  { icon: Award,    value: 'Live',     label: 'Updates',       color: '#f59e0b' },
];

const fadeUp = { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } };

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: '#f8fafc' }}>

      {
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-4 sm:px-10 py-4"
        style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #e2e8f0' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
            <Building2 size={18} className="text-white" />
          </div>
          <span className="font-bold text-slate-800 text-base sm:text-xl">Smart Society Hub</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <Link to="/login" className="text-slate-700 font-bold hover:text-indigo-600 transition-colors text-sm sm:text-base">Sign In</Link>
          <Link to="/register" className="btn btn-primary" style={{ padding: '9px 18px', fontSize: 14, borderRadius: 12 }}>
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {
      <section className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: '100vh', paddingTop: 100, background: '#ffffff' }}>

        {
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute"
            style={{ width: 800, height: 800, borderRadius: '50%', top: -250, right: -250,
              background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
          <div className="absolute"
            style={{ width: 700, height: 700, borderRadius: '50%', bottom: -200, left: -200,
              background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-8 py-32 text-center w-full">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 mb-12 px-6 py-3 rounded-full"
            style={{ background: '#eef2ff', border: '1px solid #c7d2fe' }}>
            <Zap size={18} className="text-indigo-600" />
            <span className="text-base font-bold text-indigo-700">All-in-one Residential Management Platform</span>
          </motion.div>

          <motion.h1 {...fadeUp} transition={{ duration: 0.55, delay: 0.05 }}
            className="font-black text-slate-900 tracking-tight mx-auto text-center"
            style={{ textAlign: 'center', fontSize: 'clamp(42px, 8vw, 110px)', lineHeight: 1.05, letterSpacing: '-0.03em', maxWidth: 1000, marginBottom: 40 }}>
            Manage your society<br />
            <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 60%, #a855f7 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>
              smarter.
            </span>
          </motion.h1>

          <motion.p {...fadeUp} transition={{ duration: 0.55, delay: 0.12 }}
            className="text-slate-500 mx-auto text-center px-4"
            style={{ textAlign: 'center', fontSize: 'clamp(15px, 2.5vw, 22px)', lineHeight: 1.7, maxWidth: 750, marginBottom: 48 }}>
            Replace WhatsApp groups, paper registers and spreadsheets with
            one beautiful platform connecting residents, committee, security and vendors.
          </motion.p>

          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.18 }}
            className="flex items-center justify-center gap-5 sm:gap-8 flex-wrap px-4" style={{ marginBottom: 64 }}>
            <Link to="/register" id="hero-get-started"
              className="btn btn-primary"
              style={{
                padding: 'clamp(12px, 2vw, 20px) clamp(24px, 4vw, 44px)',
                borderRadius: 16, fontSize: 'clamp(15px, 2vw, 18px)', fontWeight: 700,
                boxShadow: '0 8px 32px rgba(99,102,241,0.4)', textDecoration: 'none', gap: 10
              }}>
              Get Started Free
              <ArrowRight size={20} />
            </Link>
            <Link to="/login" id="hero-sign-in"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                background: '#f8fafc', color: '#0f172a', border: '2px solid #e2e8f0',
                padding: 'clamp(12px, 2vw, 20px) clamp(24px, 4vw, 44px)',
                borderRadius: 16, fontSize: 'clamp(15px, 2vw, 18px)', fontWeight: 700,
                textDecoration: 'none'
              }}>
              Sign In
            </Link>
          </motion.div>

          {
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            className="flex justify-center gap-8 flex-wrap max-w-5xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-4 px-6 py-4 rounded-2xl"
                style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', minWidth: 180 }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${s.color}15` }}>
                  <s.icon size={24} style={{ color: s.color }} />
                </div>
                <div className="text-left">
                  <div className="font-black text-slate-900" style={{ fontSize: 26, lineHeight: 1 }}>{s.value}</div>
                  <div className="text-slate-500 font-bold" style={{ fontSize: 13, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {
      <section id="features" style={{ padding: 'clamp(60px, 10vw, 160px) clamp(20px, 5vw, 40px)', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div className="text-center" style={{ marginBottom: 100 }}>
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full"
              style={{ background: '#eef2ff', border: '1px solid #c7d2fe' }}>
              <span className="text-sm font-black tracking-widest uppercase text-indigo-600">Features</span>
            </div>
            <h2 className="font-black text-slate-900 tracking-tight mx-auto text-center"
              style={{ textAlign: 'center', fontSize: 'clamp(48px, 6vw, 72px)', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 24 }}>
              Everything your society needs
            </h2>
            <p className="text-slate-500 mx-auto text-center" style={{ textAlign: 'center', fontSize: 22, maxWidth: 640, lineHeight: 1.7 }}>
              15+ integrated modules for every aspect of residential society management.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 32 }}>
            {features.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }} transition={{ delay: 0.05 * (i % 3), duration: 0.5 }}
                style={{
                  background: '#ffffff', padding: '40px', borderRadius: 32,
                  border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
                }}>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-20 h-20 rounded-3xl flex items-center justify-center"
                    style={{ background: `${f.color}12`, border: `1px solid ${f.color}25` }}>
                    <f.icon size={36} style={{ color: f.color }} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900" style={{ fontSize: 24, marginBottom: 12 }}>{f.title}</h3>
                    <p className="text-slate-500 font-medium" style={{ fontSize: 17, lineHeight: 1.7 }}>{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {
      <section style={{ padding: 'clamp(60px, 10vw, 160px) clamp(20px, 5vw, 40px)', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div className="text-center" style={{ marginBottom: 100 }}>
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full"
              style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
              <span className="text-sm font-black tracking-widest uppercase" style={{ color: '#7c3aed' }}>User Roles</span>
            </div>
            <h2 className="font-black text-slate-900 tracking-tight mx-auto text-center"
              style={{ textAlign: 'center', fontSize: 'clamp(48px, 6vw, 72px)', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 24 }}>
              Built for everyone
            </h2>
            <p className="text-slate-500 mx-auto text-center" style={{ textAlign: 'center', fontSize: 22, maxWidth: 600, lineHeight: 1.7 }}>
              Role-based access ensures the right features reach the right people.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 32 }}>
            {roles.map((role, i) => (
              <motion.div key={role.title}
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }} transition={{ delay: 0.1 * i, duration: 0.5 }}
                style={{
                  background: '#fafbfc', padding: '48px 32px', borderRadius: 32, textAlign: 'center',
                  border: '2px solid #e2e8f0'
                }}>
                <div className="flex items-center justify-center mx-auto"
                  style={{ width: 96, height: 96, borderRadius: 32, background: role.bg, border: `2px solid ${role.color}30`, marginBottom: 32 }}>
                  <role.icon size={44} style={{ color: role.color }} />
                </div>
                <h3 className="font-black text-slate-900" style={{ fontSize: 26, marginBottom: 24 }}>{role.title}</h3>
                <ul style={{ textAlign: 'left', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {role.perks.map((p) => (
                    <li key={p} className="flex items-start gap-4" style={{ fontSize: 16, color: '#475569', fontWeight: 600 }}>
                      <CheckCircle size={20} style={{ color: role.color, flexShrink: 0, marginTop: 2 }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {
      <section style={{ padding: 'clamp(60px, 10vw, 160px) clamp(20px, 5vw, 40px)', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{
              padding: 'clamp(60px, 10vw, 100px) clamp(24px, 5vw, 80px)',
              borderRadius: 48, position: 'relative', overflow: 'hidden', textAlign: 'center',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 40%, #7c3aed 100%)',
              boxShadow: '0 32px 100px rgba(99,102,241,0.4)'
            }}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', width: 800, height: 800, borderRadius: '50%',
                top: -300, left: -200, background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)' }} />
              <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%',
                bottom: -200, right: -100, background: 'radial-gradient(circle, rgba(168,85,247,0.3), transparent 70%)' }} />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="inline-flex items-center justify-center mx-auto"
                style={{ width: 100, height: 100, borderRadius: 32, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '2px solid rgba(255,255,255,0.3)', marginBottom: 40 }}>
                <Building2 size={48} className="text-white" />
              </div>
              <h2 className="font-black text-white mx-auto"
                style={{ fontSize: 'clamp(32px, 6vw, 64px)', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 24, maxWidth: 800 }}>
                Ready to modernize<br />your society?
              </h2>
              <p className="mx-auto text-center" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 22, lineHeight: 1.7, maxWidth: 640, marginBottom: 56 }}>
                Join Smart Society Hub today and transform how your residential community operates.
              </p>
              <Link to="/register" id="cta-get-started"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  background: '#ffffff', color: '#4f46e5',
                  padding: '24px 56px', borderRadius: 20, fontSize: 20, fontWeight: 800,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.2)', textDecoration: 'none'
                }}>
                Get Started Free
                <ArrowRight size={24} />
              </Link>
              <div className="flex items-center justify-center gap-3" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, fontWeight: 500, marginTop: 40 }}>
                <Star size={20} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                No credit card required • Free to get started
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {
      <footer style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '64px 40px', textAlign: 'center' }}>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Building2 size={20} className="text-white" />
          </div>
          <span className="font-bold text-slate-800" style={{ fontSize: 20 }}>Smart Society Hub</span>
        </div>
        <p style={{ color: '#64748b', fontSize: 16, fontWeight: 500 }}>© 2026 Smart Society Hub. Smarter Living Together.</p>
      </footer>
    </div>
  );
}
