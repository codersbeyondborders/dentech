import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Registration from './pages/Registration';
import DentistDashboard from './pages/DentistDashboard';
import PatientView from './pages/PatientView';
import RoleSelection from './pages/RoleSelection';
import PatientConnect from './pages/PatientConnect';
import PatientIntake from './pages/PatientIntake';
import { BiometricsProvider } from './contexts/BiometricsContext';

function App() {
  return (
    <BiometricsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/about" element={<Home />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/intake" element={<PatientIntake />} />
          <Route path="/dashboard" element={<DentistDashboard />} />
          <Route path="/patient-connect" element={<PatientConnect />} />
          <Route path="/patient" element={<PatientView />} />
        </Routes>
      </BrowserRouter>
    </BiometricsProvider>
  );
}

export default App;
