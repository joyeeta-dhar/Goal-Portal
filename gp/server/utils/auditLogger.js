// server/utils/auditLogger.js
// Central audit log writer — call from any controller to record changes.
//
// Hackathon: uses in-memory array for speed.
// Production swap: replace push() with a Firestore write:
//   await db.collection('auditLogs').add(log);

const auditLogs = [];

/**
 * Write an audit entry.
 * @param {object} opts
 * @param {string} opts.action          - e.g. 'USER_LOGIN', 'GOAL_APPROVED'
 * @param {string} opts.performedBy     - user ID who did the action
 * @param {string} opts.performedByName - display name for the log
 * @param {string} opts.targetId        - ID of the affected entity
 * @param {string} opts.entityType      - 'user' | 'goal' | 'goalSheet' | etc.
 * @param {any}    opts.oldValue        - state before change (null if create)
 * @param {any}    opts.newValue        - state after change (null if delete)
 */
const logAudit = async ({
  action,
  performedBy,
  performedByName,
  targetId,
  entityType = 'general',
  oldValue  = null,
  newValue  = null,
}) => {
  const log = {
    id:              `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    action,
    performedBy,
    performedByName,
    targetId,
    entityType,
    oldValue,
    newValue,
    timestamp:       new Date().toISOString(),
  };

  auditLogs.push(log);
  console.log(`[AUDIT] ${log.timestamp} | ${action} | by ${performedByName}`);
  return log;
};

/**
 * Read audit logs — used by Admin dashboard.
 */
const getAuditLogs = ({ limit = 100, action, performedBy } = {}) => {
  let logs = [...auditLogs].reverse(); // newest first
  if (action)      logs = logs.filter((l) => l.action      === action);
  if (performedBy) logs = logs.filter((l) => l.performedBy === performedBy);
  return logs.slice(0, limit);
};

module.exports = { logAudit, getAuditLogs };
