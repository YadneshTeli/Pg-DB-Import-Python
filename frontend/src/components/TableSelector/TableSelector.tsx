import React, { useEffect, useState } from 'react';
import { Alert, Loading } from '../common';
import { useDatabase } from '../../hooks/useDatabase';
import styles from './TableSelector.module.css';

interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
}

interface TableSchema {
  columns: TableColumn[];
}

interface TableSelectorProps {
  connectionId: string;
  onTableSelect?: (tableName: string, schema: TableSchema) => void;
}

export const TableSelector: React.FC<TableSelectorProps> = ({
  connectionId,
  onTableSelect,
}) => {
  const {
    tables,
    selectedTable,
    setSelectedTable,
    tableSchema,
    isLoading,
    error,
    fetchTables,
    fetchTableSchema,
  } = useDatabase();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (connectionId) {
      fetchTables(connectionId);
    }
  }, [connectionId, fetchTables]);

  const handleTableClick = async (tableName: string) => {
    setSelectedTable(tableName);
    const result = await fetchTableSchema(connectionId, tableName);
    if (result.success && result.schema && onTableSelect) {
      onTableSelect(tableName, result.schema);
    }
  };

  const filteredTables = tables.filter((table) =>
    table.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Select Target Table</h2>
      <p className={styles.description}>
        Choose the database table where data will be imported
      </p>

      {error && <Alert type="error" message={error} />}

      {isLoading && !tables.length ? (
        <Loading text="Loading tables..." />
      ) : (
        <>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {filteredTables.length > 0 ? (
            <div className={styles.tableList}>
              {filteredTables.map((table) => (
                <div
                  key={table}
                  className={`${styles.tableItem} ${
                    selectedTable === table ? styles.selected : ''
                  }`}
                  onClick={() => handleTableClick(table)}
                >
                  <span className={styles.tableName}>📋 {table}</span>
                  {selectedTable === table && (
                    <span className={styles.checkmark}>✓</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No tables found</p>
            </div>
          )}

          {selectedTable && tableSchema && (
            <div className={styles.schemaPreview}>
              <h3 className={styles.schemaTitle}>Table Schema</h3>
              <div className={styles.schemaContent}>
                <div className={styles.schemaHeader}>
                  <span>Column Name</span>
                  <span>Type</span>
                  <span>Nullable</span>
                </div>
                {tableSchema.columns?.map((column: TableColumn, index: number) => (
                  <div key={index} className={styles.schemaRow}>
                    <span className={styles.columnName}>{column.name}</span>
                    <span className={styles.columnType}>{column.type}</span>
                    <span className={styles.columnNullable}>
                      {column.nullable ? 'Yes' : 'No'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
