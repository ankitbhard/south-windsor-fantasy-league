import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DraftProvider } from './context/DraftContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Draft from './pages/Draft';
import Team from './pages/Team';
import Admin from './pages/Admin';

function App() {
  return (
    <DraftProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/draft" element={<Draft />} />
          <Route path="/team" element={<Team />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </DraftProvider>
  );
}

export default App;