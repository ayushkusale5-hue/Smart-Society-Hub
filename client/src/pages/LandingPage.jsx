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

      <nav className="fixed top-0 w-full z-50 border-b border-white/20 transition-all duration-300"
        style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-10 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
              <Building2 size={20} className="text-white" />
            </div>
            <span className="font-extrabold text-slate-800 text-lg sm:text-xl tracking-tight">Smart Society Hub</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/login" className="text-slate-600 font-bold hover:text-indigo-600 transition-colors text-sm sm:text-base">Sign In</Link>
            <Link to="/register" className="btn btn-primary shadow-indigo-200/50 shadow-lg hover:shadow-indigo-300/50 hover:-translate-y-0.5 transition-all" style={{ padding: '10px 20px', fontSize: 14, borderRadius: 12 }}>
              Get Started <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: '100vh', paddingTop: 100, background: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop) center/cover no-repeat' }}>
        
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm pointer-events-none" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            className="absolute"
            style={{ width: 800, height: 800, borderRadius: '50%', top: -250, right: -250,
              background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute"
            style={{ width: 700, height: 700, borderRadius: '50%', bottom: -200, left: -200,
              background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-8 py-32 flex flex-col items-center text-center w-full z-10">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-full bg-white/50 backdrop-blur-md shadow-sm border border-indigo-100"
          >
            <Zap size={18} className="text-indigo-600" />
            <span className="text-sm font-extrabold text-indigo-700 tracking-wide uppercase">The Future of Society Management</span>
          </motion.div>

          <motion.h1 {...fadeUp} transition={{ duration: 0.55, delay: 0.05 }}
            className="font-black text-slate-900 tracking-tight"
            style={{ fontSize: 'clamp(42px, 8vw, 96px)', lineHeight: 1.05, letterSpacing: '-0.03em', maxWidth: 1000, marginBottom: 30 }}>
            Manage your society<br />
            <span style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #a855f7 60%, #ec4899 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>
              smarter and better.
            </span>
          </motion.h1>

          <motion.p {...fadeUp} transition={{ duration: 0.55, delay: 0.12 }}
            className="text-slate-600 font-medium"
            style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', lineHeight: 1.6, maxWidth: 750, marginBottom: 50 }}>
            Replace WhatsApp groups, paper registers and spreadsheets with
            one beautiful AI-powered platform connecting everyone in your community.
          </motion.p>

          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.18 }}
            className="flex items-center justify-center gap-5 sm:gap-6 flex-wrap px-4" style={{ marginBottom: 80 }}>
            <Link to="/register" id="hero-get-started"
              className="btn btn-primary"
              style={{
                padding: '16px 40px',
                borderRadius: 99, fontSize: 18, fontWeight: 800,
                boxShadow: '0 20px 40px rgba(79,70,229,0.25)', textDecoration: 'none', gap: 10,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Start Free Trial <ArrowRight size={20} />
            </Link>
            <Link to="/login" id="hero-sign-in"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)', color: '#0f172a', border: '2px solid rgba(226,232,240,0.8)',
                padding: '16px 40px', borderRadius: 99, fontSize: 18, fontWeight: 800, textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.5)'}
            >
              Sign In
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center gap-6 flex-wrap max-w-5xl mx-auto">
            {stats.map((s, i) => (
              <motion.div key={s.label} whileHover={{ y: -5, scale: 1.02 }} className="flex items-center gap-4 px-6 py-5 rounded-3xl"
                style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', minWidth: 190 }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner"
                  style={{ background: `linear-gradient(135deg, ${s.color}20, ${s.color}10)` }}>
                  <s.icon size={28} style={{ color: s.color }} />
                </div>
                <div className="text-left">
                  <div className="font-black text-slate-900" style={{ fontSize: 28, lineHeight: 1 }}>{s.value}</div>
                  <div className="text-slate-500 font-bold" style={{ fontSize: 12, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="features" style={{ padding: 'clamp(60px, 10vw, 160px) clamp(20px, 5vw, 40px)', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div className="flex flex-col items-center text-center" style={{ marginBottom: 100 }}>
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full"
              style={{ background: '#eef2ff', border: '1px solid #c7d2fe' }}>
              <span className="text-sm font-black tracking-widest uppercase text-indigo-600">Features</span>
            </div>
            <h2 className="font-black text-slate-900 tracking-tight"
              style={{ fontSize: 'clamp(48px, 6vw, 72px)', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 24 }}>
              Everything your society needs
            </h2>
            <p className="text-slate-500" style={{ fontSize: 22, maxWidth: 640, lineHeight: 1.7 }}>
              15+ integrated modules for every aspect of residential society management.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 32 }}>
            {features.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }} transition={{ delay: 0.05 * (i % 3), duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                style={{
                  background: '#ffffff', padding: '36px', borderRadius: 32,
                  border: '1px solid #f1f5f9', boxShadow: '0 12px 32px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s ease', cursor: 'default'
                }}>
                <div className="flex flex-col gap-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${f.color}15, ${f.color}05)`, border: `1px solid ${f.color}20` }}>
                    <f.icon size={32} style={{ color: f.color }} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 tracking-tight" style={{ fontSize: 22, marginBottom: 12 }}>{f.title}</h3>
                    <p className="text-slate-500 font-medium" style={{ fontSize: 16, lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(60px, 10vw, 120px) clamp(20px, 5vw, 40px)', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-indigo-500 rounded-[40px] transform rotate-3 scale-[1.02] -z-10 opacity-20" />
            <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1935&auto=format&fit=crop" 
              alt="Smart Living" 
              className="w-full h-auto object-cover rounded-[40px] shadow-2xl border-4 border-white" 
              style={{ maxHeight: 600 }}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="flex-1 w-full text-center lg:text-left flex flex-col items-center lg:items-start">
            <h2 className="font-black text-slate-900 tracking-tight" style={{ fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 1.1, marginBottom: 24 }}>
              A premium lifestyle, <br/><span className="text-indigo-600">digitized.</span>
            </h2>
            <p className="text-slate-500 font-medium" style={{ fontSize: 20, lineHeight: 1.7, marginBottom: 32, maxWidth: 500 }}>
              Enjoy peace of mind with 24/7 smart security, instant visitor approvals, and a vibrant online community market. It's not just an app, it's an upgrade to your lifestyle.
            </p>
            <ul className="flex flex-col gap-4 text-left">
              <li className="flex items-center gap-4 text-slate-700 font-bold text-lg"><CheckCircle className="text-green-500" /> Complete privacy control</li>
              <li className="flex items-center gap-4 text-slate-700 font-bold text-lg"><CheckCircle className="text-green-500" /> Real-time mobile notifications</li>
              <li className="flex items-center gap-4 text-slate-700 font-bold text-lg"><CheckCircle className="text-green-500" /> Automated billing and receipts</li>
            </ul>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: 'clamp(60px, 10vw, 160px) clamp(20px, 5vw, 40px)', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div className="flex flex-col items-center text-center" style={{ marginBottom: 100 }}>
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full"
              style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
              <span className="text-sm font-black tracking-widest uppercase" style={{ color: '#7c3aed' }}>User Roles</span>
            </div>
            <h2 className="font-black text-slate-900 tracking-tight"
              style={{ fontSize: 'clamp(48px, 6vw, 72px)', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 24 }}>
              Built for everyone
            </h2>
            <p className="text-slate-500" style={{ fontSize: 22, maxWidth: 600, lineHeight: 1.7 }}>
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
            <div className="flex flex-col items-center text-center relative z-10 w-full">
              <div className="inline-flex items-center justify-center mx-auto"
                style={{ width: 100, height: 100, borderRadius: 32, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '2px solid rgba(255,255,255,0.3)', marginBottom: 40 }}>
                <Building2 size={48} className="text-white" />
              </div>
              <h2 className="font-black text-white"
                style={{ fontSize: 'clamp(32px, 6vw, 64px)', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 24, maxWidth: 800 }}>
                Ready to modernize<br />your society?
              </h2>
              <p className="text-white/80 font-medium" style={{ fontSize: 22, lineHeight: 1.7, maxWidth: 640, marginBottom: 56 }}>
                Join Smart Society Hub today and transform how your residential community operates.
              </p>
              <Link to="/register" id="cta-get-started"
                className="hover:scale-105 transition-transform"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  background: '#ffffff', color: '#4f46e5',
                  padding: '24px 56px', borderRadius: 99, fontSize: 20, fontWeight: 900,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)', textDecoration: 'none'
                }}>
                Start Your Journey
                <ArrowRight size={24} />
              </Link>
              <div className="flex items-center justify-center gap-3" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: 600, marginTop: 40 }}>
                <Star size={20} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                No credit card required • Setup in minutes
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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
