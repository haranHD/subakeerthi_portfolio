import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Layers,
  BookOpen,
  Award,
  Users,
  Inbox,
  Image,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Automatically close mobile sidebar on navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/dashboard/profile', label: 'Client Profile', icon: User },
    { to: '/dashboard/services', label: 'Areas of Work', icon: Layers },
    { to: '/dashboard/programmes', label: 'Programmes', icon: BookOpen },
    { to: '/dashboard/credentials', label: 'Credentials', icon: Award },
    { to: '/dashboard/audiences', label: 'Audiences', icon: Users },
    { to: '/dashboard/enquiries', label: 'Enquiries', icon: Inbox },
    { to: '/dashboard/media', label: 'Media Library', icon: Image },
    { to: '/dashboard/settings', label: 'Site Settings', icon: Settings },
    { to: '/dashboard/audit-logs', label: 'Audit Logs', icon: ShieldCheck },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Top Header */}
      <header className="admin-mobile-topbar">
        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="mobile-brand-wrapper">
          <div className="brand-badge-sm">SK</div>
          <span className="mobile-brand-title">Subakeerthii MP</span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mobile-logout-icon"
          title="Log Out"
          aria-label="Log Out"
        >
          <LogOut size={18} />
        </button>
      </header>

      {/* Dimmed backdrop on mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-badge">SK</div>
          <div className="brand-title">
            <h2>Subakeerthii MP</h2>
            <span>Admin Control Panel</span>
          </div>
          <button
            type="button"
            className="mobile-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-email">{user?.email || 'admin'}</span>
            <span className="user-role">{user?.role || 'Administrator'}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn" title="Log Out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};
