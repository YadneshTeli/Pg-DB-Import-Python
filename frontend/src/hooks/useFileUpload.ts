import { useState } from 'react';
import { fileAPI } from '../services/apiEndpoints';

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileData, setFileData] = useState<{
    id: string;
    name: string;
    size: number;
    type: string;
    rows: number;
    columns: string[];
    preview: Record<string, unknown>[];
  } | null>(null);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fileAPI.uploadFile(formData, (progressEvent) => {
        const percentCompleted = progressEvent.total 
          ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
          : 0;
        setUploadProgress(percentCompleted);
      });

      const data = response.data;
      setFileData({
        id: data.file_id,
        name: file.name,
        size: file.size,
        type: file.type,
        rows: data.rows,
        columns: data.columns,
        preview: data.preview || [],
      });

      return { success: true, data };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }; message?: string };
      const errorMessage = error.response?.data?.detail || error.message || 'File upload failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUploading(false);
    }
  };

  const validateFile = async (fileId: string) => {
    setError(null);
    try {
      const response = await fileAPI.validateFile(fileId);
      return { success: true, validation: response.data };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }; message?: string };
      const errorMessage = error.response?.data?.detail || error.message || 'File validation failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const getFilePreview = async (fileId: string, rows: number = 10) => {
    setError(null);
    try {
      const response = await fileAPI.getFilePreview(fileId, rows);
      return { success: true, preview: response.data };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }; message?: string };
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch preview';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const resetUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
    setFileData(null);
  };

  return {
    isUploading,
    uploadProgress,
    error,
    fileData,
    uploadFile,
    validateFile,
    getFilePreview,
    resetUpload,
  };
};
