import { Project, ProjectMember } from "../models/index.js";
import { Role } from "@projectpulse/shared";

export const projectService = {
  async createProject(orgId, name, key, description, leadId) {
    const existing = await Project.findOne({ organizationId: orgId, key });
    if (existing) {
      throw new Error(
        `Project with key ${key} already exists in this organization`,
      );
    }

    const project = await Project.create({
      organizationId: orgId,
      name,
      key,
      description,
      leadId,
    });

    await ProjectMember.create({
      projectId: project._id,
      userId: leadId,
      role: Role.PROJECT_MANAGER,
    });

    return project;
  },

  async getProjectsForOrg(orgId, userId) {
    // Assuming users can see all projects in the org if they have org-level access,
    // or just the ones they are a member of. Let's return projects they are members of.
    const memberships = await ProjectMember.find({ userId }).populate(
      "projectId",
    );
    return memberships
      .map((m) => m.projectId)
      .filter((p) => p.organizationId.toString() === orgId);
  },

  async getProjectById(projectId) {
    return Project.findById(projectId);
  },

  async createMilestone(orgId, projectId, name, description, targetDate) {
    const { Milestone } = await import("../models"); // lazy load to avoid circular deps if any, though it should be fine at top
    return Milestone.create({
      organizationId: orgId,
      projectId,
      name,
      description,
      targetDate,
    });
  },

  async getMilestones(projectId) {
    const { Milestone } = await import("../models");
    return Milestone.find({ projectId }).sort({ targetDate: 1 });
  },
};
