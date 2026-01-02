import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ITParkLogo from './components/ITParkLogo'

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
                <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-green-50" />
                    <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
                    <div className="absolute top-0 -right-4 w-96 h-96 bg-lime-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-2000" />
                    <div className="absolute -bottom-8 left-20 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-4000" />

                    {/* IT Park Watermark */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 select-none pointer-events-none">
                        <ITParkLogo variant="full" className="w-[80vw] h-auto text-emerald-900/10" />
                    </div>
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
