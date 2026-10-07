import { Router } from "express";
import { organizationController } from "../controllers/organization.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  requireOrgMembership,
  requirePermission,
} from "../middleware/rbac.middleware.js";
import { Permission } from "@projectpulse/shared";
import projectRoutes from "./project.routes.js";

const router = Router();

// Requires only authentication
router.post("/", requireAuth, organizationController.create);
router.get("/", requireAuth, organizationController.listMine);

// Requires organization membership and specific permissions
router.post(
  "/:orgId/members",
  requireAuth,
  requireOrgMembership,
  requirePermission(Permission.MEMBER_INVITE),
  organizationController.invite,
);

// Mount project routes under organization
router.use("/:orgId/projects", projectRoutes);

export default router;
