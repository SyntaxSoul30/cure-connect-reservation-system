import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminLogin from './pages/admin/AdminLogin'
import DoctorLogin from './pages/doctor/DoctorLogin'

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard'
import BookingSuccess from './pages/patient/BookingSuccess'
import PatientProfileEdit from './pages/patient/PatientProfileEdit'
import BrowseDoctors from './pages/patient/BrowseDoctors'
import DoctorProfile from './pages/patient/DoctorProfile'
import BookAppointment from './pages/patient/BookAppointment'
import MyAppointments from './pages/patient/MyAppointments'

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import MyChambers from './pages/doctor/MyChambers'
import ChamberForm from './pages/doctor/ChamberForm'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import DoctorProfileEdit from './pages/doctor/DoctorProfileEdit'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminDoctors from './pages/admin/AdminDoctors'
import AdminDoctorForm from './pages/admin/AdminDoctorForm'
import AdminFacilities from './pages/admin/AdminFacilities'
import AdminFacilityForm from './pages/admin/AdminFacilityForm' // NEW IMPORT

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full" />
    </div>
  )

  if (!user) return <Navigate to="/login" replace />

  const userRole = (user.role || '').toLowerCase().trim();
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole === 'admin') return <Navigate to="/admin" replace />
    if (userRole === 'doctor') return <Navigate to="/doctor" replace />
    return <Navigate to="/" replace />
  }

  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="admin-portal" element={<AdminLogin />} />
        <Route path="doctor-portal" element={<DoctorLogin />} />

        {/* Patient Section */}
        <Route path="patient" element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>} />
        <Route path="patient/profile" element={<ProtectedRoute allowedRoles={['patient']}><PatientProfileEdit /></ProtectedRoute>} />
        <Route path="patient/doctors" element={<ProtectedRoute allowedRoles={['patient']}><BrowseDoctors /></ProtectedRoute>} />
        <Route path="patient/doctors/:doctorId" element={<ProtectedRoute allowedRoles={['patient']}><DoctorProfile /></ProtectedRoute>} />
        <Route path="patient/book/:doctorId/:chamberId" element={<ProtectedRoute allowedRoles={['patient']}><BookAppointment /></ProtectedRoute>} />
        <Route path="patient/appointments" element={<ProtectedRoute allowedRoles={['patient']}><MyAppointments /></ProtectedRoute>} />
        <Route path="patient/booking-success" element={<ProtectedRoute allowedRoles={['patient']}><BookingSuccess /></ProtectedRoute>} />

        {/* Doctor Section */}
        <Route path="doctor" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
        <Route path="doctor/chambers" element={<ProtectedRoute allowedRoles={['doctor']}><MyChambers /></ProtectedRoute>} />
        <Route path="doctor/chambers/new" element={<ProtectedRoute allowedRoles={['doctor']}><ChamberForm /></ProtectedRoute>} />
        <Route path="doctor/chambers/:chamberId/edit" element={<ProtectedRoute allowedRoles={['doctor']}><ChamberForm /></ProtectedRoute>} />
        <Route path="doctor/appointments" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorAppointments /></ProtectedRoute>} />
        <Route path="doctor/profile" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorProfileEdit /></ProtectedRoute>} />

        {/* Admin Section */}
        <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="admin/doctors" element={<ProtectedRoute allowedRoles={['admin']}><AdminDoctors /></ProtectedRoute>} />
        <Route path="admin/doctors/new" element={<ProtectedRoute allowedRoles={['admin']}><AdminDoctorForm /></ProtectedRoute>} />
        <Route path="admin/doctors/:doctorId/edit" element={<ProtectedRoute allowedRoles={['admin']}><AdminDoctorForm /></ProtectedRoute>} />
        
        {/* Admin Facilities Section (Updated) */}
        <Route path="admin/facilities" element={<ProtectedRoute allowedRoles={['admin']}><AdminFacilities /></ProtectedRoute>} />
        <Route path="admin/facilities/new" element={<ProtectedRoute allowedRoles={['admin']}><AdminFacilityForm /></ProtectedRoute>} />
        <Route path="admin/facilities/:facilityId/edit" element={<ProtectedRoute allowedRoles={['admin']}><AdminFacilityForm /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}