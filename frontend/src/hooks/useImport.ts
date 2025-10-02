import { useContext, useState, useEffect } from 'react';
import { ImportContext } from '../context/ImportContext';
import { importAPI } from '../services/apiEndpoints';

export const useImport = () => {
  const context = useContext(ImportContext);
  if (!context) {
    throw new Error('useImport must be used within an ImportProvider');
  }

  const {
    file,
    columnMapping,
    importOptions,
    importStatus,
    setImportStatus,
    currentStep,
    error,
    setError,
  } = context;

  const [pollingInterval, setPollingInterval] = useState<number | null>(null);

  const startImport = async (
    fileId: string,
    connectionId: string,
    tableName: string,
    mapping: Record<string, string>
  ) => {
    setError(null);
    try {
      const response = await importAPI.startImport({
        file_id: fileId,
        connection_id: connectionId,
        table_name: tableName,
        column_mapping: mapping,
        options: importOptions,
      });

      const importData = response.data;
      setImportStatus({
        id: importData.import_id,
        status: 'pending',
        progress: 0,
        total_rows: importData.total_rows || 0,
        processed_rows: 0,
        failed_rows: 0,
        message: 'Import started',
        started_at: new Date().toISOString(),
      });

      // Start polling for status
      startStatusPolling(importData.import_id);

      return { success: true, import_id: importData.import_id };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }; message?: string };
      const errorMessage = error.response?.data?.detail || error.message || 'Import failed to start';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const checkImportStatus = async (importId: string) => {
    try {
      const response = await importAPI.getImportStatus(importId);
      const status = response.data;
      
      setImportStatus({
        id: importId,
        status: status.status,
        progress: status.progress || 0,
        total_rows: status.total_rows || 0,
        processed_rows: status.processed_rows || 0,
        failed_rows: status.failed_rows || 0,
        message: status.message || '',
        started_at: status.started_at,
        completed_at: status.completed_at,
      });

      // Stop polling if import is complete
      if (['completed', 'failed', 'cancelled'].includes(status.status)) {
        stopStatusPolling();
      }

      return { success: true, status };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }; message?: string };
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to check status';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const cancelImport = async (importId: string) => {
    try {
      await importAPI.cancelImport(importId);
      stopStatusPolling();
      return { success: true };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }; message?: string };
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to cancel import';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const startStatusPolling = (importId: string) => {
    stopStatusPolling(); // Clear any existing interval
    
    const interval = setInterval(() => {
      checkImportStatus(importId);
    }, 2000); // Poll every 2 seconds
    
    setPollingInterval(interval);
  };

  const stopStatusPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  const getImportHistory = async (limit: number = 50) => {
    try {
      const response = await importAPI.getImportHistory(limit);
      return { success: true, history: response.data };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }; message?: string };
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch history';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  return {
    file,
    columnMapping,
    importOptions,
    importStatus,
    currentStep,
    error,
    startImport,
    checkImportStatus,
    cancelImport,
    getImportHistory,
  };
};
