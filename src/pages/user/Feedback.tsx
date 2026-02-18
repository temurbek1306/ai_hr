import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import Layout from '../../components/Layout'
import { feedbackService } from '../../services/feedback.service'
import { analyticsService } from '../../services/analytics.service'

export default function Feedback() {
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')
    const [realEmployeeId, setRealEmployeeId] = useState<string | null>(null)

    useEffect(() => {
        const fetchId = async () => {
            const role = localStorage.getItem('role')
            if (role === 'ROLE_ADMIN') {
                return;
            }

            try {
                const summary = await analyticsService.getEmployeeSummary('me')
                if (summary && summary.employeeId) {
                    setRealEmployeeId(summary.employeeId)
                }
            } catch (err) {
                console.error('Failed to fetch employee ID for feedback:', err)
            }
        }
        fetchId()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim()) return

        const role = localStorage.getItem('role')
        if (role === 'ROLE_ADMIN') {
            // Admin cannot submit feedback as a user
            setErrorMessage('Administrator feedback yubora olmaydi.');
            setStatus('error');
            return;
        }

        setIsSubmitting(true)
        setStatus('idle')

        try {
            await feedbackService.submitFeedback({
                employeeId: realEmployeeId || 'me',
                message: message,
                subject: 'General Feedback' // Default subject as UI doesn't have a field for it
            })
            setStatus('success')
            setMessage('')
        } catch (err: any) {
            console.error('Feedback submission failed:', err)
            setStatus('error')
            setErrorMessage(err.message || 'Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Layout role="user">
            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
                <header className="space-y-2">
                    <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
                        <MessageSquare className="text-primary-500 w-8 h-8" />
                        Fikr va Mulohazalar
                    </h1>
                    <p className="text-gray-600">
                        Platformamizni yanada yaxshilash uchun o'z fikringiz, shikoyat yoki takliflaringizni qoldiring.
                    </p>
                </header>

                <div className="grid md:grid-cols-5 gap-8">
                    {/* Information Section */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="card bg-primary-50 border-primary-100 p-6 space-y-4">
                            <h3 className="font-display font-semibold text-primary-900">Nima uchun fikringiz muhim?</h3>
                            <ul className="space-y-3 text-sm text-primary-800">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span>HR jarayonlarini yanada samaraliroq qilishimizga yordam berasiz.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span>Yangi funksiyalar bo'yicha takliflaringiz inobatga olinadi.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span>Xatoliklarni tezroq tuzatishimizga imkon berasiz.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="md:col-span-3">
                        <AnimatePresence mode="wait">
                            {status === 'success' ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="card bg-green-50 border-green-100 p-10 text-center space-y-4"
                                >
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-green-900">Rahmat!</h3>
                                    <p className="text-green-700">Fikringiz muvaffaqiyatli yuborildi. Biz uni albatta ko'rib chiqamiz.</p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="btn btn-primary"
                                    >
                                        Yana yozish
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onSubmit={handleSubmit}
                                    className="card space-y-6 bg-white/50 backdrop-blur-sm border-gray-100 shadow-xl p-8"
                                >
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Xabaringiz</label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Bu yerda o'z fikringizni batafsil bayon qiling..."
                                            className="input min-h-[200px] resize-none focus:ring-2 focus:ring-primary-500 transition-all p-4"
                                            required
                                        />
                                    </div>

                                    {status === 'error' && (
                                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            {errorMessage}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !message.trim()}
                                        className="btn btn-primary w-full py-4 text-lg font-semibold flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Yuborish
                                            </>
                                        )}
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
