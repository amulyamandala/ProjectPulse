import { fetchWithAuth } from './authHelper';

export const dashboardApi = {
  async getOverview(projectId: string) {
    const res = await fetchWithAuth(`https://projectpulse-s6d2.onrender.com/api/v1/dashboard/overview?projectId=${projectId}`);
    if (!res.ok) throw new Error('Failed to fetch overview');
    return res.json();
  },
  async getSprintHealth(projectId: string) {
    const res = await fetchWithAuth(`https://projectpulse-s6d2.onrender.com/api/v1/dashboard/sprint-health?projectId=${projectId}`);
    if (!res.ok) throw new Error('Failed to fetch sprint health');
    return res.json();
  },
  async getWorkload(projectId: string) {
    const res = await fetchWithAuth(`https://projectpulse-s6d2.onrender.com/api/v1/dashboard/workload?projectId=${projectId}`);
    if (!res.ok) throw new Error('Failed to fetch workload');
    return res.json();
  },
  async getVelocity(projectId: string) {
    const res = await fetchWithAuth(`https://projectpulse-s6d2.onrender.com/api/v1/dashboard/velocity?projectId=${projectId}`);
    if (!res.ok) throw new Error('Failed to fetch velocity');
    return res.json();
  },
  async getActivity(projectId: string) {
    const res = await fetchWithAuth(`https://projectpulse-s6d2.onrender.com/api/v1/dashboard/activity?projectId=${projectId}`);
    if (!res.ok) throw new Error('Failed to fetch activity');
    return res.json();
  },
  async getDeadlines(projectId: string) {
    const res = await fetchWithAuth(`https://projectpulse-s6d2.onrender.com/api/v1/dashboard/deadlines?projectId=${projectId}`);
    if (!res.ok) throw new Error('Failed to fetch deadlines');
    return res.json();
  },
  async getTraceability(projectId: string) {
    const res = await fetchWithAuth(`https://projectpulse-s6d2.onrender.com/api/v1/dashboard/traceability?projectId=${projectId}`);
    if (!res.ok) throw new Error('Failed to fetch traceability');
    return res.json();
  },
  async getDod(projectId: string) {
    const res = await fetchWithAuth(`https://projectpulse-s6d2.onrender.com/api/v1/dashboard/dod?projectId=${projectId}`);
    if (!res.ok) throw new Error('Failed to fetch DOD');
    return res.json();
  }
};
