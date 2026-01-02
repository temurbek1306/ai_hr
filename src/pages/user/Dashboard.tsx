import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Book, FileText, Target, BarChart, Bell } from 'lucide-react'
import Layout from '../../components/Layout'

export default function UserDashboard() {
    const navigate = useNavigate()

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
                        <h1 className="text-3xl font-display font-bold text-gray-900">Xush kelibsiz, Temurbek!</h1>
                        <p className="text-gray-600">Bugun o'rganish va rivojlanish uchun ajoyib kun.</p>
                    </div>
                    <button className="btn btn-ghost">
                        <Bell className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Status Card */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Jarayon: Onboarding</h2>
                            <p className="text-blue-100 mb-4 max-w-md">
                                Siz hozir sinov muddatidasiz. Muvaffaqiyatli o'tish uchun belgilangan testlarni topshiring.
                            </p>
                            <div className="flex gap-2">
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                    Progress: 35%
                                </span>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            {/* Simple circular progress placeholder */}
                            <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center font-bold text-xl">
                                35%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tezkor O'tish</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickLinks.map((link, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(link.path)}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:shadow-md transition-all"
                            >
                                <div className={`p-3 rounded-full bg-${link.color}-50`}>
                                    <link.icon className={`w-6 h-6 text-${link.color}-600`} />
                                </div>
                                <span className="font-medium text-gray-800">{link.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Tasks List */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mening Vazifalarim</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <input type="checkbox" className="rounded text-primary-600" />
                                <span className="text-gray-700">Xavfsizlik bo'yicha kirish testi</span>
                                <span className="ml-auto text-xs text-red-500 font-medium">Bugun</span>
                            </li>
                            <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <input type="checkbox" className="rounded text-primary-600" />
                                <span className="text-gray-700">Kompaniya qoidalari bilan tanishish</span>
                                <span className="ml-auto text-xs text-gray-500">Erta</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mening Natijalarim</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Texnik Bilimlar</span>
                                    <span className="font-medium">85/100</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[85%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Soft Skills</span>
                                    <span className="font-medium">70/100</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[70%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
