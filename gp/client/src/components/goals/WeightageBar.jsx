// client/src/components/goals/WeightageBar.jsx
// Visual weightage allocation bar showing used vs remaining.
// Critical business rule: total MUST equal exactly 100%.

import { getTotalWeightage } from '../../utils/validators';
import { GOAL_LIMITS } from '../../constants/goals';

const SEGMENT_COLORS = [
  'bg-blue-700', 'bg-blue-500', 'bg-blue-300',
  'bg-indigo-500', 'bg-indigo-300',
  'bg-cyan-500', 'bg-cyan-300',
  'bg-sky-400',
];

const WeightageBar = ({ goals }) => {
  const total     = getTotalWeightage(goals);
  const remaining = GOAL_LIMITS.TOTAL_WEIGHTAGE - total;
  const isOver    = total > GOAL_LIMITS.TOTAL_WEIGHTAGE;
  const isExact   = total === GOAL_LIMITS.TOTAL_WEIGHTAGE;

  const goalsWithWeight = goals.filter((g) => parseFloat(g.weightage) > 0);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-[13px] font-semibold text-gray-800">Weightage allocation</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Total must equal exactly 100%</p>
        </div>
        <div className="text-right">
          <span className={`text-[22px] font-semibold leading-none ${
            isOver ? 'text-red-600' : isExact ? 'text-green-600' : 'text-gray-900'
          }`}>
            {total}%
          </span>
          <p className={`text-[11px] font-medium mt-0.5 ${
            isOver ? 'text-red-500' : isExact ? 'text-green-500' : 'text-gray-400'
          }`}>
            {isOver
              ? `${Math.abs(remaining)}% over limit`
              : isExact
              ? '✓ Ready to submit'
              : `${remaining}% remaining`}
          </p>
        </div>
      </div>

      {/* Segmented progress bar */}
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex mb-3">
        {goalsWithWeight.map((g, i) => {
          const pct = Math.min((parseFloat(g.weightage) / 100) * 100, 100);
          return (
            <div
              key={g.id}
              className={`h-full transition-all duration-300 ${SEGMENT_COLORS[i % SEGMENT_COLORS.length]}`}
              style={{ width: `${pct}%` }}
              title={`${g.title}: ${g.weightage}%`}
            />
          );
        })}
        {/* Overage indicator */}
        {isOver && (
          <div className="h-full bg-red-500 flex-1" />
        )}
      </div>

      {/* Legend */}
      {goalsWithWeight.length > 0 ? (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {goalsWithWeight.map((g, i) => (
            <div key={g.id} className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-sm flex-shrink-0 ${SEGMENT_COLORS[i % SEGMENT_COLORS.length]}`}
              />
              <span className="text-[11px] text-gray-500 max-w-[180px] truncate" title={g.title}>
                {g.title.length > 30 ? g.title.slice(0, 30) + '…' : g.title}
              </span>
              <span className="text-[11px] font-medium text-gray-700">{g.weightage}%</span>
            </div>
          ))}
          {remaining > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm bg-gray-200 flex-shrink-0" />
              <span className="text-[11px] text-gray-400">Unallocated</span>
              <span className="text-[11px] font-medium text-gray-400">{remaining}%</span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-[12px] text-gray-400">No goals with weightage yet.</p>
      )}

      {/* Validation message */}
      {(isOver || (total > 0 && !isExact)) && (
        <div className={`mt-3 flex items-center gap-2 text-[12px] font-medium px-3 py-2 rounded-lg ${
          isOver ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
        }`}>
          <i className={`ti ${isOver ? 'ti-alert-triangle' : 'ti-info-circle'} text-[14px]`} aria-hidden="true" />
          {isOver
            ? `Remove ${Math.abs(remaining)}% to stay within the 100% limit.`
            : `Allocate ${remaining}% more before you can submit.`}
        </div>
      )}
    </div>
  );
};

export default WeightageBar;
