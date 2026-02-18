
import { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface StatCardProps {
    title: string
    value: string
    change: string
    trend: 'up' | 'down'
    icon: LucideIcon
    color: 'primary' | 'secondary' | 'yellow' | 'green' | 'orange' | 'purple'
}

const colorClasses = {
    primary: {
        bg: 'from-primary-600 to-primary-500',
        text: 'text-primary-400',
        shadow: 'shadow-primary-500/50',
    },
    secondary: {
        bg: 'from-secondary-600 to-secondary-500',
        text: 'text-secondary-400',
        shadow: 'shadow-secondary-500/50',
    },
    yellow: {
        bg: 'from-yellow-600 to-yellow-500',
        text: 'text-yellow-400',
        shadow: 'shadow-yellow-500/50',
    },
    green: {
        bg: 'from-green-600 to-green-500',
        text: 'text-green-400',
        shadow: 'shadow-green-500/50',
    },
    orange: {
        bg: 'from-orange-600 to-orange-500',
        text: 'text-orange-400',
        shadow: 'shadow-orange-500/50',
    },
    purple: {
        bg: 'from-purple-600 to-purple-500',
        text: 'text-purple-400',
        shadow: 'shadow-purple-500/50',
    },
}

export default function StatCard({ title, value, change, trend, icon: Icon, color }: StatCardProps) {
    const { t } = useTranslation()
    const colors = colorClasses[color] || colorClasses.primary

    return (
        <div className="card bg-white border border-gray-200 shadow-sm p-6 rounded-2xl hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-gray-500 text-sm mb-1">{title}</p>
                    <h3 className="text-3xl font-display font-bold text-gray-900">{value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>

            <div className="flex items-center gap-2">
                {trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {change}
                </span>
                <span className="text-sm text-gray-400">{t('dashboard.stats.vsLastMonth')}</span>
            </div>
        </div>
    )
}
