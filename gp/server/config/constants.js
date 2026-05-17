// server/config/constants.js
// Central place for all enums, limits, and demo accounts

const ROLES = {
  EMPLOYEE: 'employee',
  MANAGER:  'manager',
  ADMIN:    'admin',
};

const GOAL_STATUS = {
  DRAFT:             'Draft',
  SUBMITTED:         'Submitted',
  APPROVED:          'Approved',
  REWORK_REQUESTED:  'Rework Requested',
  LOCKED:            'Locked',
};

const GOAL_LIMITS = {
  MAX_GOALS:        8,
  MIN_WEIGHTAGE:    10,
  TOTAL_WEIGHTAGE:  100,
};

// ─── Hardcoded demo accounts ───────────────────────────────────────────────
// In production: replace with real DB lookup + bcrypt password hashing
const DEMO_USERS = [
  {
    id:           'usr_001',
    email:        'employee@test.com',
    password:     'test123',
    name:         'Priya Sharma',
    role:         ROLES.EMPLOYEE,
    managerId:    'usr_002',
    department:   'Engineering',
  },
  {
    id:           'usr_002',
    email:        'manager@test.com',
    password:     'test123',
    name:         'Arjun Mehta',
    role:         ROLES.MANAGER,
    managerId:    null,
    department:   'Engineering',
  },
  {
    id:           'usr_003',
    email:        'admin@test.com',
    password:     'test123',
    name:         'Sunita Rao',
    role:         ROLES.ADMIN,
    managerId:    null,
    department:   'HR',
  },
];

module.exports = { ROLES, GOAL_STATUS, GOAL_LIMITS, DEMO_USERS };
