import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, FileText, Eye, Trash2, Edit } from 'lucide-react'
import Layout from '../../components/Layout'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { knowledgeService } from '../../services/knowledge.service'
import { Loader2 } from 'lucide-react'



export default function ContentCatalog() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [articles, setArticles] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchArticles = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await knowledgeService.getArticles()
            setArticles(response || [])
        } catch (err: any) {
            setError('Maqolalarni yuklashda xatolik yuz berdi')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchArticles()
    }, [])

    const handleDelete = (id: string) => {
        if (confirm('Ushbu maqolani o\'chirmoqchimisiz?')) {
            setArticles(articles.filter(a => a.id !== id))
        }
    }

    return (
        <Layout>
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-gray-900">Bilimlar Bazasi</h1>
                        <p className="text-gray-500 text-sm">Barcha o'quv materiallari va maqolalar</p>
                    </div>
                    <Button icon={<Plus size={20} />} onClick={() => navigate('/admin/content/new')}>
                        Yangi Maqola
                    </Button>
                </div>

                {error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                        <p className="font-medium text-sm">{error}</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Maqolalar yuklanmoqda...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                            <Input
                                placeholder="Maqolalarni qidirish..."
                                icon={<Search size={20} />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-sm font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Sarlavha</th>
                                        <th className="px-6 py-4">Kategoriya</th>
                                        <th className="px-6 py-4">Muallif</th>
                                        <th className="px-6 py-4">Ko'rishlar</th>
                                        <th className="px-6 py-4">Yangilangan</th>
                                        <th className="px-6 py-4 text-right">Amallar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {articles.map((article) => (
                                        <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                        <FileText size={18} />
                                                    </div>
                                                    <div className="font-medium text-gray-900">{article.title}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                                                    {article.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{article.author}</td>
                                            <td className="px-6 py-4 text-gray-600 flex items-center gap-1">
                                                <Eye size={14} /> {article.views}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{article.lastUpdated}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Tahrirlash">
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(article.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="O'chirish"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}
