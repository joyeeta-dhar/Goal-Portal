// client/src/components/layout/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const NAV_BY_ROLE = {
  employee: [
    { section: 'Main' },
    { label: 'Dashboard',         icon: 'ti-layout-dashboard', to: '/employee/dashboard' },
    { label: 'My goals',          icon: 'ti-target',           to: '/employee/goals' },
    { label: 'Quarterly updates', icon: 'ti-calendar-stats',   to: '/employee/quarterly' },
    { section: 'Review' },
    { label: 'Comments',          icon: 'ti-message-2',        to: '/employee/comments' },
    { label: 'Activity log',      icon: 'ti-history',          to: '/employee/activity' },
  ],
  manager: [
    { section: 'Main' },
    { label: 'Dashboard',         icon: 'ti-layout-dashboard', to: '/manager/dashboard' },
    { label: 'Team goals',        icon: 'ti-users',            to: '/manager/team-goals' },
    { label: 'Approvals',         icon: 'ti-clipboard-check',  to: '/manager/approvals' },
    { section: 'Review' },
    { label: 'Comments',          icon: 'ti-message-2',        to: '/manager/comments' },
  ],
  admin: [
    { section: 'Main' },
    { label: 'Dashboard',         icon: 'ti-layout-dashboard', to: '/admin/dashboard' },
    { label: 'Users',             icon: 'ti-users',            to: '/admin/users' },
    { label: 'Goals overview',    icon: 'ti-target',           to: '/admin/goals' },
    { section: 'Governance' },
    { label: 'Audit log',         icon: 'ti-shield-check',     to: '/admin/audit' },
  ],
};

const Sidebar = ({ goalCount = 0, commentCount = 0 }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = NAV_BY_ROLE[user?.role] || NAV_BY_ROLE.employee;

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getBadge = (label) => {
    if (label === 'My goals' && goalCount > 0) return goalCount;
    if (label === 'Comments' && commentCount > 0) return commentCount;
    return null;
  };

  return (
    <aside className="w-[220px] bg-[#0C1E35] flex flex-col flex-shrink-0 h-full">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.08]">
        <div className="w-[30px] h-[30px] bg-[#185FA5] rounded-[6px] flex items-center justify-center flex-shrink-0">
          <i className="ti ti-chart-bar text-white text-base" aria-hidden="true" />
        </div>
        <div>
          <p className="text-[13px] font-medium text-[#e8edf3] tracking-[0.2px] leading-none">
            PerformanceIQ
          </p>
          <p className="text-[10px] text-white/35 mt-0.5">Goal Management</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map((item, i) => {
          if (item.section) {
            return (
              <p key={i} className="px-5 pt-5 pb-2 text-[10px] font-medium text-white/30 uppercase tracking-[0.8px]">
                {item.section}
              </p>
            );
          }

          const badge = getBadge(item.label);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 mx-2 px-3 py-2 rounded-md text-[13px] transition-colors duration-150 ${
                  isActive
                    ? 'bg-[#185FA5] text-white'
                    : 'text-white/55 hover:bg-white/[0.07] hover:text-white/85'
                }`
              }
            >
              <i className={`ti ${item.icon} text-base w-[18px] flex-shrink-0`} aria-hidden="true" />
              <span className="flex-1">{item.label}</span>
              {badge !== null && (
                <span className="bg-white/15 text-white/80 text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-white/[0.08]">
        <div className="flex items-center gap-2.5 p-2 rounded-md cursor-pointer hover:bg-white/[0.07] group">
          <div className="w-[30px] h-[30px] rounded-full bg-[#185FA5] flex items-center justify-center text-[12px] font-medium text-white flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-white/80 truncate">{user?.name}</p>
            <p className="text-[10px] text-white/35 capitalize">{user?.role} · {user?.department}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-white/25 hover:text-white/70 transition-colors"
          >
            <i className="ti ti-logout text-[15px]" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
