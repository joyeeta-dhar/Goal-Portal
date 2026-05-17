import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { StatusBadge } from '../../components/ui/Badge';
import { goalService } from '../../services/goalService';

const TEAM_MEMBERS = ['Priya Sharma', 'Rohan Verma', 'Meera Iyer'];

const TeamGoals = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    goalService.getMyGoals().then(setGoals);
  }, []);

  return (
    <DashboardLayout goalCount={goals.length}>
      <Topbar title="Team goals" subtitle="Goals submitted by your direct reports" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_150px_140px_100px] gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-[11px] font-semibold text-gray-500 uppercase tracking-[0.4px]">
            <span>Goal</span>
            <span>Employee</span>
            <span>Status</span>
            <span className="text-right">Weightage</span>
          </div>
          {goals.map((goal, index) => (
            <div key={goal.id} className="grid grid-cols-[1fr_150px_140px_100px] items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0">
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-gray-900 truncate">{goal.title}</p>
                <p className="text-[11px] text-gray-400">{goal.thrustArea}</p>
              </div>
              <p className="text-[13px] text-gray-700">{TEAM_MEMBERS[index % TEAM_MEMBERS.length]}</p>
              <StatusBadge status={goal.status} size="sm" />
              <p className="text-right text-[13px] font-semibold text-gray-800">{goal.weightage}%</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeamGoals;
