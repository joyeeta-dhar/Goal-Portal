import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { Pill } from '../../components/ui/Badge';
import { ADMIN_USERS } from './adminData';

const UserManagement = () => (
  <DashboardLayout>
    <Topbar title="Users" subtitle="Manage portal users and role access" />

    <div className="flex-1 overflow-y-auto p-6">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_220px_130px_150px_100px] gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-[11px] font-semibold text-gray-500 uppercase tracking-[0.4px]">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Department</span>
          <span>Status</span>
        </div>
        {ADMIN_USERS.map((user) => (
          <div key={user.id} className="grid grid-cols-[1fr_220px_130px_150px_100px] items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0">
            <p className="text-[13px] font-medium text-gray-900">{user.name}</p>
            <p className="text-[13px] text-gray-500">{user.email}</p>
            <Pill label={user.role} variant={user.role === 'Admin' ? 'info' : user.role === 'Manager' ? 'warning' : 'default'} />
            <p className="text-[13px] text-gray-600">{user.department}</p>
            <Pill label={user.status} variant="success" />
          </div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default UserManagement;
