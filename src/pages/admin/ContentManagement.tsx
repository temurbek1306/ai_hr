import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '../../components/Layout'
import { Book, FileText, Lock, BarChart2 } from 'lucide-react'

export default function ContentManagement() {
    const { t } = useTranslation()
    const modules = [
        {
            id: 'articles',
            title: t('content.modules.articles.title'),
            description: t('content.modules.articles.desc'),
            icon: Book,
            color: 'bg-indigo-100 text-indigo-600'
        },
        {
            id: 'editor',
            title: t('content.modules.editor.title'),
            description: t('content.modules.editor.desc'),
            icon: FileText,
            color: 'bg-green-100 text-green-600'
        },
        {
            id: 'permissions',
            title: t('content.modules.permissions.title'),
            description: t('content.modules.permissions.desc'),
            icon: Lock,
            color: 'bg-red-100 text-red-600'
        },
        {
            id: 'stats',
            title: t('content.modules.stats.title'),
            description: t('content.modules.stats.desc'),
            icon: BarChart2,
            color: 'bg-blue-100 text-blue-600'
        }
    ]

    const navigate = useNavigate()

    const handleNavigation = (path: string) => {
        navigate(`/admin/feature-unavailable?title=${encodeURIComponent(path)}`)
    }

    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">{t('content.title')}</h1>
                <p className="text-gray-600 mb-8">{t('content.description')}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {modules.map((module, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                if (module.id === 'editor') {
                                    navigate('/admin/content/new')
                                } else if (module.id === 'articles') {
                                    navigate('/admin/content/catalog')
                                } else if (module.id === 'stats') {
                                    navigate('/admin/analytics')
                                } else if (module.id === 'permissions') {
                                    navigate('/admin/content/permissions')
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
