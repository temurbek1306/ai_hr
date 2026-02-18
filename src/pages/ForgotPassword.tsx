import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Bot, CheckCircle2, AlertCircle } from 'lucide-react'
import { authService } from '../services/auth.service'

export default function ForgotPassword() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            await authService.forgotPassword(email)
            setIsSubmitted(true)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="card">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 rounded-2xl glass-dark flex items-center justify-center mb-4">
                            <Bot className="w-10 h-10 text-primary-400" />
                        </div>
                        <h2 className="text-3xl font-display font-bold mb-2 text-center">
                            Parolni tiklash
                        </h2>
                        <p className="text-dark-400 text-center">
                            Elektron pochtangizni kiriting va biz sizga tiklash havolasini yuboramiz.
                        </p>
                    </div>

                    {isSubmitted ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center space-y-6"
                        >
                            <div className="flex justify-center">
                                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">Havola yuborildi!</h3>
                                <p className="text-dark-400">
                                    Iltimos, <b>{email}</b> pochtangizni tekshiring.
                                    Tiklash havolasi 1 soat davomida amal qiladi.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/login')}
                                className="btn btn-primary w-full"
                            >
                                Login sahifasiga qaytish
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    {error}
                                </div>
                            )}

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

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn btn-primary w-full"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Yuborish'
                                )}
                            </button>

                            <Link
                                to="/login"
                                className="flex items-center justify-center gap-2 text-dark-500 hover:text-dark-300 transition-colors text-sm font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Login sahifasiga qaytish
                            </Link>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
