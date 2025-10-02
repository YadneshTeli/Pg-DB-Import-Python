# PostgreSQL Data Import Tool

A full-stack web application for importing CSV and Excel files into PostgreSQL databases with ease.

## 🚀 Features

- **Database Connection**: Easy PostgreSQL connection with credential validation
- **File Upload**: Support for CSV, XLS, and XLSX files up to 100MB
- **Smart Column Mapping**: Intelligent auto-mapping with manual override options
- **Batch Processing**: Fast imports with configurable batch sizes
- **Progress Tracking**: Real-time progress updates and detailed statistics
- **Data Validation**: Pre-import validation to prevent errors

## 📋 Prerequisites

- **Python 3.8+** for the backend
- **Node.js 16+** and **npm** for the frontend
- **PostgreSQL 12+** database

## 🛠️ Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Start the FastAPI server:
   ```bash
   python -m uvicorn app.main:app --reload --host localhost --port 8000
   ```

   The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
Py-DB-Import/
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── routers/       # API endpoints
│   │   ├── services/      # Business logic
│   │   ├── schemas/       # Pydantic models
│   │   └── utils/         # Helper functions
│   ├── requirements.txt   # Python dependencies
│   └── .env.example       # Environment variables template
│
└── frontend/              # React + TypeScript frontend
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── pages/         # Page components
    │   ├── context/       # React Context providers
    │   ├── hooks/         # Custom React hooks
    │   ├── services/      # API communication
    │   └── utils/         # Helper functions
    ├── package.json       # npm dependencies
    └── .env.example       # Environment variables template
```

## 🎯 Usage

1. **Start the Application**: Launch both backend and frontend servers

2. **Connect to Database**: Enter your PostgreSQL connection details

3. **Upload File**: Select a CSV or Excel file to import

4. **Select Table**: Choose the target database table

5. **Map Columns**: Map file columns to database columns (auto-mapped by default)

6. **Import Data**: Start the import and monitor progress in real-time

## 🔧 Configuration

### Backend Environment Variables (`.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
ALLOWED_HOSTS=["localhost", "127.0.0.1"]
```

### Frontend Environment Variables (`.env`)

```env
VITE_API_URL=http://localhost:8000
```

## 🧪 API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Frontend powered by [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- Styled with CSS Modules
