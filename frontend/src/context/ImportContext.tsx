import React, { createContext, useState, type ReactNode } from 'react';

interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  rows: number;
  columns: string[];
  preview: Record<string, unknown>[];
}

interface ColumnMapping {
  [fileColumn: string]: string; // Maps file column to database column
}

interface ImportOptions {
  if_exists: 'fail' | 'replace' | 'append';
  batch_size: number;
}

interface ImportStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  total_rows: number;
  processed_rows: number;
  failed_rows: number;
  message: string;
  started_at?: string;
  completed_at?: string;
}

interface ImportContextType {
  file: FileData | null;
  setFile: (file: FileData | null) => void;
  columnMapping: ColumnMapping;
  setColumnMapping: (mapping: ColumnMapping) => void;
  importOptions: ImportOptions;
  setImportOptions: (options: ImportOptions) => void;
  importStatus: ImportStatus | null;
  setImportStatus: (status: ImportStatus | null) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
  uploadProgress: number;
  setUploadProgress: (progress: number) => void;
  error: string | null;
  setError: (error: string | null) => void;
  resetImport: () => void;
}

const ImportContext = createContext<ImportContextType | undefined>(undefined);

export const ImportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [file, setFile] = useState<FileData | null>(null);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [importOptions, setImportOptions] = useState<ImportOptions>({
    if_exists: 'append',
    batch_size: 1000,
  });
  const [importStatus, setImportStatus] = useState<ImportStatus | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const resetImport = () => {
    setFile(null);
    setColumnMapping({});
    setImportOptions({
      if_exists: 'append',
      batch_size: 1000,
    });
    setImportStatus(null);
    setCurrentStep(0);
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
  };

  return (
    <ImportContext.Provider
      value={{
        file,
        setFile,
        columnMapping,
        setColumnMapping,
        importOptions,
        setImportOptions,
        importStatus,
        setImportStatus,
        currentStep,
        setCurrentStep,
        isUploading,
        setIsUploading,
        uploadProgress,
        setUploadProgress,
        error,
        setError,
        resetImport,
      }}
    >
      {children}
    </ImportContext.Provider>
  );
};

export { ImportContext };
