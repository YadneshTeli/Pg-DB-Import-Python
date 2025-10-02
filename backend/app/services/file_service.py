import pandas as pd
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)

class FileService:
    @staticmethod
    def read_file(file, filename: str) -> pd.DataFrame:
        """Read CSV or Excel file into DataFrame"""
        try:
            if filename.endswith('.csv'):
                df = pd.read_csv(file.file)
            elif filename.endswith(('.xlsx', '.xls')):
                df = pd.read_excel(file.file, engine='openpyxl')
            else:
                raise ValueError("Unsupported file format. Use CSV or Excel.")
            
            logger.info(f"File {filename} read successfully. Shape: {df.shape}")
            return df
        except Exception as e:
            logger.error(f"Error reading file: {str(e)}")
            raise
    
    @staticmethod
    def check_missing_values(df: pd.DataFrame) -> Dict:
        """Check for missing values in DataFrame"""
        missing = df.isnull().sum()
        missing_dict = {col: int(count) for col, count in missing.items() if count > 0}
        
        total_missing = sum(missing_dict.values())
        return {
            "has_missing": total_missing > 0,
            "total_missing": total_missing,
            "missing_by_column": missing_dict
        }
    
    @staticmethod
    def validate_compatibility(df: pd.DataFrame, schema: List[Dict]) -> Dict:
        """Check if DataFrame columns match table schema"""
        table_columns = {col['column_name']: col['data_type'] for col in schema}
        df_columns = set(df.columns)
        required_columns = set(table_columns.keys())
        
        missing_columns = required_columns - df_columns
        extra_columns = df_columns - required_columns
        
        compatible = len(missing_columns) == 0
        
        return {
            "compatible": compatible,
            "missing_columns": list(missing_columns),
            "extra_columns": list(extra_columns),
            "table_columns": table_columns
        }