// client/src/utils/validators.js
// All goal business-rule validations.
// Used by GoalForm (field-level) and MyGoals (sheet-level).

import { GOAL_LIMITS } from '../constants/goals';

const { MAX_GOALS, MIN_WEIGHTAGE, TOTAL_WEIGHTAGE } = GOAL_LIMITS;

// ─── Field-level validators ────────────────────────────────────────────────

export const validateGoalTitle = (value) => {
  if (!value || !value.trim()) return 'Goal title is required';
  if (value.trim().length < 5)  return 'Title must be at least 5 characters';
  if (value.trim().length > 120) return 'Title must be under 120 characters';
  return null;
};

export const validateGoalDescription = (value) => {
  if (!value || !value.trim()) return 'Description is required';
  if (value.trim().length < 10) return 'Description must be at least 10 characters';
  if (value.trim().length > 500) return 'Description must be under 500 characters';
  return null;
};

export const validateThrustArea = (value) => {
  if (!value) return 'Please select a thrust area';
  return null;
};

export const validateUnitOfMeasurement = (value) => {
  if (!value) return 'Please select a unit of measurement';
  return null;
};

export const validateTarget = (value, unit) => {
  if (!value && value !== 0) return 'Target is required';
  if (unit === 'Numeric' || unit === 'Percentage') {
    const num = parseFloat(value);
    if (isNaN(num))  return 'Target must be a valid number';
    if (num <= 0)    return 'Target must be greater than 0';
    if (unit === 'Percentage' && num > 100) return 'Percentage target cannot exceed 100';
  }
  if (unit === 'Timeline' && !value.trim()) return 'Please enter a target date or milestone';
  return null;
};

export const validateWeightage = (value) => {
  const num = parseFloat(value);
  if (isNaN(num) || value === '')  return 'Weightage is required';
  if (num < MIN_WEIGHTAGE)         return `Minimum weightage is ${MIN_WEIGHTAGE}%`;
  if (num > 100)                   return 'Weightage cannot exceed 100%';
  if (num % 5 !== 0)               return 'Weightage must be a multiple of 5%';
  return null;
};

// ─── Full form validator (all fields at once) ──────────────────────────────

export const validateGoalForm = (form) => {
  const errors = {};
  const titleErr  = validateGoalTitle(form.title);
  const descErr   = validateGoalDescription(form.description);
  const areaErr   = validateThrustArea(form.thrustArea);
  const unitErr   = validateUnitOfMeasurement(form.unit);
  const targetErr = validateTarget(form.target, form.unit);
  const wtErr     = validateWeightage(form.weightage);

  if (titleErr)  errors.title       = titleErr;
  if (descErr)   errors.description = descErr;
  if (areaErr)   errors.thrustArea  = areaErr;
  if (unitErr)   errors.unit        = unitErr;
  if (targetErr) errors.target      = targetErr;
  if (wtErr)     errors.weightage   = wtErr;

  return errors; // empty object = valid
};

// ─── Sheet-level validators ────────────────────────────────────────────────

/**
 * Can the employee add one more goal?
 * @param {Array} goals - current list of goals
 */
export const canAddGoal = (goals) => {
  return goals.length < MAX_GOALS;
};

/**
 * What is the total weightage across all goals?
 */
export const getTotalWeightage = (goals) => {
  return goals.reduce((sum, g) => sum + (parseFloat(g.weightage) || 0), 0);
};

/**
 * Is the goal sheet ready to submit?
 * Returns { valid: bool, message: string }
 */
export const validateGoalSheet = (goals) => {
  if (goals.length === 0) {
    return { valid: false, message: 'Add at least one goal before submitting.' };
  }

  const total = getTotalWeightage(goals);

  if (total !== TOTAL_WEIGHTAGE) {
    const diff = TOTAL_WEIGHTAGE - total;
    if (diff > 0) {
      return { valid: false, message: `Total weightage is ${total}%. You need to allocate ${diff}% more.` };
    } else {
      return { valid: false, message: `Total weightage is ${total}%. Reduce by ${Math.abs(diff)}%.` };
    }
  }

  const hasInvalidGoal = goals.some((g) => {
    const errs = validateGoalForm(g);
    return Object.keys(errs).length > 0;
  });

  if (hasInvalidGoal) {
    return { valid: false, message: 'Some goals have invalid fields. Please fix them first.' };
  }

  return { valid: true, message: '' };
};

/**
 * How much weightage is still available to allocate?
 */
export const getRemainingWeightage = (goals, editingGoalId = null) => {
  const usedByOthers = goals
    .filter((g) => g.id !== editingGoalId)
    .reduce((sum, g) => sum + (parseFloat(g.weightage) || 0), 0);
  return TOTAL_WEIGHTAGE - usedByOthers;
};
