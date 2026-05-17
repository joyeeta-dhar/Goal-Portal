// client/src/components/goals/GoalTable.jsx
// Renders the goal list as an enterprise-style table.
// Handles edit, delete, row expansion for description.

import { useState } from 'react';
import { StatusBadge, Pill } from '../ui/Badge';
import { GOAL_STATUS } from '../../constants/goals';
import { truncate } from '../../utils/formatters';

/**
 * GoalTable
 * @param {Array}    goals       - array of goal objects
 * @param {boolean}  isSubmitted - if true, only locked/approved goals shown (no edit/delete)
 * @param {function} onEdit      - called with goal object
 * @param {function} onDelete    - called with goal id
 * @param {boolean}  isLoading   - show skeleton
 */
const GoalTable = ({ goals = [], isSubmitted = false, onEdit, onDelete, isLoading = false }) => {
  const [expandedId, setExpandedId] = useState(null);

  const canEdit = (goal) => {
    if (isSubmitted) return false;
    return [GOAL_STATUS.DRAFT, GOAL_STATUS.REWORK_REQUESTED].includes(goal.status);
  };

  const canDelete = (goal) => {
    if (isSubmitted) return false;
    return [GOAL_STATUS.DRAFT].includes(goal.status);
  };

  if (isLoading) return <GoalTableSkeleton />;

  if (goals.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <i className="ti ti-target text-[22px] text-gray-400" aria-hidden="true" />
        </div>
        <h3 className="text-[14px] font-semibold text-gray-700 mb-1">No goals yet</h3>
        <p className="text-[12px] text-gray-400 max-w-xs">
          Click "Add goal" to create your first goal. You can add up to 8 goals with a total weightage of 100%.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[2fr_1.1fr_0.75fr_1fr_0.75fr_0.9fr] px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        {['Goal', 'Thrust area', 'Unit', 'Weightage', 'Status', 'Actions'].map((h) => (
          <div key={h} className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.4px]">
            {h}
          </div>
        ))}
      </div>

      {/* Rows */}
      {goals.map((goal) => {
        const isExpanded = expandedId === goal.id;
        return (
          <div key={goal.id} className="border-b border-gray-100 last:border-0">
            {/* Main row */}
            <div
              className="grid grid-cols-[2fr_1.1fr_0.75fr_1fr_0.75fr_0.9fr] px-4 py-3.5 items-center hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : goal.id)}
            >
              {/* Goal title + shared badge */}
              <div className="flex flex-col gap-0.5 pr-3">
                <div className="flex items-start gap-1.5">
                  <span className="text-[13px] font-medium text-gray-900 leading-snug">
                    {truncate(goal.title, 55)}
                  </span>
                  {goal.isShared && (
                    <Pill label="Shared" variant="shared" />
                  )}
                </div>
                <span className="text-[11px] text-gray-400">{goal.unit}</span>
              </div>

              {/* Thrust area */}
              <div className="text-[12px] text-gray-600 pr-2">
                {goal.thrustArea}
              </div>

              {/* Unit */}
              <div className="text-[12px] text-gray-600">{goal.unit}</div>

              {/* Weightage */}
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${Math.min(parseFloat(goal.weightage) || 0, 100)}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-semibold text-gray-700 whitespace-nowrap">
                    {goal.weightage}%
                  </span>
                </div>
              </div>

              {/* Status */}
              <div>
                <StatusBadge status={goal.status} />
              </div>

              {/* Actions */}
              <div
                className="flex items-center gap-1"
                onClick={(e) => e.stopPropagation()} // prevent row expand on button click
              >
                {canEdit(goal) && (
                  <button
                    onClick={() => onEdit(goal)}
                    title="Edit goal"
                    className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <i className="ti ti-edit text-[16px]" aria-hidden="true" />
                  </button>
                )}
                {!canEdit(goal) && goal.status !== GOAL_STATUS.DRAFT && (
                  <button
                    onClick={() => onEdit(goal)}
                    title="View goal"
                    className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <i className="ti ti-eye text-[16px]" aria-hidden="true" />
                  </button>
                )}
                {canDelete(goal) && (
                  <button
                    onClick={() => onDelete(goal.id)}
                    title="Delete goal"
                    className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <i className="ti ti-trash text-[16px]" aria-hidden="true" />
                  </button>
                )}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : goal.id)}
                  className="p-1.5 rounded-md text-gray-300 hover:text-gray-500 transition-colors"
                  title={isExpanded ? 'Collapse' : 'Expand'}
                >
                  <i className={`ti ${isExpanded ? 'ti-chevron-up' : 'ti-chevron-down'} text-[16px]`} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Expanded description row */}
            {isExpanded && (
              <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-6 pt-3">
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.4px] mb-1">Description</p>
                    <p className="text-[13px] text-gray-700 leading-relaxed">{goal.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.4px] mb-1">Target</p>
                      <p className="text-[13px] text-gray-700 font-medium">{goal.target}</p>
                    </div>
                    {goal.managerComment && (
                      <div className="col-span-2">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.4px] mb-1">Manager comment</p>
                        <p className="text-[12px] text-amber-800 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
                          {goal.managerComment}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Loading skeleton ─────────────────────────────────────────────────────────
const GoalTableSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
    <div className="h-10 bg-gray-50 border-b border-gray-200" />
    {[1, 2, 3].map((i) => (
      <div key={i} className="grid grid-cols-[2fr_1.1fr_0.75fr_1fr_0.75fr_0.9fr] px-4 py-4 border-b border-gray-100 gap-4">
        <div className="space-y-1.5">
          <div className="h-3.5 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/2" />
        </div>
        {[1,2,3,4,5].map((j) => (
          <div key={j} className="h-3 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    ))}
  </div>
);

export default GoalTable;
