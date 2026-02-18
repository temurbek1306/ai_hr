import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, AlertCircle } from 'lucide-react'

interface TimerProps {
    duration: number // in seconds
    onTimeUp?: () => void
    warningThreshold?: number // seconds before showing warning
}

export default function Timer({ duration, onTimeUp, warningThreshold = 300 }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration)
    const [isWarning, setIsWarning] = useState(false)

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp?.()
            return
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                const newTime = prev - 1
                if (newTime <= warningThreshold && !isWarning) {
                    setIsWarning(true)
                }
                return newTime
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [timeLeft, onTimeUp, warningThreshold, isWarning])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const percentage = (timeLeft / duration) * 100

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`card p-4 ${isWarning ? 'bg-red-50 border-red-200' : 'bg-white'} transition-colors`}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isWarning ? 'bg-red-100' : 'bg-primary-50'}`}>
                    {isWarning ? (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                    ) : (
                        <Clock className="w-5 h-5 text-primary-600" />
                    )}
                </div>
                <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Qolgan vaqt</p>
                    <p className={`text-2xl font-bold font-mono ${isWarning ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatTime(timeLeft)}
                    </p>
                </div>
            </div>
            <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full ${isWarning ? 'bg-red-500' : 'bg-primary-500'}`}
                    initial={{ width: '100%' }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>
            {isWarning && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-600 mt-2 font-medium"
                >
                    ⚠️ Vaqt tugashiga oz qoldi!
                </motion.p>
            )}
        </motion.div>
    )
}
