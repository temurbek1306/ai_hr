import { useTranslation } from 'react-i18next'
import { Clock } from 'lucide-react'

interface Activity {
    id: string
    user: string
    action: string
    time: string
    avatar?: string
}

interface RecentActivityProps {
    activities?: Activity[]
}

export default function RecentActivity({ activities = [] }: RecentActivityProps) {
    const { t } = useTranslation()

    if (activities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                    <Clock className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm text-gray-500 font-medium">
                    {t('dashboard.activity.noRecentActivity')}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    Yangi xodimlar qo'shilganda yoki testlar topshirilganda bu yerda ko'rinadi.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-sm">
                        {activity.avatar || activity.user.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.user}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {activity.action}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {new Date(activity.time).toLocaleString('uz-UZ', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
