import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DatabaseProvider } from './context/DatabaseContext';
import { ImportProvider } from './context/ImportContext';
import { Home } from './pages/Home';
import { ImportWizard } from './pages/ImportWizard';
import './App.css';

function App() {
  return (
    <Router>
      <DatabaseProvider>
        <ImportProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/import" element={<ImportWizard />} />
          </Routes>
        </ImportProvider>
      </DatabaseProvider>
    </Router>
  );
}

export default App;
