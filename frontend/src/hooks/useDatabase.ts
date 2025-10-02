import { useContext } from 'react';
import { DatabaseContext } from '../context/DatabaseContext';
import { databaseAPI } from '../services/apiEndpoints';

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }

  const {
    connection,
    setConnection,
    tables,
    setTables,
    selectedTable,
    setSelectedTable,
    tableSchema,
    setTableSchema,
    isLoading,
    setIsLoading,
    error,
    setError,
    resetConnection,
  } = context;

  const testConnection = async (credentials: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await databaseAPI.testConnection(credentials);
      const { connection_id, success, message } = response.data;
      
      if (success) {
        setConnection({
          id: connection_id,
          host: credentials.host,
          port: credentials.port,
          database: credentials.database,
          username: credentials.username,
          isConnected: true,
        });
        return { success: true, connection_id };
      } else {
        setError(message || 'Connection failed');
        return { success: false, error: message };
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }; message?: string };
      const errorMessage = error.response?.data?.detail || error.message || 'Connection failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTables = async (connectionId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await databaseAPI.getTables(connectionId);
      const tableList = response.data.tables || [];
      setTables(tableList);
      return { success: true, tables: tableList };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }; message?: string };
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch tables';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTableSchema = async (connectionId: string, tableName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await databaseAPI.getTableSchema(connectionId, tableName);
      setTableSchema(response.data);
      return { success: true, schema: response.data };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }; message?: string };
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch table schema';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    connection,
    tables,
    selectedTable,
    setSelectedTable,
    tableSchema,
    isLoading,
    error,
    testConnection,
    fetchTables,
    fetchTableSchema,
    resetConnection,
  };
};
