import React from 'react';
import styles from './Loading.module.css';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  text = 'Loading...',
  fullScreen = false,
}) => {
  const spinnerClasses = `${styles.spinner} ${styles[size]}`;

  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        <div className={styles.container}>
          <div className={spinnerClasses}></div>
          {text && <p className={styles.text}>{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={spinnerClasses}></div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};
