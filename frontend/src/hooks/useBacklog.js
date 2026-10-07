import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { backlogApi } from "../api/backlog.api";

export const useBacklog = (orgId, projectId) =>
  useQuery({
    queryKey: ["backlog", projectId],
    queryFn: () => backlogApi.getBacklog(orgId, projectId),
    enabled: !!projectId && !!orgId,
  });

export const useCreateRequirement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, projectId, data }) =>
      backlogApi.createRequirement(orgId, projectId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["backlog", projectId] });
    },
  });
};

export const useCreateEpic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, projectId, data }) =>
      backlogApi.createEpic(orgId, projectId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["backlog", projectId] });
    },
  });
};

export const useCreateUserStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, projectId, data }) =>
      backlogApi.createUserStory(orgId, projectId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["backlog", projectId] });
    },
  });
};
