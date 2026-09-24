import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';

export const useDashboardOverview = (projectId: string) => 
  useQuery({ queryKey: ['dashboard', 'overview', projectId], queryFn: () => dashboardApi.getOverview(projectId), enabled: !!projectId });

export const useSprintHealth = (projectId: string) => 
  useQuery({ queryKey: ['dashboard', 'sprintHealth', projectId], queryFn: () => dashboardApi.getSprintHealth(projectId), enabled: !!projectId });

export const useTeamWorkload = (projectId: string) => 
  useQuery({ queryKey: ['dashboard', 'workload', projectId], queryFn: () => dashboardApi.getWorkload(projectId), enabled: !!projectId });

export const useVelocity = (projectId: string) => 
  useQuery({ queryKey: ['dashboard', 'velocity', projectId], queryFn: () => dashboardApi.getVelocity(projectId), enabled: !!projectId });

export const useRecentActivity = (projectId: string) => 
  useQuery({ queryKey: ['dashboard', 'activity', projectId], queryFn: () => dashboardApi.getActivity(projectId), enabled: !!projectId });

export const useUpcomingDeadlines = (projectId: string) => 
  useQuery({ queryKey: ['dashboard', 'deadlines', projectId], queryFn: () => dashboardApi.getDeadlines(projectId), enabled: !!projectId });

export const useTraceability = (projectId: string) => 
  useQuery({ queryKey: ['dashboard', 'traceability', projectId], queryFn: () => dashboardApi.getTraceability(projectId), enabled: !!projectId });

export const useDefinitionOfDone = (projectId: string) => 
  useQuery({ queryKey: ['dashboard', 'dod', projectId], queryFn: () => dashboardApi.getDod(projectId), enabled: !!projectId });
