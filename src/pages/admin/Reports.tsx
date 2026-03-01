import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, Download, Calendar, Filter, BarChart, ArrowLeft } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Layout from '../../components/Layout'
import Button from '../../components/Button'
import { reportService } from '../../services/report.service'
import { useNavigate } from 'react-router-dom'

import type { ReportDto } from '../../types/api.types'

export default function Reports() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [selectedType, setSelectedType] = useState('all')
    const [reports, setReports] = useState<ReportDto[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await reportService.getReports()
                // Ensure data is array
                const reportsList = Array.isArray(data) ? data : (data as any).content || []
                setReports(reportsList)
            } catch (error) {
                console.error('Failed to fetch reports:', error)
                // Use mock data as fallback
                setReports(mockReports)
            } finally {
                setIsLoading(false)
            }
        }
        fetchReports()
    }, [])

    const mockReports: ReportDto[] = [
        { id: '1', title: 'Oylik Xodimlar Faolligi', type: 'performance', date: '2024-01-01', size: '2.4 MB', status: 'ready', downloadUrl: '#' },
        { id: '2', title: 'Test Natijalari (Q4 2023)', type: 'testing', date: '2023-12-30', size: '1.8 MB', status: 'ready', downloadUrl: '#' },
        { id: '3', title: 'Onboarding Samaradorligi', type: 'hr', date: '2023-12-15', size: '3.1 MB', status: 'ready', downloadUrl: '#' },
        { id: '4', title: 'Maosh va Bonuslar', type: 'finance', date: '2023-11-30', size: '1.2 MB', status: 'archived', downloadUrl: '#' },
        { id: '5', title: 'Xodimlar Qoniqishi (NPS)', type: 'survey', date: '2023-11-01', size: '0.9 MB', status: 'ready', downloadUrl: '#' },
    ]

    const handleDownload = (downloadUrl: string, title: string) => {
        if (downloadUrl === '#') {
            toast.success(`${title} yuklanmoqda...`)
        } else {
            window.open(downloadUrl, '_blank')
        }
    }

    return (
        <Layout>
            <div className="p-6 space-y-6">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        >
                            <ArrowLeft size={22} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-display font-bold text-gray-900">{t('reports.title')}</h1>
                            <p className="text-gray-500 text-sm">{t('reports.subtitle')}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" icon={<Filter size={20} />}>
                            {t('reports.filter')}
                        </Button>
                        <Button icon={<BarChart size={20} />} onClick={() => toast.success('Yangi hisobot generatsiya qilinmoqda...')}>
                            {t('reports.new')}
                        </Button>
                    </div>
                </header>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {['all', 'monthly', 'performance', 'testing', 'hr', 'finance', 'survey'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${selectedType === type
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {t(`reports.types.${type}`)}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm font-medium">
                            <tr>
                                <th className="px-6 py-4">{t('reports.table.name')}</th>
                                <th className="px-6 py-4">{t('reports.table.type')}</th>
                                <th className="px-6 py-4">{t('reports.table.date')}</th>
                                <th className="px-6 py-4">{t('reports.table.size')}</th>
                                <th className="px-6 py-4">{t('reports.table.status')}</th>
                                <th className="px-6 py-4 text-right">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Yuklanmoqda...
                                    </td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Hisobotlar topilmadi
                                    </td>
                                </tr>
                            ) : (
                                reports
                                    .filter(report => selectedType === 'all' || report.type === selectedType)
                                    .map((report) => (
                                        <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                                                        <FileText size={18} />
                                                    </div>
                                                    <span className="font-medium text-gray-900">{report.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium uppercase">
                                                    {t(`reports.types.${report.type}`)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm flex items-center gap-1">
                                                <Calendar size={14} />
                                                {report.date}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm">{report.size}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${report.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {report.status === 'ready' ? t('reports.status.ready') : t('reports.status.archived')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDownload(report.downloadUrl, report.title)}
                                                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center gap-2 ml-auto"
                                                >
                                                    <Download size={16} />
                                                    <span className="text-sm font-medium">{t('reports.actions.download')}</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    )
}
