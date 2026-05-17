// client/src/constants/roles.js

export const ROLES = {
  EMPLOYEE: 'employee',
  MANAGER:  'manager',
  ADMIN:    'admin',
};

// After login, each role is redirected to their home dashboard
export const ROLE_HOME = {
  [ROLES.EMPLOYEE]: '/employee/dashboard',
  [ROLES.MANAGER]:  '/manager/dashboard',
  [ROLES.ADMIN]:    '/admin/dashboard',
};
