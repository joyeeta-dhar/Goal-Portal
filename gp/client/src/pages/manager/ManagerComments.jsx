import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { goalService } from '../../services/goalService';

const ManagerComments = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    goalService.getMyGoals().then(setGoals);
  }, []);

  const commentedGoals = goals.filter((goal) => goal.managerComment);

  return (
    <DashboardLayout goalCount={goals.length} commentCount={commentedGoals.length}>
      <Topbar title="Comments" subtitle="Feedback you have shared with employees" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {commentedGoals.map((goal) => (
            <div key={goal.id} className="px-4 py-4 border-b border-gray-100 last:border-0">
              <p className="text-[13px] font-semibold text-gray-900">{goal.title}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{goal.thrustArea}</p>
              <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 mt-3">
                <p className="text-[13px] text-gray-700">{goal.managerComment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagerComments;
