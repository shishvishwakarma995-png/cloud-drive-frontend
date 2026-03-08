import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// Get root contents
export const useRootContents = () => {
  return useQuery({
    queryKey: ['folders', 'root'],
    queryFn: async () => {
      const res = await api.get('/api/folders/root');
      return res.data;
    },
  });
};

// Get folder contents
export const useFolderContents = (folderId: string | null) => {
  return useQuery({
    queryKey: ['folders', folderId],
    queryFn: async () => {
      if (!folderId) {
        const res = await api.get('/api/folders/root');
        return res.data;
      }
      const res = await api.get(`/api/folders/${folderId}`);
      return res.data;
    },
  });
};

// Create folder
export const useCreateFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; parentId?: string | null }) => {
      const res = await api.post('/api/folders', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
};

// Rename folder
export const useUpdateFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; name?: string; parentId?: string | null }) => {
      const res = await api.patch(`/api/folders/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
};

// Delete folder
export const useDeleteFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/folders/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
};