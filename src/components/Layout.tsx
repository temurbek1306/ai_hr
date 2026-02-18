import { useState, ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    Users,
    LogOut,
    Menu,
    X,
    Book,
    Settings,
    FileText,
    ClipboardList,
    FileQuestion,
    Calendar,
    Target
} from 'lucide-react'
import BackgroundPattern from './BackgroundPattern'
import ITParkLogo from './ITParkLogo'

import { useTranslation } from 'react-i18next'

interface LayoutProps {
    children: ReactNode
    role?: 'admin' | 'user'
}

export default function Layout({ children, role = 'admin' }: LayoutProps) {
    const { t, i18n } = useTranslation()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    const adminNavigation = [
        { name: t('sidebar.dashboard'), href: '/admin/dashboard', icon: LayoutDashboard },
        { name: t('sidebar.employees'), href: '/admin/employees', icon: Users },
        { name: t('sidebar.testing'), href: '/admin/testing', icon: ClipboardList },
        { name: t('sidebar.surveys'), href: '/admin/surveys', icon: FileQuestion },
        { name: t('sidebar.knowledgeBase'), href: '/admin/content', icon: Book },
        { name: t('sidebar.reports'), href: '/admin/reports', icon: FileText },
        { name: t('sidebar.calendar'), href: '/admin/calendar', icon: Calendar },
        { name: t('sidebar.settings'), href: '/admin/profile', icon: Settings },
    ]

    const userNavigation = [
        { name: t('sidebar.dashboard'), href: '/user/dashboard', icon: LayoutDashboard },
        { name: t('sidebar.testing'), href: '/user/tests', icon: ClipboardList },
        { name: t('sidebar.results'), href: '/user/results', icon: FileText },
        { name: t('sidebar.knowledgeBase'), href: '/user/knowledge', icon: Book },
        { name: t('sidebar.ipr'), href: '/user/ipr', icon: Target },
        { name: t('sidebar.feedback'), href: '/user/feedback', icon: FileQuestion },
        { name: t('sidebar.settings'), href: '/user/profile', icon: Settings },
    ]

    const navigation = role === 'admin' ? adminNavigation : userNavigation

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 ease-in-out lg:translate-x-0 lg:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-center">
                            <ITParkLogo className="w-40 h-auto" />
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                        <div className="mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            {role === 'admin' ? t('common.adminPanel') : t('common.employeePanel')}
                        </div>
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${isActive
                                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-500/30'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium text-sm">{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Language Switcher */}
                    <div className="px-5 py-2">
                        <select
                            value={i18n.language}
                            onChange={(e) => i18n.changeLanguage(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
                        >
                            <option value="uz">O'zbekcha</option>
                            <option value="ru">Русский</option>
                        </select>
                    </div>

                    {/* User Profile */}
                    <div className="p-3 border-t border-gray-200">
                        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 group">
                            <Link to={role === 'admin' ? '/admin/profile' : '/user/profile'} className="flex items-center gap-2 flex-1 hover:bg-gray-100 rounded-lg transition-colors">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-semibold shadow-sm text-sm group-hover:shadow-md transition-all">
                                    {role === 'admin' ? 'A' : 'U'}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm text-gray-900">{role === 'admin' ? t('roles.admin') : t('roles.user')}</p>
                                    <p className="text-xs text-gray-500">{role}@aihr.uz</p>
                                </div>
                            </Link>
                            <button
                                onClick={() => navigate('/login')}
                                className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                                title="Chiqish"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile sidebar toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-3 left-3 z-50 btn btn-primary p-2 rounded-lg shadow-lg"
            >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Main content */}
            <div className="lg:ml-64">
                <main className="relative">
                    <BackgroundPattern />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                />
            )}
        </div>
    )
}

