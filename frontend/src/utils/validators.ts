import { ALLOWED_FILE_EXTENSIONS, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from './constants';

/**
 * Validate file type and size
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  // Check file type
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_FILE_EXTENSIONS.includes(fileExtension)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`,
    };
  }

  // Check MIME type
  if (!ALLOWED_FILE_TYPES.includes(file.type) && file.type !== '') {
    return {
      valid: false,
      error: 'Invalid file MIME type',
    };
  }

  return { valid: true };
};

/**
 * Validate database connection params
 */
export const validateDbConnection = (params: {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!params.host || params.host.trim() === '') {
    errors.host = 'Host is required';
  }

  if (!params.port || params.port < 1 || params.port > 65535) {
    errors.port = 'Port must be between 1 and 65535';
  }

  if (!params.database || params.database.trim() === '') {
    errors.database = 'Database name is required';
  }

  if (!params.username || params.username.trim() === '') {
    errors.username = 'Username is required';
  }

  if (!params.password || params.password.trim() === '') {
    errors.password = 'Password is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate column mapping
 */
export const validateColumnMapping = (
  mapping: Record<string, string>,
  fileColumns: string[],
  dbColumns: string[]
): { valid: boolean; error?: string } => {
  if (Object.keys(mapping).length === 0) {
    return {
      valid: false,
      error: 'At least one column mapping is required',
    };
  }

  // Check if all mapped file columns exist
  for (const fileCol of Object.keys(mapping)) {
    if (!fileColumns.includes(fileCol)) {
      return {
        valid: false,
        error: `File column "${fileCol}" does not exist`,
      };
    }
  }

  // Check if all mapped db columns exist
  for (const dbCol of Object.values(mapping)) {
    if (dbCol && !dbColumns.includes(dbCol)) {
      return {
        valid: false,
        error: `Database column "${dbCol}" does not exist`,
      };
    }
  }

  return { valid: true };
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
