import React, { useRef, useState } from 'react';
import { Alert, Loading } from '../common';
import { useFileUpload } from '../../hooks/useFileUpload';
import { validateFile } from '../../utils/validators';
import { formatBytes, getFileExtension } from '../../utils/helpers';
import { ALLOWED_FILE_EXTENSIONS } from '../../utils/constants';
import styles from './FileUpload.module.css';

interface FileUploadProps {
  onUploadSuccess?: (fileId: string, fileData: unknown) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isUploading, uploadProgress, error, fileData, uploadFile } = useFileUpload();
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = async (file: File) => {
    setValidationError(null);
    
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid file');
      return;
    }

    // Upload file
    const result = await uploadFile(file);
    if (result.success && result.data && onUploadSuccess) {
      onUploadSuccess(result.data.file_id, result.data);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Upload File</h2>
      <p className={styles.description}>
        Upload a CSV or Excel file containing the data to import
      </p>

      {(error || validationError) && (
        <Alert type="error" message={error || validationError || ''} />
      )}

      {fileData && !isUploading && (
        <Alert
          type="success"
          title="File uploaded successfully!"
          message={`${fileData.name} (${formatBytes(fileData.size)}) - ${fileData.rows} rows, ${fileData.columns.length} columns`}
        />
      )}

      <div
        className={`${styles.dropzone} ${dragActive ? styles.active : ''} ${
          isUploading ? styles.uploading : ''
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className={styles.fileInput}
          accept={ALLOWED_FILE_EXTENSIONS.join(',')}
          onChange={handleChange}
          disabled={isUploading}
        />

        {isUploading ? (
          <div className={styles.uploadingState}>
            <Loading size="large" text="" />
            <p className={styles.uploadProgress}>
              Uploading... {uploadProgress}%
            </p>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className={styles.uploadPrompt}>
            <div className={styles.icon}>📁</div>
            <p className={styles.primaryText}>
              <span className={styles.clickText}>Click to upload</span> or drag and drop
            </p>
            <p className={styles.secondaryText}>
              CSV, XLS, XLSX files (max 100MB)
            </p>
          </div>
        )}
      </div>

      {fileData && !isUploading && (
        <div className={styles.fileInfo}>
          <h3 className={styles.fileInfoTitle}>File Details</h3>
          <div className={styles.fileDetails}>
            <div className={styles.detail}>
              <span className={styles.label}>Name:</span>
              <span className={styles.value}>{fileData.name}</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.label}>Size:</span>
              <span className={styles.value}>{formatBytes(fileData.size)}</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.label}>Type:</span>
              <span className={styles.value}>
                {getFileExtension(fileData.name).toUpperCase()}
              </span>
            </div>
            <div className={styles.detail}>
              <span className={styles.label}>Rows:</span>
              <span className={styles.value}>{fileData.rows.toLocaleString()}</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.label}>Columns:</span>
              <span className={styles.value}>{fileData.columns.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
