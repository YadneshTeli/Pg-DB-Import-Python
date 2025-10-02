import React from 'react';
import styles from './Alert.module.css';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
}) => {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  return (
    <div className={`${styles.alert} ${styles[type]}`} role="alert">
      <div className={styles.content}>
        <span className={styles.icon}>{icons[type]}</span>
        <div className={styles.textContainer}>
          {title && <h4 className={styles.title}>{title}</h4>}
          <p className={styles.message}>{message}</p>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
};
