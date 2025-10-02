import React, { useState, useEffect } from 'react';
import { Button, Alert } from '../common';
import { validateColumnMapping } from '../../utils/validators';
import styles from './ColumnMapping.module.css';

interface ColumnMappingProps {
  fileColumns: string[];
  dbColumns: Array<{ name: string; type: string; nullable: boolean }>;
  onMappingComplete?: (mapping: Record<string, string>) => void;
}

export const ColumnMapping: React.FC<ColumnMappingProps> = ({
  fileColumns,
  dbColumns,
  onMappingComplete,
}) => {
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [autoMapped, setAutoMapped] = useState(false);

  // Auto-map columns with matching names
  useEffect(() => {
    if (!autoMapped && fileColumns.length > 0 && dbColumns.length > 0) {
      const autoMapping: Record<string, string> = {};
      fileColumns.forEach((fileCol) => {
        const dbCol = dbColumns.find(
          (db) => db.name.toLowerCase() === fileCol.toLowerCase()
        );
        if (dbCol) {
          autoMapping[fileCol] = dbCol.name;
        }
      });
      setMapping(autoMapping);
      setAutoMapped(true);
    }
  }, [fileColumns, dbColumns, autoMapped]);

  const handleMappingChange = (fileColumn: string, dbColumn: string) => {
    setMapping((prev) => ({
      ...prev,
      [fileColumn]: dbColumn,
    }));
    setError(null);
  };

  const handleRemoveMapping = (fileColumn: string) => {
    setMapping((prev) => {
      const newMapping = { ...prev };
      delete newMapping[fileColumn];
      return newMapping;
    });
  };

  const handleSubmit = () => {
    const validation = validateColumnMapping(
      mapping,
      fileColumns,
      dbColumns.map((col) => col.name)
    );

    if (!validation.valid) {
      setError(validation.error || 'Invalid column mapping');
      return;
    }

    if (onMappingComplete) {
      onMappingComplete(mapping);
    }
  };

  const mappedFileColumns = Object.keys(mapping);
  const unmappedFileColumns = fileColumns.filter(
    (col) => !mappedFileColumns.includes(col)
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Map Columns</h2>
      <p className={styles.description}>
        Map file columns to database table columns
      </p>

      {error && <Alert type="error" message={error} />}

      <div className={styles.mappingContainer}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Mapped Columns ({mappedFileColumns.length})
          </h3>
          {mappedFileColumns.length > 0 ? (
            <div className={styles.mappingList}>
              {mappedFileColumns.map((fileCol) => (
                <div key={fileCol} className={styles.mappingRow}>
                  <div className={styles.columnInfo}>
                    <span className={styles.fileColumn}>{fileCol}</span>
                    <span className={styles.arrow}>→</span>
                    <select
                      value={mapping[fileCol]}
                      onChange={(e) =>
                        handleMappingChange(fileCol, e.target.value)
                      }
                      className={styles.select}
                    >
                      <option value="">Select column...</option>
                      {dbColumns.map((dbCol) => (
                        <option key={dbCol.name} value={dbCol.name}>
                          {dbCol.name} ({dbCol.type})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => handleRemoveMapping(fileCol)}
                    className={styles.removeButton}
                    title="Remove mapping"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyState}>No columns mapped yet</p>
          )}
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Unmapped File Columns ({unmappedFileColumns.length})
          </h3>
          {unmappedFileColumns.length > 0 ? (
            <div className={styles.unmappedList}>
              {unmappedFileColumns.map((col) => (
                <div key={col} className={styles.unmappedRow}>
                  <span className={styles.unmappedColumn}>{col}</span>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleMappingChange(col, e.target.value);
                      }
                    }}
                    className={styles.selectSmall}
                    defaultValue=""
                  >
                    <option value="">Map to...</option>
                    {dbColumns.map((dbCol) => (
                      <option key={dbCol.name} value={dbCol.name}>
                        {dbCol.name} ({dbCol.type})
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyState}>All columns mapped!</p>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          onClick={handleSubmit}
          variant="primary"
          size="large"
          disabled={mappedFileColumns.length === 0}
        >
          Continue with {mappedFileColumns.length} Column
          {mappedFileColumns.length !== 1 ? 's' : ''}
        </Button>
      </div>

      {mappedFileColumns.length === 0 && (
        <Alert
          type="warning"
          message="You must map at least one column to continue"
        />
      )}
    </div>
  );
};
