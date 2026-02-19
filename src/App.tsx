import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import AIChatbot from './components/AIChatbot'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import AdminDashboard from './pages/admin/Dashboard'
import Employees from './pages/Employees'
import EmployeeForm from './pages/EmployeeForm'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import Register from './pages/Register'

// Admin Pages
import AdminContent from './pages/admin/ContentManagement'
import AdminAnalytics from './pages/admin/Analytics'
import Testing from './pages/admin/Testing'
import Surveys from './pages/admin/Surveys'
import FeatureUnavailable from './pages/admin/FeatureUnavailable'
import TestBuilder from './pages/admin/TestBuilder'
import TestCatalog from './pages/admin/TestCatalog'
import TestResults from './pages/admin/TestResults'
import SurveyBuilder from './pages/admin/SurveyBuilder'
import SurveyCatalog from './pages/admin/SurveyCatalog'
import SurveyResults from './pages/admin/SurveyResults'
import SurveyTriggers from './pages/admin/SurveyTriggers'
import ArticleEditor from './pages/admin/ArticleEditor'
import ContentCatalog from './pages/admin/ContentCatalog'
import ContentPermissions from './pages/admin/ContentPermissions'
import Reports from './pages/admin/Reports'
import Calendar from './pages/admin/Calendar'

// User Pages
import UserDashboard from './pages/user/Dashboard'
import Tests from './pages/user/Tests'
import TakeTest from './pages/user/TakeTest'
import KnowledgeBase from './pages/user/KnowledgeBase'
import IPR from './pages/user/IPR'
import Results from './pages/user/Results'
import Feedback from './pages/user/Feedback'
import UserProfile from './pages/user/UserProfile'

function AppLayout() {
    return (
        <div className="min-h-screen">
            {/* Animated background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-green-50" />
                <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
                <div className="absolute top-0 -right-4 w-96 h-96 bg-lime-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-4000" />

                {/* IT Park Watermark - mahalliy logo (404 xatosini oldini olish) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 select-none pointer-events-none">
                    <img
                        src="/vite.svg"
                        alt="IT Park Watermark"
                        className="w-[80vw] h-auto max-w-2xl"
                    />
                </div>
            </div>
            <Outlet />
            <AIChatbot />
        </div>
    )
}

const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            { index: true, element: <Login /> },
            { path: "login", element: <Login /> },
            { path: "forgot-password", element: <ForgotPassword /> },
            { path: "register", element: <Register /> },

            /* Admin Routes - Protected */
            { path: "admin/dashboard", element: <ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute> },
            { path: "admin/employees", element: <ProtectedRoute requireAdmin><Employees /></ProtectedRoute> },
            { path: "admin/employees/new", element: <ProtectedRoute requireAdmin><EmployeeForm /></ProtectedRoute> },
            { path: "admin/employees/:id/edit", element: <ProtectedRoute requireAdmin><EmployeeForm /></ProtectedRoute> },
            { path: "admin/testing", element: <ProtectedRoute requireAdmin><Testing /></ProtectedRoute> },
            { path: "admin/testing/new", element: <ProtectedRoute requireAdmin><TestBuilder /></ProtectedRoute> },
            { path: "admin/testing/:id/edit", element: <ProtectedRoute requireAdmin><TestBuilder /></ProtectedRoute> },
            { path: "admin/testing/catalog", element: <ProtectedRoute requireAdmin><TestCatalog /></ProtectedRoute> },
            { path: "admin/testing/results", element: <ProtectedRoute requireAdmin><TestResults /></ProtectedRoute> },
            { path: "admin/surveys", element: <ProtectedRoute requireAdmin><Surveys /></ProtectedRoute> },
            { path: "admin/surveys/new", element: <ProtectedRoute requireAdmin><SurveyBuilder /></ProtectedRoute> },
            { path: "admin/surveys/:id/edit", element: <ProtectedRoute requireAdmin><SurveyBuilder /></ProtectedRoute> },
            { path: "admin/surveys/catalog", element: <ProtectedRoute requireAdmin><SurveyCatalog /></ProtectedRoute> },
            { path: "admin/surveys/results", element: <ProtectedRoute requireAdmin><SurveyResults /></ProtectedRoute> },
            { path: "admin/surveys/triggers", element: <ProtectedRoute requireAdmin><SurveyTriggers /></ProtectedRoute> },
            { path: "admin/content", element: <ProtectedRoute requireAdmin><AdminContent /></ProtectedRoute> },
            { path: "admin/content/new", element: <ProtectedRoute requireAdmin><ArticleEditor /></ProtectedRoute> },
            { path: "admin/content/catalog", element: <ProtectedRoute requireAdmin><ContentCatalog /></ProtectedRoute> },
            { path: "admin/content/permissions", element: <ProtectedRoute requireAdmin><ContentPermissions /></ProtectedRoute> },
            { path: "admin/analytics", element: <ProtectedRoute requireAdmin><AdminAnalytics /></ProtectedRoute> },
            { path: "admin/reports", element: <ProtectedRoute requireAdmin><Reports /></ProtectedRoute> },
            { path: "admin/calendar", element: <ProtectedRoute requireAdmin><Calendar /></ProtectedRoute> },
            { path: "admin/profile", element: <ProtectedRoute requireAdmin><Profile role="admin" /></ProtectedRoute> },
            { path: "admin/feature-unavailable", element: <ProtectedRoute requireAdmin><FeatureUnavailable /></ProtectedRoute> },

            /* User Routes - Protected */
            { path: "user/dashboard", element: <ProtectedRoute><UserDashboard /></ProtectedRoute> },
            { path: "user/tests", element: <ProtectedRoute><Tests /></ProtectedRoute> },
            { path: "user/tests/:id/take", element: <ProtectedRoute><TakeTest /></ProtectedRoute> },
            { path: "user/knowledge", element: <ProtectedRoute><KnowledgeBase /></ProtectedRoute> },
            { path: "user/ipr", element: <ProtectedRoute><IPR /></ProtectedRoute> },
            { path: "user/results", element: <ProtectedRoute><Results /></ProtectedRoute> },
            { path: "user/feedback", element: <ProtectedRoute><Feedback /></ProtectedRoute> },
            { path: "user/profile", element: <ProtectedRoute><UserProfile /></ProtectedRoute> },

        ],
    },
])

function App() {
    return <RouterProvider router={router} />
}

export default App
