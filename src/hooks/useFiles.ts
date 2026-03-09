import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useFiles = (folderId?: string | null) => {
  return useQuery({
    queryKey: ['files', folderId],
    queryFn: async () => {
      const params = folderId ? `?folderId=${folderId}` : '';
      const res = await api.get(`/api/files${params}`);
      return res.data;
    },
  });
};

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      fileName: string;
      fileData: string;
      mimeType: string;
      fileSize: number;
      folderId?: string | null;
    }) => {
      const res = await api.post('/api/files/upload', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/files/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};

export const useSearch = () => {
  return useMutation({
    mutationFn: async (q: string) => {
      const res = await api.get(`/api/files/search?q=${encodeURIComponent(q)}`);
      return res.data;
    },
  });
};