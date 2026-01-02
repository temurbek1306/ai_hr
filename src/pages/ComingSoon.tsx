import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Construction } from 'lucide-react'
import Layout from '../components/Layout'

interface ComingSoonProps {
    title: string
    description: string
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
    const navigate = useNavigate()

    return (
        <Layout>
            <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
                <div className="text-center max-w-md mx-auto">
                    <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
                        <Construction className="w-10 h-10 text-primary-500" />
                    </div>

                    <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">
                        {title}
                    </h1>

                    <p className="text-gray-500 mb-8 leading-relaxed">
                        {description}
                    </p>

                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-secondary inline-flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Ortga qaytish
                    </button>
                </div>
            </div>
        </Layout>
    )
}
