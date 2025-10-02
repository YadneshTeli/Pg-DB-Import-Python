import React, { createContext, useState, type ReactNode } from 'react';

interface DatabaseConnection {
  id: string;
  host: string;
  port: number;
  database: string;
  username: string;
  isConnected: boolean;
}

interface TableSchema {
  columns: Array<{
    name: string;
    type: string;
    nullable: boolean;
  }>;
}

interface DatabaseContextType {
  connection: DatabaseConnection | null;
  setConnection: (connection: DatabaseConnection | null) => void;
  tables: string[];
  setTables: (tables: string[]) => void;
  selectedTable: string | null;
  setSelectedTable: (table: string | null) => void;
  tableSchema: TableSchema | null;
  setTableSchema: (schema: TableSchema | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  resetConnection: () => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [connection, setConnection] = useState<DatabaseConnection | null>(null);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableSchema, setTableSchema] = useState<TableSchema | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetConnection = () => {
    setConnection(null);
    setTables([]);
    setSelectedTable(null);
    setTableSchema(null);
    setError(null);
  };

  return (
    <DatabaseContext.Provider
      value={{
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
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export { DatabaseContext };
