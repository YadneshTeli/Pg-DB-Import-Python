import psycopg2
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class DBService:
    def __init__(self, connection):
        self.connection = connection
    
    def get_tables(self) -> List[str]:
        """Get list of all tables in public schema"""
        try:
            cursor = self.connection.cursor()
            query = """
                SELECT tablename 
                FROM pg_catalog.pg_tables 
                WHERE schemaname='public'
                ORDER BY tablename;
            """
            cursor.execute(query)
            tables = [row['tablename'] for row in cursor.fetchall()]
            cursor.close()
            return tables
        except Exception as e:
            logger.error(f"Error fetching tables: {str(e)}")
            raise
    
    def get_table_schema(self, table_name: str) -> List[Dict]:
        """Get column names and data types for a table"""
        try:
            cursor = self.connection.cursor()
            query = """
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = %s AND table_schema='public'
                ORDER BY ordinal_position;
            """
            cursor.execute(query, (table_name,))
            schema = cursor.fetchall()
            cursor.close()
            return schema
        except Exception as e:
            logger.error(f"Error fetching schema: {str(e)}")
            raise
    
    def insert_data(self, table_name: str, data: List[Dict]) -> Dict:
        """Insert data into table with logging"""
        try:
            cursor = self.connection.cursor()
            successful = 0
            failed = 0
            errors = []
            
            for idx, row in enumerate(data):
                try:
                    columns = ', '.join(row.keys())
                    placeholders = ', '.join(['%s'] * len(row))
                    query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
                    cursor.execute(query, list(row.values()))
                    successful += 1
                    logger.info(f"Row {idx + 1} inserted successfully")
                except Exception as e:
                    failed += 1
                    error_msg = f"Row {idx + 1}: {str(e)}"
                    errors.append(error_msg)
                    logger.error(error_msg)
            
            self.connection.commit()
            cursor.close()
            
            return {
                "total": len(data),
                "successful": successful,
                "failed": failed,
                "errors": errors
            }
        except Exception as e:
            self.connection.rollback()
            logger.error(f"Transaction failed: {str(e)}")
            raise