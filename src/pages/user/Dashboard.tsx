import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Book, FileText, Target, BarChart, Bell, Loader2, CheckCircle, Clock } from 'lucide-react'
import Layout from '../../components/Layout'
import { useState, useEffect } from 'react'
import { profileService } from '../../services/profile.service'
import { formatRelative } from '../../utils/dateFormat'

export default function UserDashboard() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [userData, setUserData] = useState<any>(null)
    const [testResults, setTestResults] = useState<any[]>([])
    const [activities, setActivities] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                const [profile, summary] = await Promise.all([
                    profileService.getProfile(),
                    profileService.getSummary().catch(() => ({}))
                ]);
                setUserData({ ...profile, ...summary });

                // Fetch real test results
                try {
                    const resultsData = await profileService.getOwnTestResults();
                    const results = (resultsData as any)?.results || [];
                    setTestResults(results);
                } catch (e) {
                    // Optional: fetch failed
                }

                // Fetch real activities
                try {
                    const actData = await profileService.getOwnActivities();
                    setActivities(Array.isArray(actData) ? actData.slice(0, 5) : []);
                } catch (e) {
                    // Optional: fetch failed
                }

                setError(null);
            } catch (error: any) {
                console.error('Failed to fetch user data:', error);
                setError('Ma\'lumotlarni yuklashda xatolik yuz berdi.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const quickLinks = [
        { icon: Book, label: 'Bilimlar Bazasi', path: '/user/knowledge', color: 'blue' },
        { icon: FileText, label: 'Testlar', path: '/user/tests', color: 'green' },
        { icon: Target, label: 'Rivojlanish Rejasi', path: '/user/ipr', color: 'purple' },
        { icon: BarChart, label: 'Natijalarim', path: '/user/results', color: 'orange' },
    ]

    return (
        <Layout role="user">
            <div className="p-4 space-y-6">
                {/* User Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-gray-900">
                            Xush kelibsiz, {userData?.firstName || userData?.fullName?.split(' ')[0] || 'Xodim'}!
                        </h1>
                        <p className="text-gray-600">Bugun o'rganish va rivojlanish uchun ajoyib kun.</p>
                    </div>
                    <button className="btn btn-ghost">
                        <Bell className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Welcome/Training Video - Compact */}
                {userData?.videoUrl && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                                <Book className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">O'quv/Tanishuv Videosi</h3>
                                <p className="text-xs text-gray-500">Siz uchun biriktirilgan maxsus video qo'llanma</p>
                            </div>
                        </div>
                        {/* Compact video - max 360px height */}
                        <div className="w-full rounded-xl overflow-hidden bg-gray-900 shadow-inner" style={{ maxHeight: '320px', aspectRatio: '16/9' }}>
                            {userData.videoUrl.includes('youtube.com') || userData.videoUrl.includes('youtu.be') ? (
                                <iframe
                                    src={userData.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <video
                                    src={userData.videoUrl}
                                    controls
                                    className="w-full h-full"
                                    style={{ maxHeight: '320px' }}
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Status Card */}
                {error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                        <p className="font-medium text-sm">{error}</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                    </div>
                ) : (
                    <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">
                                    Holati: {
                                        userData?.status === 'active' ? '✅ Faol xodim'
                                            : userData?.status === 'ACTIVE' ? '✅ Faol xodim'
                                                : '⏳ Onboarding davom etmoqda'
                                    }
                                </h2>
                                <p className="text-blue-100 mb-4 max-w-md">
                                    {(userData?.status === 'active' || userData?.status === 'ACTIVE')
                                        ? "Siz muvaffaqiyatli onboardingdan o'tdingiz va hozirda faol xodimsiz."
                                        : "Siz hozir onboarding jarayonidasiz. Belgilangan testlarni topshiring."}
                                </p>
                                <div className="flex gap-2">
                                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                        Testlar: {testResults.length} ta topshirilgan
                                    </span>
                                    {userData?.averageScore != null && (
                                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                            O'rtacha ball: {userData.averageScore}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center font-bold text-xl">
                                    {testResults.length > 0 ? Math.round(
                                        testResults.reduce((s: number, r: any) => s + (r.score || 0), 0) / testResults.length
                                    ) : 0}%
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Actions Grid */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
                        <span className="w-1 h-4 rounded-full bg-emerald-500 inline-block"></span>
                        Tezkor O'tish
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickLinks.map((link, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(link.path)}
                                className="bg-white/90 p-6 rounded-xl shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md hover:bg-emerald-50/30 hover:-translate-y-0.5 flex flex-col items-center gap-3 transition-all duration-200"
                            >
                                <div className={`p-3 rounded-full bg-${link.color}-50`}>
                                    <link.icon className={`w-6 h-6 text-${link.color}-600`} />
                                </div>
                                <span className="font-medium text-gray-800">{link.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Real Test Results + Activities */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Real test results */}
                    <div className="bg-white/90 rounded-xl shadow-sm border border-emerald-100 border-t-2 border-t-emerald-400 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
                            <span className="w-1 h-4 rounded-full bg-emerald-500 inline-block"></span>
                            Mening Natijalarim
                        </h3>
                        {testResults.length === 0 ? (
                            <div className="text-center py-6 text-gray-400">
                                <BarChart className="w-10 h-10 mx-auto mb-2 opacity-40" />
                                <p className="text-sm">Hali test topshirilmagan</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {testResults.slice(0, 4).map((r: any, i: number) => {
                                    const score = r.score || 0;
                                    const passed = score >= 70;
                                    return (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600 truncate mr-2">{r.testTitle || 'Test'}</span>
                                                <span className={`font-medium ${passed ? 'text-green-600' : 'text-red-500'}`}>
                                                    {score}/100
                                                </span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${passed ? 'bg-green-500' : 'bg-red-400'}`}
                                                    style={{ width: `${score}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Real Activities */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">So'nggi Faoliyatlar</h3>
                        {activities.length === 0 ? (
                            <div className="text-center py-6 text-gray-400">
                                <Clock className="w-10 h-10 mx-auto mb-2 opacity-40" />
                                <p className="text-sm">Hozircha faoliyat yo'q</p>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {activities.map((act: any, i: number) => (
                                    <li key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                        <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-700 truncate">{act.description || act.title}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{formatRelative(act.timestamp)}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}
