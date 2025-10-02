import api from './api';

// Database Connection Endpoints
export const databaseAPI = {
  testConnection: (data: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  }) => api.post('/api/database/test-connection', data),

  getTables: (connectionId: string) => 
    api.get(`/api/database/tables?connection_id=${connectionId}`),

  getTableSchema: (connectionId: string, tableName: string) =>
    api.get(`/api/database/schema?connection_id=${connectionId}&table_name=${tableName}`),
};

// File Upload Endpoints
export const fileAPI = {
  uploadFile: (formData: FormData, onUploadProgress?: (progressEvent: { loaded: number; total?: number }) => void) =>
    api.post('/api/import/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    }),

  validateFile: (fileId: string) =>
    api.post('/api/import/validate', { file_id: fileId }),

  getFilePreview: (fileId: string, rows?: number) =>
    api.get(`/api/import/preview?file_id=${fileId}&rows=${rows || 10}`),
};

// Import Endpoints
export const importAPI = {
  startImport: (data: {
    file_id: string;
    connection_id: string;
    table_name: string;
    column_mapping: Record<string, string>;
    options?: {
      if_exists?: 'fail' | 'replace' | 'append';
      batch_size?: number;
    };
  }) => api.post('/api/import/start', data),

  getImportStatus: (importId: string) =>
    api.get(`/api/import/status/${importId}`),

  cancelImport: (importId: string) =>
    api.post(`/api/import/cancel/${importId}`),

  getImportHistory: (limit?: number) =>
    api.get(`/api/import/history?limit=${limit || 50}`),
};

// Export all APIs
export default {
  database: databaseAPI,
  file: fileAPI,
  import: importAPI,
};
