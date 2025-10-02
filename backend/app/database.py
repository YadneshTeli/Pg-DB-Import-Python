import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class DatabaseConnection:
    def __init__(self, connection_url: str):
        self.connection_url = connection_url
        self.connection = None
    
    def test_connection(self) -> dict:
        """Test database connection"""
        try:
            self.connection = psycopg2.connect(
                self.connection_url,
                cursor_factory=RealDictCursor
            )
            self.connection.close()
            return {"status": "success", "message": "Connection successful"}
        except Exception as e:
            logger.error(f"Connection failed: {str(e)}")
            return {"status": "error", "message": str(e)}
    
    def get_connection(self):
        """Get database connection"""
        if not self.connection or self.connection.closed:
            self.connection = psycopg2.connect(
                self.connection_url,
                cursor_factory=RealDictCursor
            )
        return self.connection
    
    def close(self):
        """Close connection"""
        if self.connection:
            self.connection.close()