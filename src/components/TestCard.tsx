import { motion } from 'framer-motion'
import { BookOpen, Clock, CheckCircle, XCircle, Play } from 'lucide-react'

type Test = {
    id: string;
    title: string;
    description?: string;
}

interface TestCardProps {
    test: Test
    status?: 'not_started' | 'in_progress' | 'completed' | 'passed' | 'failed'
    score?: number
    onStart?: () => void
}

export default function TestCard({ test, status = 'not_started', score, onStart }: TestCardProps) {
    const getStatusBadge = () => {
        switch (status) {
            case 'passed':
                return (
                    <div className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        O'tildi
                    </div>
                )
            case 'failed':
                return (
                    <div className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold">
                        <XCircle className="w-3 h-3" />
                        Qayta topshirish
                    </div>
                )
            case 'in_progress':
                return (
                    <div className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-semibold">
                        Jarayonda
                    </div>
                )
            case 'completed':
                return (
                    <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                        Tugallandi
                    </div>
                )
            default:
                return (
                    <div className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-semibold">
                        Yangi
                    </div>
                )
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="card group hover:border-primary-500 transition-all cursor-pointer overflow-hidden"
        >
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    {getStatusBadge()}
                </div>

                <h3 className="text-xl font-display font-bold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">
                    {test.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {test.description || "Ushbu test orqali o'z bilimlaringizni sinab ko'ring va natijalarni yaxshilang."}
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>20 daqiqa</span>
                    </div>
                    {score !== undefined && (
                        <div className="flex items-center gap-1 font-semibold text-primary-600">
                            <span>Ball: {score}/100</span>
                        </div>
                    )}
                </div>

                <button
                    onClick={onStart}
                    className="btn btn-primary w-full group-hover:bg-primary-600 flex items-center justify-center gap-2"
                >
                    <Play className="w-4 h-4" />
                    {status === 'not_started' ? 'Testni boshlash' : status === 'failed' ? 'Qayta topshirish' : 'Davom ettirish'}
                </button>
            </div>

            {/* Progress indicator at bottom */}
            <div className="h-1 bg-gray-100 w-full">
                <motion.div
                    className="h-full bg-primary-500"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </motion.div>
    )
}
