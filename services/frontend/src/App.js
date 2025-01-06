import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Locksmiths from './pages/admin/Locksmiths';
import LocksmithDetails from './pages/admin/LocksmithDetails';
import LocksmithReviews from './pages/admin/LocksmithReviews';
import LocksmithLogin from './pages/locksmith/Login';
import LocksmithDashboard from './pages/locksmith/Dashboard';
import CreateJob from './pages/locksmith/CreateJob';
import JobHistory from './pages/locksmith/JobHistory';
import JobDetail from './pages/locksmith/JobDetail';
import Profile from './pages/locksmith/Profile';
import Earnings from './pages/locksmith/Earnings';
import DailySummary from './pages/locksmith/DailySummary';
import JobTracking from './pages/locksmith/JobTracking';
import ServiceProviderLogin from './pages/provider/Login';
import ServiceProviderDashboard from './pages/provider/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/locksmith/login" />} />
        <Route path="/provider/login" element={<ServiceProviderLogin />} />
        <Route path="/provider/dashboard" element={<ServiceProviderDashboard />} />
        <Route path="/locksmith/jobs/create" element={<CreateJob />} />
        <Route path="/locksmith/jobs" element={<JobHistory />} />
        <Route path="/locksmith/jobs/:jobId" element={<JobDetail />} />
        <Route path="/locksmith/profile" element={<Profile />} />
        <Route path="/locksmith/earnings" element={<Earnings />} />
        <Route path="/locksmith/daily-summary" element={<DailySummary />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/locksmiths" element={<Locksmiths />} />
        <Route path="/admin/locksmiths/:id" element={<LocksmithDetails />} />
        <Route path="/admin/locksmiths/:id/reviews" element={<LocksmithReviews />} />
        <Route path="/locksmith/job/:jobId/track" element={<JobTracking />} />
      </Routes>
    </Router>
  );
}

export default App; 