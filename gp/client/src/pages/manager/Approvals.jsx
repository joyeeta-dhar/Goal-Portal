import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { StatusBadge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { GOAL_STATUS } from '../../constants/goals';
import { goalService } from '../../services/goalService';

const Approvals = () => {
  const [goals, setGoals] = useState([]);
  const [savingId, setSavingId] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    goalService.getMyGoals().then(setGoals);
  }, []);

  const reviewGoals = goals.filter((goal) =>
    [GOAL_STATUS.SUBMITTED, GOAL_STATUS.REWORK_REQUESTED, GOAL_STATUS.DRAFT].includes(goal.status)
  );

  const updateGoalInList = (updatedGoal) => {
    setGoals((prev) => prev.map((goal) => goal.id === updatedGoal.id ? updatedGoal : goal));
  };

  const handleApprove = async (goalId) => {
    setSavingId(goalId);
    try {
      const updatedGoal = await goalService.approveGoal(goalId);
      updateGoalInList(updatedGoal);
      showToast('Goal approved.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to approve goal.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const handleRequestRework = async (goalId) => {
    setSavingId(goalId);
    try {
      const updatedGoal = await goalService.requestRework(goalId);
      updateGoalInList(updatedGoal);
      showToast('Rework requested.', 'warning');
    } catch (err) {
      showToast(err.message || 'Failed to request rework.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <DashboardLayout goalCount={goals.length} commentCount={reviewGoals.length}>
      <Topbar title="Approvals" subtitle="Review goal sheets and request changes" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {reviewGoals.map((goal) => (
            <div key={goal.id} className="px-4 py-4 border-b border-gray-100 last:border-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] font-semibold text-gray-900">{goal.title}</p>
                  <p className="text-[12px] text-gray-500 mt-1">{goal.description}</p>
                  <p className="text-[11px] text-gray-400 mt-2">{goal.thrustArea} · {goal.weightage}% weightage</p>
                </div>
                <StatusBadge status={goal.status} size="sm" />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => handleApprove(goal.id)}
                  disabled={savingId === goal.id}
                  className="px-3 py-1.5 rounded-md bg-green-600 text-white text-[12px] font-medium hover:bg-green-700 disabled:opacity-60"
                >
                  {savingId === goal.id ? 'Saving...' : 'Approve'}
                </button>
                <button
                  type="button"
                  onClick={() => handleRequestRework(goal.id)}
                  disabled={savingId === goal.id}
                  className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 text-[12px] font-medium hover:bg-gray-50 disabled:opacity-60"
                >
                  Request rework
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Approvals;
