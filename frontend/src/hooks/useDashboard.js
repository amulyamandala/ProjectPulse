import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";

export const useDashboardOverview = (projectId) =>
  useQuery({
    queryKey: ["dashboard", "overview", projectId],
    queryFn: () => dashboardApi.getOverview(projectId),
    enabled: !!projectId,
  });

export const useSprintHealth = (projectId) =>
  useQuery({
    queryKey: ["dashboard", "sprintHealth", projectId],
    queryFn: () => dashboardApi.getSprintHealth(projectId),
    enabled: !!projectId,
  });

export const useTeamWorkload = (projectId) =>
  useQuery({
    queryKey: ["dashboard", "workload", projectId],
    queryFn: () => dashboardApi.getWorkload(projectId),
    enabled: !!projectId,
  });

export const useVelocity = (projectId) =>
  useQuery({
    queryKey: ["dashboard", "velocity", projectId],
    queryFn: () => dashboardApi.getVelocity(projectId),
    enabled: !!projectId,
  });

export const useRecentActivity = (projectId) =>
  useQuery({
    queryKey: ["dashboard", "activity", projectId],
    queryFn: () => dashboardApi.getActivity(projectId),
    enabled: !!projectId,
  });

export const useUpcomingDeadlines = (projectId) =>
  useQuery({
    queryKey: ["dashboard", "deadlines", projectId],
    queryFn: () => dashboardApi.getDeadlines(projectId),
    enabled: !!projectId,
  });

export const useTraceability = (projectId) =>
  useQuery({
    queryKey: ["dashboard", "traceability", projectId],
    queryFn: () => dashboardApi.getTraceability(projectId),
    enabled: !!projectId,
  });

export const useDefinitionOfDone = (projectId) =>
  useQuery({
    queryKey: ["dashboard", "dod", projectId],
    queryFn: () => dashboardApi.getDod(projectId),
    enabled: !!projectId,
  });
