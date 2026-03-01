import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Book, FileText, Video as VideoIcon, Headphones, Search, Loader2, ExternalLink, Download, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { knowledgeService } from '../../services/knowledge.service'
import { profileService } from '../../services/profile.service'
import { employeeService } from '../../services/employee.service'

export default function KnowledgeBase() {
    const navigate = useNavigate()
    const [articles, setArticles] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [userProfile, setUserProfile] = useState<any>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [articlesData, profileData] = await Promise.all([
                    knowledgeService.getArticles(),
                    profileService.getProfile()
                ]);

                let filteredList = articlesData || [];

                if (profileData?.id) {
                    try {
                        const assignments: any[] = await employeeService.getAssignments(profileData.id);
                        if (assignments && Array.isArray(assignments) && assignments.length > 0) {
                            const assignedMaterialIds = assignments
                                .filter(a => a.assignmentType === 'MATERIAL')
                                .map(a => a.referenceId);

                            // Filter articles by assigned IDs
                            if (assignedMaterialIds.length > 0) {
                                filteredList = filteredList.filter(a => assignedMaterialIds.includes(a.id));
                            }
                        } else {
                            console.warn('No assignments found for user for KB, showing all');
                        }
                    } catch (e) {
                        console.error('Failed to fetch assignments for KB:', e);
                        // Fallback: show all if fetch fails
                    }
                }

                setArticles(filteredList);
                setUserProfile(profileData);
                setError(null);
            } catch (error: any) {
                console.error('Failed to fetch knowledge base data:', error);
                setError('Ma\'lumotlarni yuklashda xatolik yuz berdi.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredArticles = articles.filter(a =>
        a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getIcon = (type: string) => {
        switch (type?.toUpperCase()) {
            case 'PDF': return FileText
            case 'VIDEO': return VideoIcon
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
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/user/dashboard')}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        >
                            <ArrowLeft size={22} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-display font-bold text-gray-900">Bilimlar Bazasi</h1>
                            <p className="text-gray-600">O'quv materiallari, qo'llanmalar va foydali hujjatlar.</p>
                        </div>
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
                ) : (
                    <>
                        {/* Employee Featured Video */}
                        {userProfile?.videoUrl && !searchQuery && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-sm border border-primary-100 p-6 overflow-hidden mb-8"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                                        <VideoIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Asosiy O'quv Materiali</h3>
                                        <p className="text-sm text-gray-600">Siz uchun biriktirilgan maxsus video qo'llanma</p>
                                    </div>
                                </div>
                                <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-900 shadow-inner">
                                    {userProfile.videoUrl.includes('youtube.com') || userProfile.videoUrl.includes('youtu.be') ? (
                                        <iframe
                                            src={userProfile.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                            className="w-full h-full border-0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <video
                                            src={userProfile.videoUrl}
                                            controls
                                            className="w-full h-full"
                                        />
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {filteredArticles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredArticles.map((item, index) => (
                                    <ArticleCard
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        getIcon={getIcon}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <Book className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-display font-semibold text-gray-600">Materiallar topilmadi</h3>
                                <p className="text-gray-500">Qidiruv bo'yicha hech qanday ma'lumot mavjud emas.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    )
}

function ArticleCard({ item, index, getIcon }: { item: any; index: number; getIcon: any }) {
    const Icon = getIcon(item.type || 'other');
    const isVideo = item.type?.toUpperCase() === 'VIDEO';
    const videoUrl = item.mediaUrl || (item.content?.startsWith('http') ? item.content : null);
    const [showVideo, setShowVideo] = useState(false);

    const renderVideo = () => {
        if (!videoUrl) return null;
        const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
        const embedUrl = isYouTube
            ? videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/').split('&')[0]
            : videoUrl;

        return (
            <div className="mt-4 mb-4 rounded-xl overflow-hidden bg-gray-900 aspect-video shadow-inner border border-gray-200">
                {isYouTube ? (
                    <iframe
                        src={embedUrl}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <video
                        src={videoUrl}
                        controls
                        className="w-full h-full"
                    />
                )}
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card group hover:border-primary-500 transition-all overflow-hidden flex flex-col h-full bg-white shadow-sm border border-gray-200 rounded-2xl"
        >
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gray-50 text-gray-600 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                            <Icon className="w-6 h-6" />
                        </div>
                        {isVideo && videoUrl && (
                            <div
                                onClick={() => setShowVideo(!showVideo)}
                                className={`p-2 rounded-lg cursor-pointer transition-colors ${showVideo ? 'bg-primary-100 text-primary-700' : 'bg-gray-50 text-gray-400 hover:bg-primary-50 hover:text-primary-600'}`}
                                title="Videoni ko'rish"
                            >
                                <VideoIcon className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 text-gray-500 uppercase tracking-widest">
                        {item.type || 'Doc'}
                    </span>
                </div>

                <h3 className="text-lg font-display font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {item.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-6">
                    {item.content && !item.content.startsWith('http')
                        ? item.content.substring(0, 100)
                        : ""}
                </p>

                {showVideo && renderVideo()}

                <div className="flex items-center gap-3 mt-auto">
                    {videoUrl ? (
                        <a
                            href={videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary flex-1 py-2 text-sm gap-2"
                        >
                            <ExternalLink className="w-4 h-4" />
                            {isVideo ? "Videoni ochish" : "Ko'rish"}
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
    );
}
