import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '../../components/Layout'
import { Book, Edit3, ClipboardList, BarChart2 } from 'lucide-react'

export default function Testing() {
    const { t } = useTranslation()
    const modules = [
        {
            id: 'catalog',
            title: t('testing.modules.catalog.title'),
            description: t('testing.modules.catalog.desc'),
            icon: Book,
            color: 'bg-blue-100 text-blue-600'
        },
        {
            id: 'builder',
            title: t('testing.modules.builder.title'),
            description: t('testing.modules.builder.desc'),
            icon: Edit3,
            color: 'bg-green-100 text-green-600'
        },
        {
            id: 'assignments',
            title: t('testing.modules.assignments.title'),
            description: t('testing.modules.assignments.desc'),
            icon: ClipboardList,
            color: 'bg-purple-100 text-purple-600'
        },
        {
            id: 'analytics',
            title: t('testing.modules.analytics.title'),
            description: t('testing.modules.analytics.desc'),
            icon: BarChart2,
            color: 'bg-orange-100 text-orange-600'
        }
    ]

    const navigate = useNavigate()

    const handleNavigation = (path: string) => {
        // In a real app, these would be separate routes. 
        // For now, we can render the placeholder if clicked, or just navigate to a generic one.
        // Let's implement a simple internal state to show placeholder for demo purposes if we don't want to add 12 routes to App.tsx
        // OR better, stick to the request "Hammasi to'liq". Let's use the Query param or state to conditionally render content? 
        // No, cleaner to use proper routing or just an alert/modal? 
        // User wants "Pro". Let's navigate to a detailed placeholder page.
        navigate(`/admin/feature-unavailable?title=${encodeURIComponent(path)}`)
    }

    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">{t('testing.title')}</h1>
                <p className="text-gray-600 mb-8">{t('testing.description')}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {modules.map((module, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                if (module.id === 'builder') {
                                    navigate('/admin/testing/new')
                                } else if (module.id === 'catalog') {
                                    navigate('/admin/testing/catalog')
                                } else if (module.id === 'analytics') {
                                    navigate('/admin/testing/results')
                                } else if (module.id === 'assignments') {
                                    // Redirect to Employees for assignments as the modal is there
                                    navigate('/admin/employees')
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
