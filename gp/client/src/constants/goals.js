// client/src/constants/goals.js
// All goal-related enums used across the entire app

export const GOAL_STATUS = {
  DRAFT:            'Draft',
  SUBMITTED:        'Submitted',
  APPROVED:         'Approved',
  REWORK_REQUESTED: 'Rework Requested',
  LOCKED:           'Locked',
};

export const UNIT_OF_MEASUREMENT = [
  { value: 'Numeric',    label: 'Numeric',    hint: 'e.g. number of bugs, tickets, deployments' },
  { value: 'Percentage', label: 'Percentage', hint: 'e.g. 95% uptime, 80% CSAT score'           },
  { value: 'Timeline',   label: 'Timeline',   hint: 'e.g. project delivered by Q3'               },
  { value: 'Zero-based', label: 'Zero-based', hint: 'e.g. zero critical incidents'               },
];

export const THRUST_AREAS = [
  'Engineering Excellence',
  'Customer Centricity',
  'Delivery Efficiency',
  'People Development',
  'Innovation & R&D',
  'Revenue Growth',
  'Risk Management',
  'Operational Excellence',
  'Digital Transformation',
  'Compliance & Governance',
];

export const GOAL_LIMITS = {
  MAX_GOALS:       8,
  MIN_WEIGHTAGE:   10,
  TOTAL_WEIGHTAGE: 100,
};

// Status → badge style mapping (Tailwind classes)
export const STATUS_STYLES = {
  [GOAL_STATUS.DRAFT]:            { bg: 'bg-gray-100',   text: 'text-gray-600',   dot: 'bg-gray-400'   },
  [GOAL_STATUS.SUBMITTED]:        { bg: 'bg-amber-50',   text: 'text-amber-800',  dot: 'bg-amber-500'  },
  [GOAL_STATUS.APPROVED]:         { bg: 'bg-green-50',   text: 'text-green-800',  dot: 'bg-green-500'  },
  [GOAL_STATUS.REWORK_REQUESTED]: { bg: 'bg-red-50',     text: 'text-red-700',    dot: 'bg-red-500'    },
  [GOAL_STATUS.LOCKED]:           { bg: 'bg-blue-50',    text: 'text-blue-800',   dot: 'bg-blue-500'   },
};
