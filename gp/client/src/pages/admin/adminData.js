export const ADMIN_USERS = [
  { id: 'usr_001', name: 'Priya Sharma', email: 'employee@test.com', role: 'Employee', department: 'Engineering', status: 'Active' },
  { id: 'usr_002', name: 'Arjun Mehta', email: 'manager@test.com', role: 'Manager', department: 'Engineering', status: 'Active' },
  { id: 'usr_003', name: 'Sunita Rao', email: 'admin@test.com', role: 'Admin', department: 'HR', status: 'Active' },
];

export const AUDIT_EVENTS = [
  { id: 'evt_001', actor: 'Sunita Rao', action: 'Created annual goal cycle', target: 'FY 2024-25', time: '2024-04-01T08:30:00Z' },
  { id: 'evt_002', actor: 'Arjun Mehta', action: 'Approved goal', target: 'Reduce deployment failures by 40%', time: '2024-04-05T11:30:00Z' },
  { id: 'evt_003', actor: 'Arjun Mehta', action: 'Requested rework', target: 'Complete security compliance audit', time: '2024-04-07T14:00:00Z' },
  { id: 'evt_004', actor: 'Priya Sharma', action: 'Updated goal sheet', target: 'Engineering goals', time: '2024-04-10T08:00:00Z' },
];
