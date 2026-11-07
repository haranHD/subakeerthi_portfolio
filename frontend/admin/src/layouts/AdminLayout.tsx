import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="brand-badge">SMP</div>
          <div className="brand-title">
            <h2>Subakeerthii MP</h2>
            <span>Admin Control Panel</span>
          </div>
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
