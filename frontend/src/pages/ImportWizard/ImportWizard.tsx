import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatabaseConnection } from '../../components/DatabaseConnection';
import { FileUpload } from '../../components/FileUpload';
import { TableSelector } from '../../components/TableSelector';
import { ColumnMapping } from '../../components/ColumnMapping';
import { ImportProgress } from '../../components/ImportProgress';
import { Button } from '../../components/common';
import { DatabaseContext } from '../../context/DatabaseContext';
import { ImportContext } from '../../context/ImportContext';
import { useImport } from '../../hooks/useImport';
import { IMPORT_STEPS } from '../../utils/constants';
import styles from './ImportWizard.module.css';

export const ImportWizard: React.FC = () => {
  const navigate = useNavigate();
  const databaseContext = useContext(DatabaseContext);
  const importContext = useContext(ImportContext);
  const { startImport, cancelImport } = useImport();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [connectionId, setConnectionId] = useState<string>('');
  const [fileData, setFileData] = useState<{
    file_id: string;
    columns: string[];
  } | null>(null);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableSchema, setTableSchema] = useState<{
    columns: Array<{ name: string; type: string; nullable: boolean }>;
  } | null>(null);

  const handleConnectionSuccess = (connId: string) => {
    setConnectionId(connId);
    setCurrentStep(1);
  };

  const handleFileUploadSuccess = (_fileId: string, data: unknown) => {
    setFileData(data as { file_id: string; columns: string[] });
    setCurrentStep(2);
  };

  const handleTableSelect = (tableName: string, schema: { columns: Array<{ name: string; type: string; nullable: boolean }> }) => {
    setSelectedTable(tableName);
    setTableSchema(schema);
    setCurrentStep(3);
  };

  const handleMappingComplete = (mapping: Record<string, string>) => {
    handleStartImport(mapping);
  };

  const handleStartImport = async (mapping: Record<string, string>) => {
    if (!fileData) return;
    setCurrentStep(4);
    await startImport(fileData.file_id, connectionId, selectedTable, mapping);
  };

  const handleCancelImport = async () => {
    if (importContext?.importStatus?.id) {
      await cancelImport(importContext.importStatus.id);
    }
  };

  const handleReset = () => {
    databaseContext?.resetConnection();
    importContext?.resetImport();
    setCurrentStep(0);
    setConnectionId('');
    setFileData(null);
    setSelectedTable('');
    setTableSchema(null);
  };

  const handleGoBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button onClick={handleGoHome} variant="secondary" size="small">
          ← Home
        </Button>
        <h1 className={styles.title}>Import Wizard</h1>
      </div>

      <div className={styles.stepper}>
        {IMPORT_STEPS.map((step, index) => (
          <div
            key={step.id}
            className={`${styles.step} ${
              index === currentStep ? styles.active : ''
            } ${index < currentStep ? styles.completed : ''}`}
          >
            <div className={styles.stepNumber}>
              {index < currentStep ? '✓' : step.id}
            </div>
            <div className={styles.stepInfo}>
              <div className={styles.stepName}>{step.name}</div>
              <div className={styles.stepDescription}>{step.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.content}>
        {currentStep === 0 && (
          <DatabaseConnection onConnectionSuccess={handleConnectionSuccess} />
        )}

        {currentStep === 1 && (
          <FileUpload onUploadSuccess={handleFileUploadSuccess} />
        )}

        {currentStep === 2 && connectionId && (
          <TableSelector
            connectionId={connectionId}
            onTableSelect={handleTableSelect}
          />
        )}

        {currentStep === 3 && fileData && tableSchema && (
          <ColumnMapping
            fileColumns={fileData.columns}
            dbColumns={tableSchema.columns}
            onMappingComplete={handleMappingComplete}
          />
        )}

        {currentStep === 4 && importContext?.importStatus && (
          <ImportProgress
            status={importContext.importStatus}
            onCancel={handleCancelImport}
            onReset={handleReset}
          />
        )}
      </div>

      {currentStep > 0 && currentStep < 4 && (
        <div className={styles.navigation}>
          <Button onClick={handleGoBack} variant="secondary" size="large">
            ← Previous Step
          </Button>
        </div>
      )}
    </div>
  );
};
