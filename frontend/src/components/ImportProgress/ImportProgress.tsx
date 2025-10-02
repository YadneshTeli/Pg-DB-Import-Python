import React from 'react';
import { Alert, Button, Loading } from '../common';
import { formatDuration } from '../../utils/helpers';
import styles from './ImportProgress.module.css';

interface ImportProgressProps {
  status: {
    id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    progress: number;
    total_rows: number;
    processed_rows: number;
    failed_rows: number;
    message: string;
    started_at?: string;
    completed_at?: string;
  };
  onCancel?: () => void;
  onReset?: () => void;
}

export const ImportProgress: React.FC<ImportProgressProps> = ({
  status,
  onCancel,
  onReset,
}) => {
  const getStatusColor = () => {
    switch (status.status) {
      case 'completed':
        return styles.success;
      case 'failed':
        return styles.error;
      case 'cancelled':
        return styles.warning;
      case 'processing':
        return styles.processing;
      default:
        return '';
    }
  };

  const getStatusIcon = () => {
    switch (status.status) {
      case 'completed':
        return '✓';
      case 'failed':
        return '✗';
      case 'cancelled':
        return '⊘';
      case 'processing':
        return '⟳';
      default:
        return '○';
    }
  };

  const calculateDuration = () => {
    if (!status.started_at) return null;
    const start = new Date(status.started_at).getTime();
    const end = status.completed_at
      ? new Date(status.completed_at).getTime()
      : new Date().getTime();
    return formatDuration(end - start);
  };

  const isActive = status.status === 'processing' || status.status === 'pending';
  const isComplete = status.status === 'completed';
  const hasFailed = status.status === 'failed';

  return (
    <div className={styles.container}>
      <div className={`${styles.statusCard} ${getStatusColor()}`}>
        <div className={styles.statusHeader}>
          <span className={styles.statusIcon}>{getStatusIcon()}</span>
          <h2 className={styles.statusTitle}>
            {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
          </h2>
        </div>
        
        {status.message && (
          <p className={styles.statusMessage}>{status.message}</p>
        )}
      </div>

      {isActive && <Loading text="Importing data..." />}

      <div className={styles.progressSection}>
        <div className={styles.progressInfo}>
          <span>Progress</span>
          <span className={styles.progressPercent}>{status.progress}%</span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFill} ${getStatusColor()}`}
            style={{ width: `${status.progress}%` }}
          />
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Rows</span>
          <span className={styles.statValue}>
            {status.total_rows.toLocaleString()}
          </span>
        </div>
        
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Processed</span>
          <span className={styles.statValue}>
            {status.processed_rows.toLocaleString()}
          </span>
        </div>
        
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Failed</span>
          <span className={`${styles.statValue} ${styles.errorText}`}>
            {status.failed_rows.toLocaleString()}
          </span>
        </div>
        
        {calculateDuration() && (
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Duration</span>
            <span className={styles.statValue}>{calculateDuration()}</span>
          </div>
        )}
      </div>

      {isComplete && (
        <Alert
          type="success"
          title="Import Completed!"
          message={`Successfully imported ${status.processed_rows} rows${
            status.failed_rows > 0 ? ` (${status.failed_rows} failed)` : ''
          }`}
        />
      )}

      {hasFailed && (
        <Alert
          type="error"
          title="Import Failed"
          message={status.message || 'An error occurred during import'}
        />
      )}

      <div className={styles.actions}>
        {isActive && onCancel && (
          <Button onClick={onCancel} variant="danger" size="large">
            Cancel Import
          </Button>
        )}
        
        {!isActive && onReset && (
          <Button onClick={onReset} variant="primary" size="large">
            Start New Import
          </Button>
        )}
      </div>
    </div>
  );
};
