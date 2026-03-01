import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '../../components/Layout'
import { Book, Edit3, Zap, BarChart2, ArrowLeft } from 'lucide-react'

export default function Surveys() {
    const { t } = useTranslation()
    const modules = [
        {
            id: 'catalog',
            title: t('surveys.modules.catalog.title'),
            description: t('surveys.modules.catalog.desc'),
            icon: Book,
            color: 'bg-indigo-100 text-indigo-600'
        },
        {
            id: 'builder',
            title: t('surveys.modules.builder.title'),
            description: t('surveys.modules.builder.desc'),
            icon: Edit3,
            color: 'bg-pink-100 text-pink-600'
        },
        {
            id: 'triggers',
            title: t('surveys.modules.triggers.title'),
            description: t('surveys.modules.triggers.desc'),
            icon: Zap,
            color: 'bg-yellow-100 text-yellow-600'
        },
        {
            id: 'analytics',
            title: t('surveys.modules.analytics.title'),
            description: t('surveys.modules.analytics.desc'),
            icon: BarChart2,
            color: 'bg-teal-100 text-teal-600'
        }
    ]

    const navigate = useNavigate()

    const handleNavigation = (path: string) => {
        navigate(`/admin/feature-unavailable?title=${encodeURIComponent(path)}`)
    }

    return (
        <Layout>
            <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <h1 className="text-2xl font-bold">{t('surveys.title')}</h1>
                </div>
                <p className="text-gray-600 mb-8 ml-11">{t('surveys.description')}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {modules.map((module, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                if (module.id === 'builder') {
                                    navigate('/admin/surveys/new')
                                } else if (module.id === 'catalog') {
                                    navigate('/admin/surveys/catalog')
                                } else if (module.id === 'analytics') {
                                    navigate('/admin/surveys/results')
                                } else if (module.id === 'triggers') {
                                    navigate('/admin/surveys/triggers')
                                } else {
                                    handleNavigation(module.title)
                                }
                            }}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
                        >
                            <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <module.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{module.title}</h3>
                            <p className="text-sm text-gray-500">{module.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}
