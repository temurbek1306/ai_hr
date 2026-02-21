import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Clock, CheckCircle, XCircle, Play } from 'lucide-react'

type Test = {
    id: string;
    title: string;
    description?: string;
    videoUrl?: string;
    duration?: number;
}

interface TestCardProps {
    test: Test

    status?: 'not_started' | 'in_progress' | 'completed' | 'passed' | 'failed'
    score?: number
    onStart?: () => void
}

export default function TestCard({ test, status = 'not_started', score, onStart }: TestCardProps) {
    const [showVideo, setShowVideo] = useState(false)

    const getStatusBadge = () => {
        switch (status) {
            case 'passed':
                return (
                    <div className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        O'tildi
                    </div>
                )
            case 'failed':
                return (
                    <div className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold text-center leading-tight">
                        <XCircle className="w-3 h-3 shrink-0" />
                        Qayta topshirish
                    </div>
                )
            case 'in_progress':
                return (
                    <div className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-semibold">
                        Jarayonda
                    </div>
                )
            case 'completed':
                return (
                    <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                        Tugallandi
                    </div>
                )
            default:
                return (
                    <div className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-semibold">
                        Yangi
                    </div>
                )
        }
    }

    const renderVideo = () => {
        if (!test.videoUrl) return null;

        const isYouTube = test.videoUrl.includes('youtube.com') || test.videoUrl.includes('youtu.be');
        const embedUrl = isYouTube
            ? test.videoUrl.replace('watch?v=', 'embed/').split('&')[0].replace('youtu.be/', 'youtube.com/embed/')
            : test.videoUrl;

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
                        src={test.videoUrl}
                        controls
                        className="w-full h-full"
                    />
                )}
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="card group hover:border-primary-500 transition-all cursor-pointer overflow-hidden flex flex-col h-full bg-white shadow-sm border border-gray-200 rounded-2xl"
        >
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        {test.videoUrl && (
                            <div
                                onClick={(e) => { e.stopPropagation(); setShowVideo(!showVideo); }}
                                className={`p-2 rounded-lg cursor-pointer transition-colors ${showVideo ? 'bg-primary-100 text-primary-700' : 'bg-gray-50 text-gray-400 hover:bg-primary-50 hover:text-primary-600'}`}
                                title="Videoni ko'rish"
                            >
                                <Play className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                    {getStatusBadge()}
                </div>

                <h3 className="text-xl font-display font-bold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">
                    {test.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {test.description || "Ushbu test orqali o'z bilimlaringizni sinab ko'ring va natijalarni yaxshilang."}
                </p>

                {showVideo && renderVideo()}

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 mt-auto">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{test.duration
                            ? (test.duration > 120 ? Math.round(test.duration / 60) : test.duration)
                            : 20} daqiqa</span>
                    </div>

                    {score !== undefined && (
                        <div className="flex items-center gap-1 font-semibold text-primary-600">
                            <span>Ball: {score}/100</span>
                        </div>
                    )}
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onStart?.();
                    }}
                    className="btn btn-primary w-full group-hover:bg-primary-600 flex items-center justify-center gap-2"
                >
                    <Play className="w-4 h-4" />
                    {status === 'not_started' ? 'Testni boshlash' : status === 'failed' ? 'Qayta topshirish' : 'Davom ettirish'}
                </button>
            </div>

            {/* Progress indicator at bottom */}
            <div className="h-1 bg-gray-100 w-full">
                <motion.div
                    className="h-full bg-primary-500"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </motion.div>
    )
}
