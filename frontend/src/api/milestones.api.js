import { fetchWithAuth } from "./authHelper";

const handleRes = async (res) => {
  if (!res.ok) {
    const text = await res.text();
    let errStr = text;
    try {
      const json = JSON.parse(text);
      if (json.error) errStr = json.error;
      if (json.details) errStr += " " + JSON.stringify(json.details);
    } catch (e) {}
    throw new Error(errStr || `Request failed with status ${res.status}`);
  }
  return res.json();
};

const BASE_URL = "https://projectpulse-s6d2.onrender.com/api/v1/organizations";

export const milestonesApi = {
  async getMilestones(orgId, projectId) {
    const res = await fetchWithAuth(
      `${BASE_URL}/${orgId}/projects/${projectId}/milestones`,
    );
    return handleRes(res);
  },
  async createMilestone(orgId, projectId, data) {
    const res = await fetchWithAuth(
      `${BASE_URL}/${orgId}/projects/${projectId}/milestones`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    return handleRes(res);
  },
};
