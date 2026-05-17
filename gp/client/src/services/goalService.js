// client/src/services/goalService.js
// All goal-related API calls.
// For hackathon: uses localStorage as a mock backend.
// Swap each function body with real axios calls when the backend is ready.

import { GOAL_STATUS } from '../constants/goals';
import { DUMMY_GOALS } from '../utils/dummyData';

const STORAGE_KEY = 'goals_data';

// ── Helpers ────────────────────────────────────────────────────────────────

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // Seed with dummy data on first load
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DUMMY_GOALS));
  return DUMMY_GOALS;
};

const saveToStorage = (goals) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
};

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// ── Service methods ────────────────────────────────────────────────────────

export const goalService = {

  /** Fetch all goals for the current employee */
  getMyGoals: async (employeeId) => {
    await delay();
    const all = loadFromStorage();
    // In production: filter by employeeId from the token
    return all;
  },

  /** Create a new goal */
  createGoal: async (goalData) => {
    await delay();
    const goals = loadFromStorage();
    const newGoal = { ...goalData, status: GOAL_STATUS.DRAFT };
    const updated = [...goals, newGoal];
    saveToStorage(updated);
    return newGoal;
  },

  /** Update an existing goal */
  updateGoal: async (goalId, updates) => {
    await delay();
    const goals = loadFromStorage();
    const idx = goals.findIndex((g) => g.id === goalId);
    if (idx === -1) throw new Error('Goal not found');
    goals[idx] = { ...goals[idx], ...updates, updatedAt: new Date().toISOString() };
    saveToStorage(goals);
    return goals[idx];
  },

  /** Delete a draft goal */
  deleteGoal: async (goalId) => {
    await delay();
    const goals = loadFromStorage();
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) throw new Error('Goal not found');
    if (goal.status !== GOAL_STATUS.DRAFT) {
      throw new Error('Only draft goals can be deleted');
    }
    const updated = goals.filter((g) => g.id !== goalId);
    saveToStorage(updated);
    return true;
  },

  /** Submit the entire goal sheet for manager review */
  submitGoalSheet: async (employeeId) => {
    await delay(700);
    const goals = loadFromStorage();
    const updated = goals.map((g) =>
      g.status === GOAL_STATUS.DRAFT
        ? { ...g, status: GOAL_STATUS.SUBMITTED, updatedAt: new Date().toISOString() }
        : g
    );
    saveToStorage(updated);
    return updated;
  },

  /** Manager approves a goal */
  approveGoal: async (goalId) => {
    await delay();
    const goals = loadFromStorage();
    const idx = goals.findIndex((g) => g.id === goalId);
    if (idx === -1) throw new Error('Goal not found');
    goals[idx] = {
      ...goals[idx],
      status: GOAL_STATUS.APPROVED,
      managerComment: goals[idx].managerComment || 'Approved by manager.',
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(goals);
    return goals[idx];
  },

  /** Manager requests changes on a goal */
  requestRework: async (goalId) => {
    await delay();
    const goals = loadFromStorage();
    const idx = goals.findIndex((g) => g.id === goalId);
    if (idx === -1) throw new Error('Goal not found');
    goals[idx] = {
      ...goals[idx],
      status: GOAL_STATUS.REWORK_REQUESTED,
      managerComment: 'Please revise this goal and resubmit for review.',
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(goals);
    return goals[idx];
  },
};

// ── When backend is ready, replace with real API calls, e.g.: ──────────────
// import api from './api';
// getMyGoals: async () => { const res = await api.get('/goals/my'); return res.data.data; }
// createGoal: async (data) => { const res = await api.post('/goals', data); return res.data.data; }
