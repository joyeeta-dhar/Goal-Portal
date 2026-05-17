import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { StatusBadge } from '../../components/ui/Badge';
import { GOAL_STATUS } from '../../constants/goals';
import { goalService } from '../../services/goalService';
import { ADMIN_USERS, AUDIT_EVENTS } from './adminData';

const AdminDashboard = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    goalService.getMyGoals().then(setGoals);
  }, []);

  const approvedCount = goals.filter((goal) => [GOAL_STATUS.APPROVED, GOAL_STATUS.LOCKED].includes(goal.status)).length;
  const reworkCount = goals.filter((goal) => goal.status === GOAL_STATUS.REWORK_REQUESTED).length;

  return (
    <DashboardLayout goalCount={goals.length} commentCount={reworkCount}>
      <Topbar title="Admin dashboard" subtitle="Organization-wide goal portal overview" />

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Users', value: ADMIN_USERS.length, icon: 'ti-users', sub: 'Active demo accounts' },
            { label: 'Departments', value: 2, icon: 'ti-building', sub: 'Engineering and HR' },
            { label: 'Total goals', value: goals.length, icon: 'ti-target', sub: 'Goal records' },
            { label: 'Approved goals', value: approvedCount, icon: 'ti-circle-check', sub: 'Completed reviews' },
          ].map((card) => (
            <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                <i className={`ti ${card.icon} text-[18px] text-blue-600`} aria-hidden="true" />
              </div>
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-[0.4px] mb-1">{card.label}</p>
              <p className="text-[26px] font-semibold text-gray-900 leading-none">{card.value}</p>
              <p className="text-[11px] text-gray-400 mt-1.5">{card.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-[14px] font-semibold text-gray-800">Goal status overview</h2>
            </div>
            {goals.map((goal) => (
              <div key={goal.id} className="grid grid-cols-[1fr_140px_100px] items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-gray-900 truncate">{goal.title}</p>
                  <p className="text-[11px] text-gray-400">{goal.thrustArea}</p>
                </div>
                <StatusBadge status={goal.status} size="sm" />
                <p className="text-right text-[13px] font-semibold text-gray-800">{goal.weightage}%</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-[14px] font-semibold text-gray-800">Recent audit</h2>
            </div>
            {AUDIT_EVENTS.slice(0, 4).map((event) => (
              <div key={event.id} className="px-4 py-3 border-b border-gray-100 last:border-0">
                <p className="text-[13px] font-medium text-gray-900">{event.action}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{event.actor} · {new Date(event.time).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
