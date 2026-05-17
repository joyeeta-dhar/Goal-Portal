// client/src/components/ui/Badge.jsx
// Reusable status badge/chip used across all goal tables and cards.

import { STATUS_STYLES } from '../../constants/goals';

/**
 * StatusBadge — renders a colored chip for a goal status.
 * @param {string} status - one of GOAL_STATUS values
 * @param {string} size   - 'sm' | 'md' (default 'md')
 */
export const StatusBadge = ({ status, size = 'md' }) => {
  const style = STATUS_STYLES[status] || {
    bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400',
  };

  const sizeClass = size === 'sm'
    ? 'text-[10px] px-2 py-0.5 gap-1'
    : 'text-[11px] px-2.5 py-1 gap-1.5';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
      {status}
    </span>
  );
};

/**
 * Generic pill badge for labels, counts, etc.
 */
export const Pill = ({ label, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-600',
    info:    'bg-blue-50 text-blue-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-amber-50 text-amber-700',
    danger:  'bg-red-50 text-red-700',
    shared:  'bg-purple-50 text-purple-700',
  };
  return (
    <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full ${variants[variant] || variants.default}`}>
      {label}
    </span>
  );
};
