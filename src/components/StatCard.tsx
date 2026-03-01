
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
        border: 'bg-primary-500',
    },
    secondary: {
        bg: 'from-secondary-600 to-secondary-500',
        text: 'text-secondary-400',
        shadow: 'shadow-secondary-500/50',
        border: 'bg-secondary-500',
    },
    yellow: {
        bg: 'from-yellow-600 to-yellow-500',
        text: 'text-yellow-400',
        shadow: 'shadow-yellow-500/50',
        border: 'bg-amber-400',
    },
    green: {
        bg: 'from-green-600 to-green-500',
        text: 'text-green-400',
        shadow: 'shadow-green-500/50',
        border: 'bg-emerald-500',
    },
    orange: {
        bg: 'from-orange-600 to-orange-500',
        text: 'text-orange-400',
        shadow: 'shadow-orange-500/50',
        border: 'bg-orange-500',
    },
    purple: {
        bg: 'from-purple-600 to-purple-500',
        text: 'text-purple-400',
        shadow: 'shadow-purple-500/50',
        border: 'bg-purple-500',
    },
}

export default function StatCard({ title, value, change, trend, icon: Icon, color }: StatCardProps) {
    const { t } = useTranslation()
    const colors = colorClasses[color] || colorClasses.primary

    return (
        <div className="relative glass-light rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
            {/* Soft background glow */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${colors.bg} opacity-[0.08] group-hover:scale-150 transition-transform duration-500`} />

            {/* Colored top border strip */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] ${colors.border} rounded-t-2xl`} />
            <div className="flex items-start justify-between mb-4 relative z-10">
                <div>
                    <p className="text-gray-500 text-sm mb-1 font-medium tracking-wide uppercase">{title}</p>
                    <h3 className="text-3xl font-display font-black tracking-tight text-gray-900">{value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-lg group-hover:-translate-y-1 group-hover:rotate-3 group-hover:shadow-xl transition-all duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>

            <div className="flex items-center gap-2 relative z-10">
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
