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
      queryClient.invalidateQueries({ queryKey: ['storage'] });
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
      queryClient.invalidateQueries({ queryKey: ['storage'] });
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

// FILE MOVE
export const useMoveFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, folderId }: { id: string; folderId: string | null }) => {
      const res = await api.patch(`/api/files/${id}/move`, { folderId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
};

// FOLDER MOVE
export const useMoveFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, parentId }: { id: string; parentId: string | null }) => {
      const res = await api.patch(`/api/folders/${id}/move`, { parentId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
};

// add at the end:
export const useRenameFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await api.patch(`/api/files/${id}/rename`, { name });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['recent'] });
      queryClient.invalidateQueries({ queryKey: ['starred'] });
    },
  });
};