import React, { useState } from 'react';
import { Button, Input, Alert, Loading } from '../common';
import { useDatabase } from '../../hooks/useDatabase';
import { validateDbConnection } from '../../utils/validators';
import { DEFAULT_DB_PORT } from '../../utils/constants';
import styles from './DatabaseConnection.module.css';

interface DatabaseConnectionProps {
  onConnectionSuccess?: (connectionId: string) => void;
}

export const DatabaseConnection: React.FC<DatabaseConnectionProps> = ({
  onConnectionSuccess,
}) => {
  const { connection, isLoading, error, testConnection } = useDatabase();
  
  const [formData, setFormData] = useState({
    host: 'localhost',
    port: DEFAULT_DB_PORT,
    database: '',
    username: 'postgres',
    password: '',
  });
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'port' ? parseInt(value) || 0 : value,
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateDbConnection(formData);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      return;
    }

    // Test connection
    const result = await testConnection(formData);
    if (result.success && result.connection_id && onConnectionSuccess) {
      onConnectionSuccess(result.connection_id);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Database Connection</h2>
      <p className={styles.description}>
        Connect to your PostgreSQL database to import data
      </p>

      {error && <Alert type="error" message={error} />}
      
      {connection?.isConnected && (
        <Alert
          type="success"
          title="Connected!"
          message={`Successfully connected to ${connection.database} on ${connection.host}`}
        />
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <Input
            label="Host"
            name="host"
            type="text"
            value={formData.host}
            onChange={handleInputChange}
            error={validationErrors.host}
            placeholder="localhost or IP address"
            required
            fullWidth
          />
          
          <Input
            label="Port"
            name="port"
            type="number"
            value={formData.port}
            onChange={handleInputChange}
            error={validationErrors.port}
            placeholder="5432"
            required
            fullWidth
          />
        </div>

        <Input
          label="Database Name"
          name="database"
          type="text"
          value={formData.database}
          onChange={handleInputChange}
          error={validationErrors.database}
          placeholder="my_database"
          required
          fullWidth
        />

        <Input
          label="Username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleInputChange}
          error={validationErrors.username}
          placeholder="postgres"
          required
          fullWidth
        />

        <div className={styles.passwordContainer}>
          <Input
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            error={validationErrors.password}
            placeholder="Enter password"
            required
            fullWidth
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.togglePassword}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          isLoading={isLoading}
        >
          {connection?.isConnected ? 'Reconnect' : 'Test Connection'}
        </Button>
      </form>

      {isLoading && <Loading text="Testing connection..." />}
    </div>
  );
};
