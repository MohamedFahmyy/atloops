import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Layers, ShoppingBag, FolderGit2, 
  FileEdit, Users, Image, Settings, LogOut, ExternalLink, 
  Menu, X, Shield, Bell, HelpCircle 
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const navLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard Overview' },
    { to: '/admin/services', icon: Layers, label: 'Services Manager' },
    { to: '/admin/products', icon: ShoppingBag, label: 'Software Solutions' },
    { to: '/admin/portfolio', icon: FolderGit2, label: 'Portfolio Projects' },
    { to: '/admin/pages', icon: FileEdit, label: 'Visual Page Builder' },
    { to: '/admin/leads', icon: Users, label: 'CRM Leads Pipeline' },
    { to: '/admin/media', icon: Image, label: 'Media Assets Library' },
    { to: '/admin/settings', icon: Settings, label: 'Global Settings' },
    { to: '/admin/users', icon: Shield, label: 'Users & Permissions' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800" dir="ltr">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <Link to="/admin/dashboard" className="font-extrabold text-sm tracking-tight flex items-center gap-2">
          <span>AT LOOPS</span>
          <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded font-bold">ADMIN</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 start-0 z-50 w-64 bg-slate-950 text-slate-300 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div>
          {/* Brand & User Profile */}
          <div className="p-6 border-b border-slate-800/80">
            <Link to="/admin/dashboard" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="AT Loops" className="h-8 w-auto object-contain bg-white/10 p-1 rounded" />
              <div>
                <span className="font-extrabold text-sm tracking-tight text-white block">
                  AT LOOPS ENTERPRISE
                </span>
                <span className="text-[10px] font-semibold text-blue-400">
                  Administration Console
                </span>
              </div>
            </Link>

            <div className="mt-5 p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-white block">{user.name}</span>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Links */}
          <nav className="p-4 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <span>Preview Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="hidden md:flex bg-white border-b border-slate-200 px-8 py-4 items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">
            AT Loops Operations Control Center
          </h2>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        <div className="p-6 sm:p-8 flex-1">
          <Outlet />
        </div>
      </main>

    </div>
  );
};
