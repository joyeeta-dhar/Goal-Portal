import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { StatusBadge } from '../../components/ui/Badge';
import { goalService } from '../../services/goalService';

const Comments = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    goalService.getMyGoals().then(setGoals);
  }, []);

  const commentedGoals = goals.filter((goal) => goal.managerComment);

  return (
    <DashboardLayout goalCount={goals.length} commentCount={commentedGoals.length}>
      <Topbar title="Comments" subtitle="Manager feedback and review notes" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {commentedGoals.length === 0 ? (
            <div className="py-12 text-center">
              <i className="ti ti-message-2 text-[30px] text-gray-300 block mb-2" aria-hidden="true" />
              <p className="text-[13px] text-gray-400">No manager comments yet.</p>
            </div>
          ) : (
            commentedGoals.map((goal) => (
              <div key={goal.id} className="px-4 py-4 border-b border-gray-100 last:border-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">{goal.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{goal.thrustArea}</p>
                  </div>
                  <StatusBadge status={goal.status} size="sm" />
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5">
                  <p className="text-[13px] text-gray-700">{goal.managerComment}</p>
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                  Updated {new Date(goal.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Comments;
