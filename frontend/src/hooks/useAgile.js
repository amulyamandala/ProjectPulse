import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { agileApi } from "../api/agile.api";

export const useCreateSprint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, projectId, data }) =>
      agileApi.createSprint(orgId, projectId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "sprintHealth", projectId],
      });
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, projectId, data }) =>
      agileApi.createTask(orgId, projectId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "overview", projectId],
      });
    },
  });
};

export const useBoard = (orgId, projectId) =>
  useQuery({
    queryKey: ["board", projectId],
    queryFn: () => agileApi.getBoard(orgId, projectId),
    enabled: !!projectId && !!orgId,
  });

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, projectId, taskId, status }) =>
      agileApi.updateTaskStatus(orgId, projectId, taskId, status),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["board", projectId] });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "overview", projectId],
      });
    },
  });
};
