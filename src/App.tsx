import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'


import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import EmployeeForm from './pages/EmployeeForm'
import Profile from './pages/Profile'
import ComingSoon from './pages/ComingSoon'

function App() {
    return (
        <Router>
            <div className="min-h-screen">
                {/* Animated background */}
                <div className="fixed inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50" />
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" />
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float animation-delay-2000" />
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float animation-delay-4000" />
                </div>

                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/employees/new" element={<EmployeeForm />} />
                    <Route path="/employees/:id/edit" element={<EmployeeForm />} />
                    <Route path="/profile" element={<Profile />} />

                    {/* Placeholder Routes */}
                    <Route path="/reports" element={
                        <ComingSoon
                            title="Hisobotlar"
                            description="Ushbu bo'limda keyingi versiyalarda batafsil statistika va hisobotlar paydo bo'ladi."
                        />
                    } />
                    <Route path="/calendar" element={
                        <ComingSoon
                            title="Kalendar"
                            description="Xodimlar ta'tili, tug'ilgan kunlar va muhim sanalar tez orada shu yerda bo'ladi."
                        />
                    } />
                </Routes>
            </div>
        </Router>
    )
}

export default App
