import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Book, FileText, Video, Headphones, Search, Loader2, ExternalLink, Download } from 'lucide-react'
import Layout from '../../components/Layout'
import { knowledgeService } from '../../services/knowledge.service'

export default function KnowledgeBase() {
    const [articles, setArticles] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setIsLoading(true);
                const articlesData = await knowledgeService.getArticles();
                setArticles(articlesData || []);
                setError(null);
            } catch (error: any) {
                console.error('Failed to fetch articles:', error);
                setError('Maqolalarni yuklashda xatolik yuz berdi.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticles();
    }, []);

    const filteredArticles = articles.filter(a =>
        a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getIcon = (type: string) => {
        switch (type?.toUpperCase()) {
            case 'PDF': return FileText
            case 'VIDEO': return Video
            case 'AUDIO': return Headphones
            case 'ARTICLE': return Book
            case 'PRESENTATION': return FileText
            default: return Book
        }
    };

    return (
        <Layout role="user">
            <div className="p-4 md:p-8 space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-gray-900">Bilimlar Bazasi</h1>
                        <p className="text-gray-600">O'quv materiallari, qo'llanmalar va foydali hujjatlar.</p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Material qidirish..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-10 h-11 bg-white"
                        />
                    </div>
                </header>

                {error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                        <p className="font-medium text-sm">{error}</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Materiallar yuklanmoqda...</p>
                    </div>
                ) : filteredArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArticles.map((item, index) => {
                            const Icon = getIcon(item.type || 'other')
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="card group hover:border-primary-500 transition-all overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 rounded-xl bg-gray-50 text-gray-600 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 text-gray-500 uppercase tracking-widest">
                                                {item.type || 'Doc'}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-display font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-6">
                                            {item.content?.substring(0, 100) || "Ushbu material kompaniya ichki bilimlar bazasiga tegishli."}
                                        </p>

                                        <div className="flex items-center gap-3">
                                            {item.type === 'VIDEO' || (item.content?.startsWith('http')) ? (
                                                <a
                                                    href={item.content}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-primary flex-1 py-2 text-sm gap-2"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    Ko'rish
                                                </a>
                                            ) : (
                                                <button className="btn btn-primary flex-1 py-2 text-sm gap-2">
                                                    <Download className="w-4 h-4" />
                                                    Yuklab olish
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="h-1 bg-gray-100 w-full">
                                        <div className="h-full bg-primary-500 w-0 group-hover:w-full transition-all duration-500"></div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <Book className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-display font-semibold text-gray-600">Materiallar topilmadi</h3>
                        <p className="text-gray-500">Qidiruv bo'yicha hech qanday ma'lumot mavjud emas.</p>
                    </div>
                )}
            </div>
        </Layout>
    )
}
