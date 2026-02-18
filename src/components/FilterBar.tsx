import { Filter } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export interface FilterBarProps {
    period: string
    department: string
    status: string
    onPeriodChange: (value: string) => void
    onDepartmentChange: (value: string) => void
    onStatusChange: (value: string) => void
}

export default function FilterBar({
    period,
    department,
    status,
    onPeriodChange,
    onDepartmentChange,
    onStatusChange
}: FilterBarProps) {
    const { t } = useTranslation()

    const periods = [
        { value: 'today', label: t('filters.periods.today') },
        { value: 'week', label: t('filters.periods.week') },
        { value: 'month', label: t('filters.periods.month') },
        { value: 'year', label: t('filters.periods.year') }
    ]

    const departments = [
        { value: 'all', label: t('filters.departments.all') },
        { value: 'IT', label: t('filters.departments.it') },
        { value: 'HR', label: t('filters.departments.hr') },
        { value: 'Marketing', label: t('filters.departments.marketing') },
        { value: 'Sales', label: t('filters.departments.sales') },
        { value: 'Finance', label: t('filters.departments.finance') },
        { value: 'Operations', label: t('filters.departments.operations') }
    ]

    const statuses = [
        { value: 'all', label: t('filters.statuses.all') },
        { value: 'active', label: t('filters.statuses.active') },
        { value: 'pending', label: t('filters.statuses.pending') },
        { value: 'completed', label: t('filters.statuses.completed') }
    ]

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{t('filters.title')}</span>
            </div>

            <div className="flex flex-wrap gap-3">
                {/* Period Filter */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">{t('filters.period')}</span>
                    <div className="flex gap-1">
                        {periods.map((p) => (
                            <button
                                key={p.value}
                                onClick={() => onPeriodChange(p.value)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${period === p.value
                                    ? 'bg-primary-500 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Department Filter */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">{t('filters.department')}</span>
                    <select
                        value={department}
                        onChange={(e) => onDepartmentChange(e.target.value)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:border-primary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    >
                        {departments.map((d) => (
                            <option key={d.value} value={d.value}>
                                {d.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">{t('filters.status')}</span>
                    <select
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:border-primary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    >
                        {statuses.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}
