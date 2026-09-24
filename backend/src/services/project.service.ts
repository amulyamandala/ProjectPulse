import { Project, ProjectMember } from '../models';
import { Role } from '@projectpulse/shared';
import mongoose from 'mongoose';

export const projectService = {
  async createProject(orgId: string, name: string, key: string, description: string | undefined, leadId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const existing = await Project.findOne({ organizationId: orgId, key }).session(session);
      if (existing) {
        throw new Error(`Project with key ${key} already exists in this organization`);
      }

      const project = await Project.create([{
        organizationId: orgId,
        name,
        key,
        description,
        leadId
      }], { session });

      await ProjectMember.create([{
        projectId: project[0]._id,
        userId: leadId,
        role: Role.PROJECT_MANAGER
      }], { session });

      await session.commitTransaction();
      return project[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  async getProjectsForOrg(orgId: string, userId: string) {
    // Assuming users can see all projects in the org if they have org-level access, 
    // or just the ones they are a member of. Let's return projects they are members of.
    const memberships = await ProjectMember.find({ userId }).populate('projectId');
    return memberships.map(m => m.projectId).filter((p: any) => p.organizationId.toString() === orgId);
  },

  async getProjectById(projectId: string) {
    return Project.findById(projectId);
  },

  async createMilestone(orgId: string, projectId: string, name: string, description: string | undefined, targetDate: Date) {
    const { Milestone } = await import('../models'); // lazy load to avoid circular deps if any, though it should be fine at top
    return Milestone.create({
      organizationId: orgId,
      projectId,
      name,
      description,
      targetDate
    });
  }
};
