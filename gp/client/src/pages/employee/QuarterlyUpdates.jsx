import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { StatusBadge } from '../../components/ui/Badge';
import { goalService } from '../../services/goalService';

const QUARTERS = [
  { label: 'Q1', months: 'Jan - Mar', status: 'Completed', progress: 84 },
  { label: 'Q2', months: 'Apr - Jun', status: 'Active', progress: 62 },
  { label: 'Q3', months: 'Jul - Sep', status: 'Upcoming', progress: 0 },
  { label: 'Q4', months: 'Oct - Dec', status: 'Upcoming', progress: 0 },
];

const QuarterlyUpdates = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    goalService.getMyGoals().then(setGoals);
  }, []);

  return (
    <DashboardLayout goalCount={goals.length}>
      <Topbar title="Quarterly updates" subtitle="Track quarterly progress against approved goals" />

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="grid grid-cols-4 gap-4">
          {QUARTERS.map((quarter) => (
            <div key={quarter.label} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[18px] font-semibold text-gray-900">{quarter.label}</p>
                  <p className="text-[11px] text-gray-400">{quarter.months}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  quarter.status === 'Active'
                    ? 'bg-blue-100 text-blue-700'
                    : quarter.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                }`}>
                  {quarter.status}
                </span>
              </div>
              <div className="flex items-end justify-between mb-2">
                <span className="text-[11px] text-gray-500">Progress</span>
                <span className="text-[22px] font-semibold text-gray-900">{quarter.progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${quarter.progress}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-[14px] font-semibold text-gray-800">Goal progress snapshot</h2>
          </div>
          {goals.map((goal) => (
            <div key={goal.id} className="grid grid-cols-[1fr_120px_120px] items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0">
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-gray-900 truncate">{goal.title}</p>
                <p className="text-[11px] text-gray-400">{goal.thrustArea}</p>
              </div>
              <StatusBadge status={goal.status} size="sm" />
              <div className="text-right text-[13px] font-semibold text-gray-800">{goal.weightage}% weightage</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuarterlyUpdates;
