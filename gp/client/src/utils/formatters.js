// client/src/utils/formatters.js

/**
 * Format a date string to readable format
 * e.g. "2024-03-15" → "15 Mar 2024"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

/**
 * Format a relative timestamp
 * e.g. "2 hours ago", "3 days ago"
 */
export const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

/**
 * Truncate a long string with ellipsis
 */
export const truncate = (str, max = 60) => {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
};

/**
 * Generate a unique ID for client-side use only
 */
export const genId = () =>
  `goal_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
