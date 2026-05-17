import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { StatusBadge } from '../../components/ui/Badge';
import { GOAL_STATUS } from '../../constants/goals';
import { goalService } from '../../services/goalService';

const TEAM_MEMBERS = ['Priya Sharma', 'Rohan Verma', 'Meera Iyer'];

const ManagerDashboard = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    goalService.getMyGoals().then(setGoals);
  }, []);

  const pendingCount = goals.filter((goal) => goal.status === GOAL_STATUS.SUBMITTED).length;
  const reworkCount = goals.filter((goal) => goal.status === GOAL_STATUS.REWORK_REQUESTED).length;
  const approvedCount = goals.filter((goal) => goal.status === GOAL_STATUS.APPROVED || goal.status === GOAL_STATUS.LOCKED).length;

  return (
    <DashboardLayout goalCount={goals.length} commentCount={reworkCount}>
      <Topbar title="Manager dashboard" subtitle="Team goal review and quarterly performance overview" />

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Team members', value: TEAM_MEMBERS.length, icon: 'ti-users', sub: 'Direct reports' },
            { label: 'Goals submitted', value: goals.length, icon: 'ti-target', sub: 'Across the team' },
            { label: 'Pending review', value: pendingCount, icon: 'ti-clock', sub: 'Need manager action' },
            { label: 'Approved/locked', value: approvedCount, icon: 'ti-circle-check', sub: 'Review completed' },
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
              <h2 className="text-[14px] font-semibold text-gray-800">Recent team goals</h2>
            </div>
            {goals.slice(0, 5).map((goal, index) => (
              <div key={goal.id} className="grid grid-cols-[1fr_130px_110px] items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-gray-900 truncate">{goal.title}</p>
                  <p className="text-[11px] text-gray-400">{TEAM_MEMBERS[index % TEAM_MEMBERS.length]} · {goal.thrustArea}</p>
                </div>
                <StatusBadge status={goal.status} size="sm" />
                <p className="text-right text-[13px] font-semibold text-gray-800">{goal.weightage}%</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h2 className="text-[14px] font-semibold text-gray-800 mb-3">Review summary</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-gray-500">Pending</span>
                <span className="text-[13px] font-semibold text-amber-700">{pendingCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-gray-500">Rework requested</span>
                <span className="text-[13px] font-semibold text-red-600">{reworkCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-gray-500">Completed</span>
                <span className="text-[13px] font-semibold text-green-700">{approvedCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
