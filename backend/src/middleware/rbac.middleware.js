import { OrganizationMember, ProjectMember } from "../models/index.js";
import { RolePermissions } from "@projectpulse/shared";
import mongoose from "mongoose";

export const requireOrgMembership = async (req, res, next) => {
  try {
    const orgId =
      req.params.orgId || req.body.organizationId || req.query.orgId;
    if (!orgId || !mongoose.Types.ObjectId.isValid(orgId)) {
      return res
        .status(400)
        .json({ error: "Valid Organization ID is required" });
    }

    const membership = await OrganizationMember.findOne({
      organizationId: orgId,
      userId: req.user._id,
    });

    if (!membership) {
      return res
        .status(403)
        .json({ error: "Forbidden: You do not belong to this organization" });
    }

    // Attach membership to request for later use
    req.orgMembership = membership;
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const requirePermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // 1. Check org-level permission
      const orgMembership = req.orgMembership;
      if (!orgMembership) {
        // Fallback: fetch if not attached
        return res
          .status(500)
          .json({
            error:
              "Internal: orgMembership not found. Use requireOrgMembership first.",
          });
      }

      const orgPermissions = RolePermissions[orgMembership.role] || [];
      if (orgPermissions.includes(requiredPermission)) {
        return next();
      }

      // 2. If not covered by org role, check project-level permission (if project context exists)
      const projectId =
        req.params.projectId || req.body.projectId || req.query.projectId;
      if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
        const projMembership = await ProjectMember.findOne({
          projectId,
          userId: req.user._id,
        });

        if (projMembership) {
          const projPermissions = RolePermissions[projMembership.role] || [];
          if (projPermissions.includes(requiredPermission)) {
            return next();
          }
        }
      }

      return res
        .status(403)
        .json({ error: `Forbidden: Missing permission ${requiredPermission}` });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};
