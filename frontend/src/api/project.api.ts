import { fetchWithAuth } from './authHelper';

const handleRes = async (res: Response) => {
  if (!res.ok) {
    const text = await res.text();
    let errStr = text;
    try {
      const json = JSON.parse(text);
      if (json.error) errStr = json.error;
      if (json.details) errStr += ' ' + JSON.stringify(json.details);
    } catch (e) {}
    throw new Error(errStr || `Request failed with status ${res.status}`);
  }
  return res.json();
};

export const projectApi = {
  async getMyOrgs() {
    const res = await fetchWithAuth('http://localhost:5000/api/v1/organizations');
    return handleRes(res);
  },
  async createOrg(name: string, slug: string) {
    const res = await fetchWithAuth('http://localhost:5000/api/v1/organizations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug })
    });
    return handleRes(res);
  },
  async getProjects(orgId: string) {
    const res = await fetchWithAuth(`http://localhost:5000/api/v1/organizations/${orgId}/projects`);
    return handleRes(res);
  },
  async createProject(orgId: string, name: string, key: string, description: string) {
    const res = await fetchWithAuth(`http://localhost:5000/api/v1/organizations/${orgId}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, key, description })
    });
    return handleRes(res);
  }
};
