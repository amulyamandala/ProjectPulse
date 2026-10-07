import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { milestonesApi } from "../api/milestones.api";

export const useMilestones = (orgId, projectId) =>
  useQuery({
    queryKey: ["milestones", projectId],
    queryFn: () => milestonesApi.getMilestones(orgId, projectId),
    enabled: !!projectId && !!orgId,
  });

export const useCreateMilestone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, projectId, data }) =>
      milestonesApi.createMilestone(orgId, projectId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
    },
  });
};
