import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Construction } from 'lucide-react'
import Layout from './Layout'

interface FeaturePlaceholderProps {
    title: string
    description: string
    backUrl: string
}

export default function FeaturePlaceholder({ title, description, backUrl }: FeaturePlaceholderProps) {
    const navigate = useNavigate()

    return (
        <Layout>
            <div className="p-6">
                <button
                    onClick={() => navigate(backUrl)}
                    className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-6"
                >
                    <ArrowLeft size={20} />
                    <span>Ortga qaytish</span>
                </button>

                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto">
                    <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                        <Construction className="w-12 h-12 text-primary-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {description}
                        <br />
                        <span className="text-sm text-gray-400 mt-2 block">
                            (Ushbu funksionallik uchun Backend API integratsiyasi kutilmoqda)
                        </span>
                    </p>
                    <button
                        onClick={() => navigate(backUrl)}
                        className="btn btn-primary"
                    >
                        Bosh sahifaga qaytish
                    </button>
                </div>
            </div>
        </Layout>
    )
}
