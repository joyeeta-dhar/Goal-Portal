// client/src/components/goals/GoalForm.jsx
// Create / Edit goal form rendered inside a Modal.
// Handles all field validations, shared-goal restrictions, and remaining weightage hint.

import { useState, useEffect } from 'react';
import {
  validateGoalForm,
  getRemainingWeightage,
} from '../../utils/validators';
import {
  THRUST_AREAS,
  UNIT_OF_MEASUREMENT,
  GOAL_STATUS,
} from '../../constants/goals';
import { genId } from '../../utils/formatters';
import {
  FormField,
  Input,
  Textarea,
  Select,
  CharCount,
} from '../ui/FormField';

// Empty form state
const EMPTY_FORM = {
  title:       '',
  description: '',
  thrustArea:  '',
  unit:        '',
  target:      '',
  weightage:   '',
};

/**
 * GoalForm
 * @param {object|null} initialData  - null = create mode; object = edit mode
 * @param {Array}       allGoals     - all current goals (for weightage calc)
 * @param {function}    onSave       - called with (goalObject, 'draft'|'save')
 * @param {function}    onCancel     - closes the modal
 * @param {boolean}     isSaving     - loading state from parent
 */
const GoalForm = ({ initialData = null, allGoals = [], onSave, onCancel, isSaving = false }) => {
  const isEdit     = !!initialData;
  const isLocked   = initialData?.status === GOAL_STATUS.LOCKED;
  const isShared   = initialData?.isShared;
  const isApproved = initialData?.status === GOAL_STATUS.APPROVED;

  // Fields that are read-only for shared goals
  const sharedReadOnly = isShared && isEdit;

  const [form,   setForm]   = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});   // track which fields were interacted with

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        title:       initialData.title       || '',
        description: initialData.description || '',
        thrustArea:  initialData.thrustArea  || '',
        unit:        initialData.unit        || '',
        target:      initialData.target      || '',
        weightage:   initialData.weightage   || '',
      });
    } else {
      setForm(EMPTY_FORM);
      setErrors({});
      setTouched({});
    }
  }, [initialData]);

  // Max weightage available for this goal
  const remainingWt = getRemainingWeightage(allGoals, initialData?.id);

  // ── Field change handler ─────────────────────────────────────────────────
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Clear individual error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    // Validate this field on blur
    const allErrors = validateGoalForm(form);
    if (allErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: allErrors[field] }));
    }
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = (saveType) => {
    // Mark all fields as touched to show all errors
    const allFields = Object.keys(EMPTY_FORM);
    setTouched(allFields.reduce((acc, f) => ({ ...acc, [f]: true }), {}));

    const allErrors = validateGoalForm(form);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    const goalData = {
      ...(initialData || {}),
      id:          initialData?.id || genId(),
      ...form,
      title:       form.title.trim(),
      description: form.description.trim(),
      weightage:   String(parseFloat(form.weightage)),
      status:      initialData?.status || GOAL_STATUS.DRAFT,
      createdAt:   initialData?.createdAt || new Date().toISOString(),
      updatedAt:   new Date().toISOString(),
      isShared:    initialData?.isShared || false,
      managerComment: initialData?.managerComment || '',
    };

    onSave(goalData, saveType);
  };

  // Hint text for weightage field
  const wtHint = `Max available: ${remainingWt}% | Min per goal: 10% | Must be multiple of 5%`;

  return (
    <div>
      {/* Shared goal notice */}
      {sharedReadOnly && (
        <div className="flex items-start gap-2.5 bg-purple-50 border border-purple-200 text-purple-700 text-[12px] rounded-lg px-4 py-3 mb-5">
          <i className="ti ti-users text-[15px] mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>
            <strong>Shared goal</strong> — Title and target are set by your manager and cannot be changed.
            You can only adjust the weightage.
          </span>
        </div>
      )}

      {/* Locked notice */}
      {isLocked && (
        <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 text-blue-700 text-[12px] rounded-lg px-4 py-3 mb-5">
          <i className="ti ti-lock text-[15px] mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>
            This goal has been <strong>locked</strong> by your manager after approval. No edits allowed.
          </span>
        </div>
      )}

      {/* Rework comment from manager */}
      {initialData?.managerComment && initialData?.status === GOAL_STATUS.REWORK_REQUESTED && (
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-[12px] rounded-lg px-4 py-3 mb-5">
          <i className="ti ti-message-2 text-[15px] mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold mb-0.5">Manager's feedback:</p>
            <p>{initialData.managerComment}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5">

        {/* Goal Title */}
        <FormField label="Goal title" required error={touched.title ? errors.title : null}>
          <Input
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            onBlur={() => handleBlur('title')}
            placeholder="e.g. Reduce deployment failures by 40%"
            error={touched.title && errors.title}
            disabled={isLocked || sharedReadOnly}
            maxLength={120}
          />
          <CharCount current={form.title.length} max={120} />
        </FormField>

        {/* Description */}
        <FormField
          label="Goal description"
          required
          error={touched.description ? errors.description : null}
          hint="Describe the scope, approach, and measurable outcomes."
        >
          <Textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            placeholder="What will you achieve and how will you measure it?"
            error={touched.description && errors.description}
            disabled={isLocked}
            maxLength={500}
            rows={3}
          />
          <CharCount current={form.description.length} max={500} />
        </FormField>

        {/* Thrust Area + Unit of Measurement — 2 columns */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Thrust area" required error={touched.thrustArea ? errors.thrustArea : null}>
            <Select
              value={form.thrustArea}
              onChange={(e) => handleChange('thrustArea', e.target.value)}
              onBlur={() => handleBlur('thrustArea')}
              error={touched.thrustArea && errors.thrustArea}
              disabled={isLocked}
            >
              <option value="">Select area</option>
              {THRUST_AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </Select>
          </FormField>

          <FormField label="Unit of measurement" required error={touched.unit ? errors.unit : null}>
            <Select
              value={form.unit}
              onChange={(e) => handleChange('unit', e.target.value)}
              onBlur={() => handleBlur('unit')}
              error={touched.unit && errors.unit}
              disabled={isLocked || sharedReadOnly}
            >
              <option value="">Select unit</option>
              {UNIT_OF_MEASUREMENT.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </Select>
            {form.unit && (
              <p className="text-[11px] text-gray-400">
                {UNIT_OF_MEASUREMENT.find((u) => u.value === form.unit)?.hint}
              </p>
            )}
          </FormField>
        </div>

        {/* Target + Weightage — 2 columns */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Target"
            required
            error={touched.target ? errors.target : null}
            hint={form.unit === 'Timeline' ? 'Enter a date or milestone' : 'Enter numeric target value'}
          >
            <Input
              value={form.target}
              onChange={(e) => handleChange('target', e.target.value)}
              onBlur={() => handleBlur('target')}
              placeholder={
                form.unit === 'Timeline'     ? 'e.g. Q3 2024'
                : form.unit === 'Zero-based' ? '0'
                : form.unit === 'Percentage' ? 'e.g. 90'
                : 'e.g. 200'
              }
              type={form.unit === 'Timeline' || form.unit === 'Zero-based' ? 'text' : 'number'}
              min={0}
              error={touched.target && errors.target}
              disabled={isLocked || sharedReadOnly}
            />
          </FormField>

          <FormField
            label="Weightage (%)"
            required
            error={touched.weightage ? errors.weightage : null}
            hint={wtHint}
          >
            <Input
              value={form.weightage}
              onChange={(e) => handleChange('weightage', e.target.value)}
              onBlur={() => handleBlur('weightage')}
              placeholder="e.g. 20"
              type="number"
              min={10}
              max={remainingWt}
              step={5}
              error={touched.weightage && errors.weightage}
              disabled={isLocked}
            />
          </FormField>
        </div>

      </div>

      {/* ── Footer buttons ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="px-4 py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>

        {!isLocked && (
          <div className="flex items-center gap-2">
            {/* Save as Draft */}
            <button
              onClick={() => handleSubmit('draft')}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <span className="w-3.5 h-3.5 border border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <i className="ti ti-device-floppy text-[15px]" aria-hidden="true" />
              )}
              Save draft
            </button>

            {/* Save (primary) */}
            <button
              onClick={() => handleSubmit('save')}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <i className="ti ti-check text-[15px]" aria-hidden="true" />
              )}
              {isEdit ? 'Save changes' : 'Add goal'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalForm;
