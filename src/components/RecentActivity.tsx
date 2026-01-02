interface RecentActivityProps {
    user: string
    action: string
    time: string
    avatar: string
}

export default function RecentActivity({ user, action, time, avatar }: RecentActivityProps) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-sm">
                {avatar}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                    {user}
                </p>
                <p className="text-xs text-gray-500 truncate">
                    {action}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    {time}
                </p>
            </div>
        </div>
    )
}
