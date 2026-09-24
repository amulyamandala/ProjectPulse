import { Organization, OrganizationMember } from '../models';
import { Role } from '@projectpulse/shared';
import mongoose from 'mongoose';

export const organizationService = {
  async createOrganization(name: string, slug: string, ownerId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const existingOrg = await Organization.findOne({ slug }).session(session);
      if (existingOrg) {
        throw new Error('Organization slug already exists');
      }

      const org = await Organization.create([{
        name,
        slug,
        ownerId
      }], { session });

      await OrganizationMember.create([{
        organizationId: org[0]._id,
        userId: ownerId,
        role: Role.ORG_ADMIN
      }], { session });

      await session.commitTransaction();
      return org[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  async getOrganizationsForUser(userId: string) {
    const memberships = await OrganizationMember.find({ userId }).populate('organizationId');
    return memberships.map(m => m.organizationId);
  },

  async inviteMember(organizationId: string, userId: string, role: Role) {
    // For simplicity, we directly create the membership instead of an invitation workflow for now
    const existing = await OrganizationMember.findOne({ organizationId, userId });
    if (existing) {
      throw new Error('User is already a member');
    }

    const member = await OrganizationMember.create({
      organizationId,
      userId,
      role
    });

    return member;
  }
};
