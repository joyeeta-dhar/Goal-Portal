import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { StatusBadge } from '../../components/ui/Badge';
import { goalService } from '../../services/goalService';

const ActivityLog = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    goalService.getMyGoals().then(setGoals);
  }, []);

  const activities = [...goals]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .map((goal) => ({
      id: goal.id,
      title: goal.title,
      status: goal.status,
      date: goal.updatedAt,
      message: `${goal.title} was updated`,
    }));

  return (
    <DashboardLayout goalCount={goals.length}>
      <Topbar title="Activity log" subtitle="Recent changes across your goal sheet" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 px-4 py-4 border-b border-gray-100 last:border-0">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <i className="ti ti-history text-[16px] text-blue-600" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-900">{activity.message}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {new Date(activity.date).toLocaleString()}
                </p>
              </div>
              <StatusBadge status={activity.status} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ActivityLog;
