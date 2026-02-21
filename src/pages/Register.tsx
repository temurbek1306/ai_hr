import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Bot, Phone, Briefcase, Building2, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'


export default function Register() {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()

    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        startDate: new Date().toISOString().split('T')[0],
        password: '',
        confirmPassword: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const update = (field: string, value: string) =>
        setFormData(prev => ({ ...prev, [field]: value }))

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.firstName || !formData.lastName || !formData.username || !formData.email || !formData.phone) {
            setError('Iltimos, barcha majburiy maydonlarni to\'ldiring')
            return
        }
        setError(null)
        setStep(2)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            setError('Parollar mos kelmaydi')
            return
        }
        if (formData.password.length < 6) {
            setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak')
            return
        }
        if (!formData.position || !formData.department) {
            setError('Lavozim va bo\'lim majburiy')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const { authService } = await import('../services/auth.service')
            const { profileService } = await import('../services/profile.service')

            // 1. Register with auth endpoint
            await authService.register({
                fullName: `${formData.firstName} ${formData.lastName}`,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phone,
            });


            // 2. Login to get token for profile update
            await authService.login({
                username: formData.username,
                password: formData.password
            })

            // 3. Update profile with extra data (non-blocking)
            try {
                await profileService.updateProfile({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    position: formData.position,
                    department: formData.department,
                    startDate: formData.startDate,
                    email: formData.email
                } as any)
            } catch (profileErr) {
                console.warn('Profile update warning (non-blocking):', profileErr)
            }

            setSuccess(true)
            setTimeout(() => navigate('/login'), 2500)
        } catch (err: any) {
            setError(err.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi')
        } finally {
            setIsLoading(false)
        }
    }

    const inputClass = "input pl-12"

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">

                {/* Left side - Branding */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden lg:block"
                >
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-2xl">
                            <Bot className="w-8 h-8 text-primary-400" />
                            <span className="text-3xl font-display font-bold gradient-text">AI HR</span>
                        </div>

                        <h1 className="text-5xl font-display font-bold leading-tight">
                            Tizimga <span className="gradient-text">qo'shiling</span><br />
                            va karyerangizni<br />
                            boshlang
                        </h1>

                        <p className="text-xl text-dark-400 leading-relaxed">
                            Xodim sifatida ro'yxatdan o'ting va AI yordamida rivojlaning
                        </p>

                        {/* Steps indicator */}
                        <div className="flex items-center gap-4 pt-4">
                            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-400' : 'text-dark-500'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= 1 ? 'border-primary-500 bg-primary-500/20' : 'border-dark-600'}`}>1</div>
                                <span className="text-sm font-medium">Shaxsiy ma'lumot</span>
                            </div>
                            <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-primary-500' : 'bg-dark-700'}`} />
                            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-400' : 'text-dark-500'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= 2 ? 'border-primary-500 bg-primary-500/20' : 'border-dark-600'}`}>2</div>
                                <span className="text-sm font-medium">Ish ma'lumoti</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right side - Form */}
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

                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                <h2 className="text-2xl font-display font-bold mb-2 text-white">Muvaffaqiyatli!</h2>
                                <p className="text-dark-400">Hisobingiz yaratildi. Login sahifasiga yo'naltirilmoqdasiz...</p>
                            </motion.div>
                        ) : (
                            <>
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-display font-bold mb-1">
                                        {step === 1 ? 'Shaxsiy ma\'lumotlar 👤' : 'Ish ma\'lumotlari 💼'}
                                    </h2>
                                    <p className="text-dark-400 text-sm">
                                        {step === 1 ? 'Asosiy ma\'lumotlaringizni kiriting' : 'Lavozim va bo\'lim ma\'lumotlari'}
                                    </p>
                                    {/* Mobile step indicator */}
                                    <div className="flex justify-center gap-2 mt-3 lg:hidden">
                                        <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-primary-500' : 'bg-dark-600'}`} />
                                        <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-primary-500' : 'bg-dark-600'}`} />
                                    </div>
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                {/* Step 1: Personal Info */}
                                {step === 1 && (
                                    <form onSubmit={handleNext} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="block text-xs font-medium text-dark-300">Ism *</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                                                    <input
                                                        type="text"
                                                        required
                                                        className={inputClass}
                                                        placeholder="Ism"
                                                        value={formData.firstName}
                                                        onChange={(e) => update('firstName', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="block text-xs font-medium text-dark-300">Familiya *</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                                                    <input
                                                        type="text"
                                                        required
                                                        className={inputClass}
                                                        placeholder="Familiya"
                                                        value={formData.lastName}
                                                        onChange={(e) => update('lastName', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-xs font-medium text-dark-300">{t('auth.register.username')} *</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                                                <input
                                                    type="text"
                                                    required
                                                    className={inputClass}
                                                    placeholder="username"
                                                    value={formData.username}
                                                    onChange={(e) => update('username', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-xs font-medium text-dark-300">Email *</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                                                <input
                                                    type="email"
                                                    required
                                                    className={inputClass}
                                                    placeholder="email@example.com"
                                                    value={formData.email}
                                                    onChange={(e) => update('email', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-xs font-medium text-dark-300">Telefon *</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                                                <input
                                                    type="tel"
                                                    required
                                                    className={inputClass}
                                                    placeholder="+998 90 123 45 67"
                                                    value={formData.phone}
                                                    onChange={(e) => update('phone', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <button type="submit" className="btn btn-primary w-full mt-2">
                                            Davom etish →
                                        </button>
                                    </form>
                                )}

                                {/* Step 2: Job Info + Password */}
                                {step === 2 && (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="block text-xs font-medium text-dark-300">Lavozim *</label>
                                                <div className="relative">
                                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                                                    <input
                                                        type="text"
                                                        required
                                                        className={inputClass}
                                                        placeholder="Dasturchi"
                                                        value={formData.position}
                                                        onChange={(e) => update('position', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="block text-xs font-medium text-dark-300">Bo'lim *</label>
                                                <div className="relative">
                                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                                                    <input
                                                        type="text"
                                                        required
                                                        className={inputClass}
                                                        placeholder="IT"
                                                        value={formData.department}
                                                        onChange={(e) => update('department', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-xs font-medium text-dark-300">Ishga kirgan sana *</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                                                <input
                                                    type="date"
                                                    required
                                                    className={inputClass}
                                                    value={formData.startDate}
                                                    onChange={(e) => update('startDate', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-xs font-medium text-dark-300">Parol *</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                                                <input
                                                    type="password"
                                                    required
                                                    className={inputClass}
                                                    placeholder="••••••••"
                                                    value={formData.password}
                                                    onChange={(e) => update('password', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-xs font-medium text-dark-300">Parolni tasdiqlang *</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                                                <input
                                                    type="password"
                                                    required
                                                    className={inputClass}
                                                    placeholder="••••••••"
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => update('confirmPassword', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3 mt-2">
                                            <button
                                                type="button"
                                                onClick={() => { setStep(1); setError(null) }}
                                                className="btn btn-secondary flex-1"
                                            >
                                                ← Orqaga
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="btn btn-primary flex-1"
                                            >
                                                {isLoading ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : 'Ro\'yxatdan o\'tish'}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                <div className="mt-6 text-center text-sm text-dark-500">
                                    Hisobingiz bormi?{' '}
                                    <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                                        {t('auth.register.login')}
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
