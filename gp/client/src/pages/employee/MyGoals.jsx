// client/src/pages/employee/MyGoals.jsx
// Full Goal Creation & Management page for employees.
// Features: create, edit, delete, submit, business rule enforcement.

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import GoalTable from '../../components/goals/GoalTable';
import GoalForm from '../../components/goals/GoalForm';
import WeightageBar from '../../components/goals/WeightageBar';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { StatusBadge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { goalService } from '../../services/goalService';
import {
  canAddGoal,
  getTotalWeightage,
  validateGoalSheet,
} from '../../utils/validators';
import { GOAL_LIMITS, GOAL_STATUS } from '../../constants/goals';

const MyGoals = () => {
  const { showToast } = useToast();

  // ── State ──────────────────────────────────────────────────────────────
  const [goals,         setGoals]         = useState([]);
  const [isLoading,     setIsLoading]     = useState(true);
  const [isSaving,      setIsSaving]      = useState(false);
  const [isSubmitting,  setIsSubmitting]  = useState(false);

  // Modal control
  const [showForm,      setShowForm]      = useState(false);
  const [editingGoal,   setEditingGoal]   = useState(null);   // null = create mode
  const [deleteTarget,  setDeleteTarget]  = useState(null);   // goal id to delete
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // ── Load goals on mount ────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const data = await goalService.getMyGoals();
        setGoals(data);
      } catch (err) {
        showToast('Failed to load goals. Please refresh.', 'error');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ── Derived state ──────────────────────────────────────────────────────
  const totalWt         = getTotalWeightage(goals);
  const sheetValidation = validateGoalSheet(goals);
  const isSheetSubmitted = goals.length > 0 && goals.every(
    (g) => g.status !== GOAL_STATUS.DRAFT && g.status !== GOAL_STATUS.REWORK_REQUESTED
  );

  const draftCount     = goals.filter((g) => g.status === GOAL_STATUS.DRAFT).length;
  const approvedCount  = goals.filter((g) => g.status === GOAL_STATUS.APPROVED).length;
  const reworkCount    = goals.filter((g) => g.status === GOAL_STATUS.REWORK_REQUESTED).length;

  // ── Handlers ──────────────────────────────────────────────────────────

  const openCreateForm = () => {
    if (!canAddGoal(goals)) {
      showToast(`Maximum ${GOAL_LIMITS.MAX_GOALS} goals allowed per employee.`, 'warning');
      return;
    }
    setEditingGoal(null);
    setShowForm(true);
  };

  const openEditForm = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleSaveGoal = useCallback(async (goalData, saveType) => {
    setIsSaving(true);
    try {
      let saved;
      if (editingGoal) {
        saved = await goalService.updateGoal(goalData.id, goalData);
        setGoals((prev) => prev.map((g) => g.id === saved.id ? saved : g));
        showToast('Goal updated successfully.', 'success');
      } else {
        saved = await goalService.createGoal(goalData);
        setGoals((prev) => [...prev, saved]);
        showToast('Goal added to your sheet.', 'success');
      }
      closeForm();
    } catch (err) {
      showToast(err.message || 'Failed to save goal. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [editingGoal]);

  const handleDeleteGoal = async () => {
    if (!deleteTarget) return;
    setIsSaving(true);
    try {
      await goalService.deleteGoal(deleteTarget);
      setGoals((prev) => prev.filter((g) => g.id !== deleteTarget));
      showToast('Goal deleted.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete goal.', 'error');
    } finally {
      setIsSaving(false);
      setDeleteTarget(null);
    }
  };

  const handleSubmitSheet = async () => {
    setIsSubmitting(true);
    try {
      const updated = await goalService.submitGoalSheet();
      setGoals(updated);
      showToast('Goal sheet submitted for manager review!', 'success');
    } catch (err) {
      showToast(err.message || 'Submission failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
      setShowSubmitConfirm(false);
    }
  };

  // ── Topbar actions ─────────────────────────────────────────────────────
  const topbarActions = [
    {
      label:    'Add goal',
      icon:     'ti-plus',
      onClick:  openCreateForm,
      disabled: isSheetSubmitted || goals.length >= GOAL_LIMITS.MAX_GOALS,
    },
    {
      label:    isSubmitting ? 'Submitting...' : 'Submit for review',
      icon:     'ti-send',
      primary:  true,
      onClick:  () => setShowSubmitConfirm(true),
      disabled: !sheetValidation.valid || isSheetSubmitted || isSubmitting,
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <DashboardLayout goalCount={goals.length}>
      <Topbar
        title="My goals"
        subtitle={`FY 2024–25 · ${goals.length}/${GOAL_LIMITS.MAX_GOALS} goals`}
        actions={topbarActions}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* ── Rework alert banner ──────────────────────────────────── */}
        {reworkCount > 0 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <i className="ti ti-alert-circle text-[18px] text-amber-600 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-amber-800">
                {reworkCount} goal{reworkCount > 1 ? 's' : ''} need{reworkCount === 1 ? 's' : ''} rework
              </p>
              <p className="text-[12px] text-amber-600 mt-0.5">
                Your manager has requested changes. Click edit on the flagged goals to review and update them.
              </p>
            </div>
          </div>
        )}

        {/* ── Summary stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              label: 'Total goals',
              value: `${goals.length} / ${GOAL_LIMITS.MAX_GOALS}`,
              icon:  'ti-target',
              sub:   goals.length >= GOAL_LIMITS.MAX_GOALS ? 'Limit reached' : `${GOAL_LIMITS.MAX_GOALS - goals.length} slots remaining`,
              accent: goals.length >= GOAL_LIMITS.MAX_GOALS,
            },
            {
              label: 'Weightage used',
              value: `${totalWt}%`,
              icon:  'ti-chart-pie',
              sub:   totalWt === 100 ? '✓ Allocation complete' : `${100 - totalWt}% remaining`,
              green: totalWt === 100,
              red:   totalWt > 100,
            },
            {
              label: 'Draft goals',
              value: draftCount,
              icon:  'ti-file-text',
              sub:   draftCount > 0 ? 'Not yet submitted' : 'All submitted',
            },
            {
              label: 'Approved goals',
              value: approvedCount,
              icon:  'ti-circle-check',
              sub:   approvedCount > 0 ? 'Manager approved' : 'None approved yet',
              green: approvedCount > 0,
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`bg-white border rounded-xl p-4 ${
                card.accent ? 'border-amber-300 bg-amber-50'
                : card.red   ? 'border-red-300 bg-red-50'
                : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <i className={`ti ${card.icon} text-[14px] ${
                  card.accent ? 'text-amber-600'
                  : card.red   ? 'text-red-500'
                  : card.green ? 'text-green-600'
                  : 'text-gray-400'
                }`} aria-hidden="true" />
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-[0.4px]">
                  {card.label}
                </span>
              </div>
              <div className={`text-[24px] font-semibold leading-none ${
                card.accent ? 'text-amber-700'
                : card.red   ? 'text-red-600'
                : card.green ? 'text-green-700'
                : 'text-gray-900'
              }`}>
                {card.value}
              </div>
              <div className="text-[11px] text-gray-400 mt-1.5">{card.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Weightage bar ────────────────────────────────────────── */}
        <WeightageBar goals={goals} />

        {/* ── Submission validation message ────────────────────────── */}
        {!sheetValidation.valid && goals.length > 0 && (
          <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <i className="ti ti-info-circle text-[16px] text-blue-600 flex-shrink-0" aria-hidden="true" />
            <p className="text-[13px] text-blue-700">{sheetValidation.message}</p>
          </div>
        )}

        {/* ── Sheet submitted confirmation ─────────────────────────── */}
        {isSheetSubmitted && (
          <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <i className="ti ti-circle-check text-[18px] text-green-600 flex-shrink-0" aria-hidden="true" />
            <p className="text-[13px] text-green-700 font-medium">
              Goal sheet submitted. Awaiting manager review. Goals are locked for editing until feedback is received.
            </p>
          </div>
        )}

        {/* ── Goals table ──────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-semibold text-gray-800">
              Goals <span className="text-gray-400 font-normal ml-1">({goals.length})</span>
            </h2>
            <div className="flex items-center gap-2">
              {[GOAL_STATUS.DRAFT, GOAL_STATUS.SUBMITTED, GOAL_STATUS.APPROVED,
                GOAL_STATUS.REWORK_REQUESTED, GOAL_STATUS.LOCKED].map((status) => {
                const count = goals.filter((g) => g.status === status).length;
                if (count === 0) return null;
                return (
                  <div key={status} className="flex items-center gap-1">
                    <StatusBadge status={status} size="sm" />
                    <span className="text-[11px] text-gray-500">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <GoalTable
            goals={goals}
            isSubmitted={isSheetSubmitted}
            onEdit={openEditForm}
            onDelete={(id) => setDeleteTarget(id)}
            isLoading={isLoading}
          />
        </div>

      </div>

      {/* ── Goal form modal ────────────────────────────────────────────── */}
      <Modal
        isOpen={showForm}
        onClose={closeForm}
        title={editingGoal ? (editingGoal.status === GOAL_STATUS.LOCKED ? 'View goal' : 'Edit goal') : 'Add new goal'}
        subtitle={editingGoal ? editingGoal.title : 'Fill in all required fields'}
        size="lg"
      >
        <GoalForm
          initialData={editingGoal}
          allGoals={goals}
          onSave={handleSaveGoal}
          onCancel={closeForm}
          isSaving={isSaving}
        />
      </Modal>

      {/* ── Delete confirmation ───────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteGoal}
        title="Delete this goal?"
        message="This goal will be permanently removed from your sheet. This action cannot be undone."
        confirmLabel="Delete goal"
        variant="danger"
        isLoading={isSaving}
      />

      {/* ── Submit confirmation ───────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        onConfirm={handleSubmitSheet}
        title="Submit goal sheet?"
        message={`You are about to submit ${goals.length} goal(s) with a total weightage of ${totalWt}%. Once submitted, your goals will be locked for editing until your manager reviews them.`}
        confirmLabel="Submit for review"
        variant="primary"
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  );
};

export default MyGoals;
