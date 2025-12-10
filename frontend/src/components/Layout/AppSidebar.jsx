import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CheckSquare, 
  Clock, 
  FileText, 
  StickyNote,
  Menu
} from 'lucide-react';

const AppSidebar = ({ user }) => {
  const { t } = useTranslation();
  
  const navItems = [
    { name: t('dashboard'), href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: t('clients'), href: '/clients', icon: <Users className="w-5 h-5" /> },
    { name: t('projects'), href: '/projects', icon: <Briefcase className="w-5 h-5" /> },
    { name: t('tasks'), href: '/tasks', icon: <CheckSquare className="w-5 h-5" /> },
    { name: t('timeTracking'), href: '/time-tracking', icon: <Clock className="w-5 h-5" /> },
    { name: t('invoices'), href: '/invoices', icon: <FileText className="w-5 h-5" /> },
    { name: t('notes'), href: '/notes', icon: <StickyNote className="w-5 h-5" /> },
  ];

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
    </aside>
  );
};

export default AppSidebar;

