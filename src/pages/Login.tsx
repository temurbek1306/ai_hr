import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock, Bot, AlertCircle } from 'lucide-react'
import { authService } from '../services/auth.service'
import { useTranslation, Trans } from 'react-i18next'
import { getFullNameFromEmail } from '../utils/emailMapping'

export default function Login() {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            // Convert email to fullName if needed (for employee login)
            // Admin uses email directly, employees need fullName
            const username = getFullNameFromEmail(email);

            // Login returns token, but we also stored 'role' in localStorage in auth.service
            await authService.login({
                username: username,
                password: password
            })

            // Get the role that was just stored
            const role = localStorage.getItem('role');

            // Navigate based on role from backend
            if (role === 'ROLE_ADMIN') {
                navigate('/admin/dashboard')
            } else if (role === 'ROLE_USER' || role === 'ROLE_EMPLOYEE') {
                // Employees can now access the web application
                navigate('/user/dashboard')
            } else {
                // Unknown role
                setError('Noma\'lum foydalanuvchi turi. Iltimos, administrator bilan bog\'laning.')
                authService.logout() // Clear local storage
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.')
            console.error('Login error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    // handleSubmit is no longer needed separate from handleLogin since we use form submit

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative">
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">

                {/* Left side - Branding */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden lg:block"
                >
                    <div className="space-y-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-flex items-center gap-3 glass px-6 py-3 rounded-2xl"
                        >
                            <Bot className="w-8 h-8 text-primary-400" />
                            <span className="text-3xl font-display font-bold gradient-text">
                                AI HR
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-5xl font-display font-bold leading-tight"
                        >
                            <Trans i18nKey="auth.login.heroTitle" components={{ br: <br />, span: <span className="gradient-text" /> }} />
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-xl text-dark-400 leading-relaxed"
                        >
                            {t('auth.login.heroSubtitle')}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="grid grid-cols-3 gap-4 pt-8"
                        >
                            {[
                                { label: t('auth.login.stats.employees'), value: '500+' },
                                { label: t('auth.login.stats.companies'), value: '50+' },
                                { label: t('auth.login.stats.timeSaved'), value: '80%' },
                            ].map((stat, index) => (
                                <div key={index} className="glass-dark rounded-xl p-4 text-center">
                                    <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                                    <div className="text-sm text-dark-400 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

                {/* Right side - Login Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full"
                >
                    <div className="card max-w-md mx-auto relative">
                        {/* Language Switcher */}
                        <div className="absolute top-4 right-4">
                            <select
                                value={i18n.language}
                                onChange={(e) => i18n.changeLanguage(e.target.value)}
                                className="bg-transparent border-none text-gray-500 text-sm font-medium focus:ring-0 cursor-pointer hover:text-primary-600 transition-colors"
                            >
                                <option value="uz">UZ</option>
                                <option value="ru">RU</option>
                            </select>
                        </div>
                        {/* Mobile logo */}
                        <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                            <Bot className="w-8 h-8 text-primary-400" />
                            <span className="text-2xl font-display font-bold gradient-text">
                                AI HR
                            </span>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-display font-bold mb-2">
                                {t('auth.login.welcome')} 👋
                            </h2>
                            <p className="text-dark-400">
                                {t('auth.login.subtitle')}
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
                            >
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            {/* Email/Username Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-dark-300">
                                    Email yoki Username
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="email@example.com yoki username"
                                        className="input pl-12"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-dark-300">
                                    {t('auth.login.password')}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="input pl-12"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-dark-700 bg-dark-800 text-primary-500 focus:ring-2 focus:ring-primary-500"
                                    />
                                    <span className="text-dark-400">{t('auth.login.remember')}</span>
                                </label>
                                <Link to="/forgot-password" title={t('auth.login.forgotPassword')} className="text-primary-400 hover:text-primary-300 transition-colors">
                                    {t('auth.login.forgotPassword')}
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn btn-primary w-full py-4 relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2 text-lg font-medium">
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <LogIn className="w-5 h-5" />
                                    )}
                                    {t('auth.login.submit')}
                                </span>
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center text-sm text-dark-500">
                            {t('auth.login.noAccount')}{' '}
                            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                                {t('auth.login.register')}
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
