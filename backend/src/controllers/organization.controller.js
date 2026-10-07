import { organizationService } from "../services/organization.service.js";
import { z } from "zod";
import { Role } from "@projectpulse/shared";

const CreateOrgSchema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/),
});

const InviteMemberSchema = z.object({
  userId: z.string(),
  role: z.nativeEnum(Role),
});

export const organizationController = {
  async create(req, res) {
    try {
      const data = CreateOrgSchema.parse(req.body);
      const org = await organizationService.createOrganization(
        data.name,
        data.slug,
        req.user._id.toString(),
      );
      res.status(201).json(org);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Validation Error", details: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  },

  async listMine(req, res) {
    try {
      const orgs = await organizationService.getOrganizationsForUser(
        req.user._id.toString(),
      );
      res.status(200).json(orgs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organizations" });
    }
  },

  async invite(req, res) {
    try {
      const orgId = req.params.orgId;
      const data = InviteMemberSchema.parse(req.body);
      const member = await organizationService.inviteMember(
        orgId,
        data.userId,
        data.role,
      );
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Validation Error", details: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  },
};
