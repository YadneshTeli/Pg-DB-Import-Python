import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common';
import styles from './Home.module.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleStartImport = () => {
    navigate('/import');
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>PostgreSQL Data Import Tool</h1>
        <p className={styles.subtitle}>
          Easily import CSV and Excel files into your PostgreSQL database
        </p>
        
        <Button
          onClick={handleStartImport}
          variant="primary"
          size="large"
          className={styles.ctaButton}
        >
          Start Import Wizard
        </Button>
      </div>

      <div className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🔌</div>
          <h3 className={styles.featureTitle}>Easy Connection</h3>
          <p className={styles.featureDescription}>
            Connect to any PostgreSQL database with simple credentials
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📁</div>
          <h3 className={styles.featureTitle}>File Upload</h3>
          <p className={styles.featureDescription}>
            Support for CSV, XLS, and XLSX files up to 100MB
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🗺️</div>
          <h3 className={styles.featureTitle}>Column Mapping</h3>
          <p className={styles.featureDescription}>
            Intelligent auto-mapping with manual override options
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>⚡</div>
          <h3 className={styles.featureTitle}>Batch Processing</h3>
          <p className={styles.featureDescription}>
            Fast imports with configurable batch sizes
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📊</div>
          <h3 className={styles.featureTitle}>Progress Tracking</h3>
          <p className={styles.featureDescription}>
            Real-time progress updates and detailed statistics
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>✅</div>
          <h3 className={styles.featureTitle}>Validation</h3>
          <p className={styles.featureDescription}>
            Data validation before import to prevent errors
          </p>
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          Built with React, TypeScript, and FastAPI
        </p>
      </div>
    </div>
  );
};
