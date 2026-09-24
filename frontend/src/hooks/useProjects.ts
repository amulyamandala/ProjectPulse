import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '../api/project.api';

export const useMyOrgs = () => 
  useQuery({ queryKey: ['orgs'], queryFn: projectApi.getMyOrgs });

export const useProjects = (orgId: string) => 
  useQuery({ queryKey: ['projects', orgId], queryFn: () => projectApi.getProjects(orgId), enabled: !!orgId });

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, name, key, desc }: any) => projectApi.createProject(orgId, name, key, desc),
    onSuccess: (_, { orgId }) => {
      queryClient.invalidateQueries({ queryKey: ['projects', orgId] });
    }
  });
};

export const useCreateOrg = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, slug }: any) => projectApi.createOrg(name, slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgs'] });
    }
  });
};
