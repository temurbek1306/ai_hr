import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Bot, UserPlus, AlertCircle } from 'lucide-react'
import { useTranslation, Trans } from 'react-i18next'

export default function Register() {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',  // Changed from email to username
        password: '',
        confirmPassword: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            setError(t('auth.register.errors.passwordMismatch'))
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            // Real API call using auth service
            const { authService } = await import('../services/auth.service')
            await authService.register({
                fullName: formData.fullName,
                username: formData.username,
                password: formData.password
            })

            // Registration successful, redirect to login
            navigate('/login')
        } catch (err: any) {
            setError(err.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">

                {/* Left side - Branding (Static copy from Login) */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden lg:block"
                >
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-2xl">
                            <Bot className="w-8 h-8 text-primary-400" />
                            <span className="text-3xl font-display font-bold gradient-text">
                                AI HR
                            </span>
                        </div>

                        <h1 className="text-5xl font-display font-bold leading-tight">
                            <Trans i18nKey="auth.register.heroTitle" components={{ br: <br />, span: <span className="gradient-text" /> }} />
                        </h1>

                        <p className="text-xl text-dark-400 leading-relaxed">
                            {t('auth.register.heroSubtitle')}
                        </p>

                        <div className="grid grid-cols-2 gap-4 pt-8">
                            <div className="glass-dark rounded-xl p-4">
                                <div className="text-2xl font-bold gradient-text">5 kishi</div>
                                <div className="text-sm text-dark-400 mt-1">{t('auth.register.stats.joinedToday')}</div>
                            </div>
                            <div className="glass-dark rounded-xl p-4">
                                <div className="text-2xl font-bold gradient-text">100+</div>
                                <div className="text-sm text-dark-400 mt-1">{t('auth.register.stats.openPositions')}</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right side - Register Form */}
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

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-display font-bold mb-2">
                                {t('auth.register.title')} 📝
                            </h2>
                            <p className="text-dark-400">
                                {t('auth.register.subtitle')}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-dark-300">{t('auth.register.fullName')}</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                    <input
                                        type="text"
                                        required
                                        className="input pl-12"
                                        placeholder="Ism Familiya"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-dark-300">Username (Email yoki To'liq ism)</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                    <input
                                        type="text"
                                        required
                                        className="input pl-12"
                                        placeholder="email@example.com yoki Ism Familiya"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-dark-300">{t('auth.register.password')}</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                    <input
                                        type="password"
                                        required
                                        className="input pl-12"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-dark-300">{t('auth.register.confirmPassword')}</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                    <input
                                        type="password"
                                        required
                                        className="input pl-12"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn btn-primary w-full mt-4"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5" />
                                        {t('auth.register.submit')}
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-dark-500">
                            {t('auth.register.haveAccount')}{' '}
                            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                                {t('auth.register.login')}
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
