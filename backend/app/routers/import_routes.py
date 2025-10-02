from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict, List
import logging
import uuid
from datetime import datetime

from ..database import DatabaseConnection
from ..services.db_service import DBService
from ..services.file_service import FileService

router = APIRouter()
logger = logging.getLogger(__name__)

# Global storage (in production, use Redis or database)
active_connections = {}
uploaded_files = {}
import_jobs = {}

class DatabaseConnectionRequest(BaseModel):
    host: str
    port: int
    database: str
    username: str
    password: str

@router.post("/database/test-connection")
async def test_connection(request: DatabaseConnectionRequest):
    """Test database connection"""
    try:
        # Build connection URL
        connection_url = f"postgresql://{request.username}:{request.password}@{request.host}:{request.port}/{request.database}"
        db_conn = DatabaseConnection(connection_url)
        result = db_conn.test_connection()
        
        if result["status"] == "success":
            # Generate connection ID
            connection_id = str(uuid.uuid4())
            # Store connection
            active_connections[connection_id] = db_conn
            
            return {
                "success": True,
                "connection_id": connection_id,
                "message": "Connection successful"
            }
        else:
            return {
                "success": False,
                "message": result.get("message", "Connection failed")
            }
    except Exception as e:
        logger.error(f"Connection error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/database/tables")
async def get_tables(connection_id: str):
    """Get list of tables from connected database"""
    if connection_id not in active_connections:
        raise HTTPException(status_code=400, detail="Invalid connection ID")
    
    try:
        conn = active_connections[connection_id].get_connection()
        db_service = DBService(conn)
        tables = db_service.get_tables()
        return {"tables": tables}
    except Exception as e:
        logger.error(f"Error getting tables: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/database/schema")
async def get_table_schema(connection_id: str, table_name: str):
    """Get schema for specific table"""
    if connection_id not in active_connections:
        raise HTTPException(status_code=400, detail="Invalid connection ID")
    
    try:
        conn = active_connections[connection_id].get_connection()
        db_service = DBService(conn)
        schema = db_service.get_table_schema(table_name)
        return {"columns": schema}
    except Exception as e:
        logger.error(f"Error getting schema: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/import/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload and parse file"""
    try:
        # Read file
        df = FileService.read_file(file, file.filename)
        
        # Generate file ID
        file_id = str(uuid.uuid4())
        
        # Store file data in memory (in production, use proper storage)
        uploaded_files[file_id] = {
            "filename": file.filename,
            "data": df,
            "uploaded_at": datetime.now().isoformat()
        }
        
        return {
            "file_id": file_id,
            "filename": file.filename,
            "rows": len(df),
            "columns": list(df.columns)
        }
    except Exception as e:
        logger.error(f"Error uploading file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

class ImportStartRequest(BaseModel):
    connection_id: str
    file_id: str
    table_name: str
    column_mapping: Dict[str, str]

@router.post("/import/start")
async def start_import(request: ImportStartRequest):
    """Start import process"""
    if request.connection_id not in active_connections:
        raise HTTPException(status_code=400, detail="Invalid connection ID")
    
    if request.file_id not in uploaded_files:
        raise HTTPException(status_code=400, detail="Invalid file ID")
    
    try:
        # Generate import ID
        import_id = str(uuid.uuid4())
        
        # Get file data
        file_data = uploaded_files[request.file_id]
        df = file_data["data"]
        
        # Apply column mapping
        df_mapped = df.rename(columns=request.column_mapping)
        
        # Get connection
        conn = active_connections[request.connection_id].get_connection()
        db_service = DBService(conn)
        
        # Initialize import job
        import_jobs[import_id] = {
            "id": import_id,
            "status": "processing",
            "progress": 0,
            "total": len(df_mapped),
            "processed": 0,
            "errors": [],
            "started_at": datetime.now().isoformat()
        }
        
        # Convert to records
        data = df_mapped.to_dict(orient='records')
        
        # Insert data (simplified - in production, use async task queue)
        try:
            result = db_service.insert_data(request.table_name, data)
            import_jobs[import_id].update({
                "status": "completed",
                "progress": 100,
                "processed": len(data),
                "completed_at": datetime.now().isoformat()
            })
        except Exception as e:
            import_jobs[import_id].update({
                "status": "failed",
                "errors": [str(e)],
                "failed_at": datetime.now().isoformat()
            })
            raise
        
        return {
            "import_id": import_id,
            "status": "processing"
        }
    except Exception as e:
        logger.error(f"Error starting import: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/import/status/{import_id}")
async def get_import_status(import_id: str):
    """Get import job status"""
    if import_id not in import_jobs:
        raise HTTPException(status_code=404, detail="Import job not found")
    
    return import_jobs[import_id]

@router.post("/import/cancel/{import_id}")
async def cancel_import(import_id: str):
    """Cancel import job"""
    if import_id not in import_jobs:
        raise HTTPException(status_code=404, detail="Import job not found")
    
    job = import_jobs[import_id]
    if job["status"] in ["completed", "failed", "cancelled"]:
        raise HTTPException(status_code=400, detail=f"Cannot cancel {job['status']} job")
    
    import_jobs[import_id].update({
        "status": "cancelled",
        "cancelled_at": datetime.now().isoformat()
    })
    
    return {"message": "Import cancelled successfully"}

@router.get("/import/history")
async def get_import_history():
    """Get import history"""
    history = list(import_jobs.values())
    # Sort by started_at descending
    history.sort(key=lambda x: x.get("started_at", ""), reverse=True)
    return {"imports": history}
