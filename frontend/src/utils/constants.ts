// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// File Upload
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const ALLOWED_FILE_TYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
export const ALLOWED_FILE_EXTENSIONS = ['.csv', '.xls', '.xlsx'];

// Import Options
export const DEFAULT_BATCH_SIZE = 1000;
export const IMPORT_IF_EXISTS_OPTIONS = [
  { value: 'fail', label: 'Fail (error if table exists)' },
  { value: 'replace', label: 'Replace (drop and recreate table)' },
  { value: 'append', label: 'Append (add to existing table)' },
] as const;

// Polling
export const STATUS_POLL_INTERVAL = 2000; // 2 seconds

// Database
export const DEFAULT_DB_PORT = 5432;
export const DB_TIMEOUT = 30000; // 30 seconds

// Steps
export const IMPORT_STEPS = [
  { id: 1, name: 'Connect Database', description: 'Configure database connection' },
  { id: 2, name: 'Upload File', description: 'Upload CSV or Excel file' },
  { id: 3, name: 'Select Table', description: 'Choose target table' },
  { id: 4, name: 'Map Columns', description: 'Map file columns to database columns' },
  { id: 5, name: 'Import', description: 'Start data import' },
] as const;
