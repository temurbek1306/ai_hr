import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock, Sparkles, Bot, User } from 'lucide-react'

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            navigate('/dashboard')
        }, 1500)
    }

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
                            Xodimlarni boshqarish
                            <br />
                            <span className="gradient-text">yangi darajada</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-xl text-dark-400 leading-relaxed"
                        >
                            Sun'iy intellekt yordamida HR jarayonlarini avtomatlashtiring.
                            Vaqtingizni tejang, samaradorlikni oshiring.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="grid grid-cols-3 gap-4 pt-8"
                        >
                            {[
                                { label: 'Xodimlar', value: '500+' },
                                { label: 'Kompaniyalar', value: '50+' },
                                { label: 'Vaqt tejash', value: '80%' },
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
                    <div className="card max-w-md mx-auto">
                        {/* Mobile logo */}
                        <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                            <Bot className="w-8 h-8 text-primary-400" />
                            <span className="text-2xl font-display font-bold gradient-text">
                                AI HR
                            </span>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-display font-bold mb-2">
                                Xush kelibsiz! 👋
                            </h2>
                            <p className="text-dark-400">
                                Davom etish uchun hisobingizga kiring
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-dark-300">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="sizning@email.com"
                                        className="input pl-12"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-dark-300">
                                    Parol
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
                                    <span className="text-dark-400">Eslab qolish</span>
                                </label>
                                <a href="#" className="text-primary-400 hover:text-primary-300 transition-colors">
                                    Parolni unutdingizmi?
                                </a>
                            </div>

                            {/* Submit Buttons */}
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLoading(true)
                                        setTimeout(() => navigate('/admin/dashboard'), 1000)
                                    }}
                                    disabled={isLoading}
                                    className="btn btn-primary w-full relative overflow-hidden group"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <LogIn className="w-5 h-5" />
                                        )}
                                        Admin sifatida kirish
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLoading(true)
                                        setTimeout(() => navigate('/user/dashboard'), 1000)
                                    }}
                                    disabled={isLoading}
                                    className="w-full py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                                        ) : (
                                            <User className="w-5 h-5" />
                                        )}
                                        Xodim sifatida kirish
                                    </span>
                                </button>
                            </div>

                            {/* Demo Credentials */}
                            <div className="mt-6 p-4 glass rounded-xl">
                                <div className="flex items-start gap-2">
                                    <Sparkles className="w-5 h-5 text-primary-400 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-medium text-dark-300 mb-1">Demo kirish:</p>
                                        <p className="text-dark-500">Email: admin@aihr.uz</p>
                                        <p className="text-dark-500">Parol: admin123</p>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center text-sm text-dark-500">
                            Hisobingiz yo'qmi?{' '}
                            <a href="#" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                                Ro'yxatdan o'tish
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
