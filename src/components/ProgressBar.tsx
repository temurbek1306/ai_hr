import { motion } from 'framer-motion'

interface ProgressBarProps {
    value: number
    max?: number
    color?: 'primary' | 'green' | 'blue' | 'orange' | 'purple'
    showPercentage?: boolean
    height?: 'sm' | 'md' | 'lg'
    animated?: boolean
}

export default function ProgressBar({
    value,
    max = 100,
    color = 'primary',
    showPercentage = true,
    height = 'md',
    animated = true
}: ProgressBarProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const colorClasses = {
        primary: 'bg-primary-500',
        green: 'bg-green-500',
        blue: 'bg-blue-500',
        orange: 'bg-orange-500',
        purple: 'bg-purple-500',
    }

    const heightClasses = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    }

    return (
        <div className="w-full">
            {showPercentage && (
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-bold text-gray-900">{Math.round(percentage)}%</span>
                </div>
            )}
            <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${heightClasses[height]}`}>
                <motion.div
                    className={`${heightClasses[height]} ${colorClasses[color]} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{
                        duration: animated ? 1 : 0,
                        ease: 'easeOut'
                    }}
                />
            </div>
        </div>
    )
}
