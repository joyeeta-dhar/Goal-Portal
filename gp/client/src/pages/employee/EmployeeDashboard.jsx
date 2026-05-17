// client/src/pages/employee/EmployeeDashboard.jsx
// Main landing page for employee role after login.
// Shows: stats, weightage summary, recent goals, quarterly snapshot.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import WeightageBar from '../../components/goals/WeightageBar';
import { StatusBadge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { goalService } from '../../services/goalService';
import { getTotalWeightage } from '../../utils/validators';
import { GOAL_STATUS, GOAL_LIMITS } from '../../constants/goals';

const QUARTERS = [
  { q: 'Q1', label: 'Jan – Mar', status: 'completed', score: 84 },
  { q: 'Q2', label: 'Apr – Jun', status: 'active',    score: 62 },
  { q: 'Q3', label: 'Jul – Sep', status: 'pending',   score: null },
  { q: 'Q4', label: 'Oct – Dec', status: 'pending',   score: null },
];

const EmployeeDashboard = () => {
  const { user }     = useAuth();
  const navigate     = useNavigate();
  const [goals,      setGoals]   = useState([]);
  const [isLoading,  setLoading] = useState(true);

  useEffect(() => {
    goalService.getMyGoals().then((data) => {
      setGoals(data);
      setLoading(false);
    });
  }, []);

  const totalWt      = getTotalWeightage(goals);
  const draftCount   = goals.filter((g) => g.status === GOAL_STATUS.DRAFT).length;
  const approvedCount = goals.filter((g) => g.status === GOAL_STATUS.APPROVED || g.status === GOAL_STATUS.LOCKED).length;
  const reworkCount  = goals.filter((g) => g.status === GOAL_STATUS.REWORK_REQUESTED).length;
  const recentGoals  = [...goals].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 4);

  const greeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <DashboardLayout goalCount={goals.length}>
      <Topbar
        title="Dashboard"
        subtitle={`${greeting()}, ${user?.name?.split(' ')[0]} — FY 2024–25`}
        actions={[
          { label: 'Add goal', icon: 'ti-plus', onClick: () => navigate('/employee/goals') },
          { label: 'My goals', icon: 'ti-target', primary: true, onClick: () => navigate('/employee/goals') },
        ]}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* ── Rework alert ─────────────────────────────────────────── */}
        {reworkCount > 0 && (
          <div
            className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-amber-100 transition-colors"
            onClick={() => navigate('/employee/goals')}
          >
            <i className="ti ti-alert-circle text-[18px] text-amber-600 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-amber-800">
                Action needed: {reworkCount} goal{reworkCount > 1 ? 's' : ''} require{reworkCount === 1 ? 's' : ''} rework
              </p>
              <p className="text-[12px] text-amber-600">Your manager has requested changes. Click to review.</p>
            </div>
            <i className="ti ti-arrow-right text-[16px] text-amber-500" aria-hidden="true" />
          </div>
        )}

        {/* ── Stat cards ───────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              label: 'Goals set',
              value: isLoading ? '—' : `${goals.length} / ${GOAL_LIMITS.MAX_GOALS}`,
              icon:  'ti-target',
              color: 'text-blue-600',
              bg:    'bg-blue-50',
              sub:   `${GOAL_LIMITS.MAX_GOALS - goals.length} slots available`,
            },
            {
              label: 'Weightage allocated',
              value: isLoading ? '—' : `${totalWt}%`,
              icon:  'ti-chart-pie',
              color: totalWt === 100 ? 'text-green-600' : totalWt > 100 ? 'text-red-500' : 'text-gray-500',
              bg:    totalWt === 100 ? 'bg-green-50'    : totalWt > 100 ? 'bg-red-50'    : 'bg-gray-100',
              sub:   totalWt === 100 ? 'Complete ✓'     : `${100 - totalWt}% remaining`,
            },
            {
              label: 'Approved goals',
              value: isLoading ? '—' : approvedCount,
              icon:  'ti-circle-check',
              color: 'text-green-600',
              bg:    'bg-green-50',
              sub:   approvedCount > 0 ? 'Manager approved' : 'Pending review',
            },
            {
              label: 'Q2 progress',
              value: '62%',
              icon:  'ti-chart-line',
              color: 'text-indigo-600',
              bg:    'bg-indigo-50',
              sub:   'On track',
            },
          ].map((card) => (
            <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className={`w-9 h-9 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
                <i className={`ti ${card.icon} text-[18px] ${card.color}`} aria-hidden="true" />
              </div>
              <div className="text-[11px] font-medium text-gray-500 uppercase tracking-[0.4px] mb-1">{card.label}</div>
              <div className="text-[26px] font-semibold text-gray-900 leading-none">{card.value}</div>
              <div className="text-[11px] text-gray-400 mt-1.5">{card.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Weightage bar ─────────────────────────────────────────── */}
        {!isLoading && goals.length > 0 && (
          <WeightageBar goals={goals} />
        )}

        {/* ── Two-column: Recent goals + Quarterly ─────────────────── */}
        <div className="grid grid-cols-3 gap-5">

          {/* Recent goals — 2/3 width */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] font-semibold text-gray-800">Recent goals</h2>
              <button
                onClick={() => navigate('/employee/goals')}
                className="flex items-center gap-1 text-[12px] text-blue-600 hover:text-blue-800"
              >
                View all <i className="ti ti-arrow-right text-[13px]" aria-hidden="true" />
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {isLoading ? (
                <div className="space-y-0">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="px-4 py-3.5 border-b border-gray-100 last:border-0">
                      <div className="h-3.5 bg-gray-200 rounded animate-pulse w-2/3 mb-1.5" />
                      <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/3" />
                    </div>
                  ))}
                </div>
              ) : recentGoals.length === 0 ? (
                <div className="py-10 text-center">
                  <i className="ti ti-target text-[30px] text-gray-300 block mb-2" aria-hidden="true" />
                  <p className="text-[13px] text-gray-400">No goals yet.</p>
                  <button
                    onClick={() => navigate('/employee/goals')}
                    className="mt-3 text-[12px] text-blue-600 hover:underline"
                  >
                    Add your first goal →
                  </button>
                </div>
              ) : (
                recentGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate('/employee/goals')}
                  >
                    {/* Weightage circle */}
                    <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-[11px] font-bold text-blue-700">{goal.weightage}%</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-900 truncate">{goal.title}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{goal.thrustArea}</p>
                    </div>

                    <StatusBadge status={goal.status} size="sm" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quarterly snapshot — 1/3 width */}
          <div>
            <h2 className="text-[14px] font-semibold text-gray-800 mb-3">Quarterly tracking</h2>
            <div className="space-y-2.5">
              {QUARTERS.map((q) => (
                <div
                  key={q.q}
                  className={`bg-white border rounded-xl px-4 py-3.5 ${
                    q.status === 'active'    ? 'border-blue-300 ring-1 ring-blue-200'
                    : q.status === 'completed' ? 'border-green-200'
                    : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-[13px] font-semibold text-gray-800">{q.q}</span>
                      <span className="text-[11px] text-gray-400 ml-1.5">{q.label}</span>
                    </div>
                    {q.status === 'active' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        Active
                      </span>
                    )}
                    {q.status === 'completed' && (
                      <i className="ti ti-circle-check text-[16px] text-green-500" aria-hidden="true" />
                    )}
                  </div>

                  {q.score !== null ? (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-gray-400">Progress</span>
                        <span className={`text-[13px] font-bold ${
                          q.status === 'completed' ? 'text-green-700' : 'text-blue-700'
                        }`}>
                          {q.score}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            q.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${q.score}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400">Not started</p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
