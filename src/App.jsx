import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Landing from './pages/Landing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import CandidateDashboard from './pages/CandidateDashboard'
import JobsBrowse from './pages/JobsBrowse'
import JobDetail from './pages/JobDetail'
import CandidateProfile from './pages/CandidateProfile'
import Applications from './pages/Applications'
import RecruiterDashboard from './pages/RecruiterDashboard'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<CandidateDashboard />} />
        <Route path="/jobs" element={<JobsBrowse />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/profile" element={<CandidateProfile />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
