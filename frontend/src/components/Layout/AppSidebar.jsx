import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CheckSquare, 
  Clock, 
  FileText, 
  StickyNote,
  Menu,
  Settings
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Clients', href: '/clients', icon: <Users className="w-5 h-5" /> },
    { name: 'Projects', href: '/projects', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Tasks', href: '/tasks', icon: <CheckSquare className="w-5 h-5" /> },
    { name: 'Time Tracking', href: '/time-tracking', icon: <Clock className="w-5 h-5" /> },
    { name: 'Invoices', href: '/invoices', icon: <FileText className="w-5 h-5" /> },
    { name: 'Notes', href: '/notes', icon: <StickyNote className="w-5 h-5" /> },
];

const AppSidebar = ({ user }) => {
  return (
    <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-20 bg-white/5 backdrop-blur-xl border-r border-white/10">
        {/* Header */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                    <Menu className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">Freelancer Hub</span>
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
                <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) => `
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                        ${isActive 
                            ? 'bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/10 border border-indigo-500/20' 
                            : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                        }
                    `}
                >
                    {item.icon}
                    <span>{item.name}</span>
                </NavLink>
            ))}
        </nav>

        {/* User Profile / Footer */}
        <div className="p-4 border-t border-white/10">
            <NavLink 
                to="/settings"
                className={({ isActive }) => `
                    flex items-center gap-3 p-3 rounded-xl transition-colors mb-2
                    ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
                `}
            >
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center border-2 border-indigo-500/30 text-white font-semibold">
                    {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                </div>
                <div className="overflow-hidden">
                    <p className="font-semibold text-white text-sm truncate">
                        {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
                <Settings className="w-4 h-4 text-gray-500 ml-auto" />
            </NavLink>
        </div>
    </aside>
  );
};

export default AppSidebar;
