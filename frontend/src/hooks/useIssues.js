import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { issuesApi } from "../api/issues.api";

export const useIssues = (orgId, projectId) =>
  useQuery({
    queryKey: ["issues", projectId],
    queryFn: () => issuesApi.getIssues(orgId, projectId),
    enabled: !!projectId && !!orgId,
  });

export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, projectId, data }) =>
      issuesApi.createIssue(orgId, projectId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "overview", projectId],
      });
    },
  });
};

export const useUpdateIssueStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, projectId, issueId, status }) =>
      issuesApi.updateIssueStatus(orgId, projectId, issueId, status),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "overview", projectId],
      });
    },
  });
};
