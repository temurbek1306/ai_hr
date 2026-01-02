import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, UserPlus, Clock, TrendingUp, BarChart3, Calendar, Bell, Search } from 'lucide-react'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import RecentActivity from '../components/RecentActivity'

export default function Dashboard() {
    const navigate = useNavigate()

    const stats = [
        {
            title: 'Jami Xodimlar',
            value: '248',
            change: '+12%',
            trend: 'up',
            icon: Users,
            color: 'primary',
        },
        {
            title: 'Yangi Arizalar',
            value: '18',
            change: '+5',
            trend: 'up',
            icon: UserPlus,
            color: 'secondary',
        },
        {
            title: 'Kutilmoqda',
            value: '7',
            change: '-3',
            trend: 'down',
            icon: Clock,
            color: 'yellow',
        },
        {
            title: 'Bu Oy',
            value: '32',
            change: '+18%',
            trend: 'up',
            icon: TrendingUp,
            color: 'green',
        },
    ]

    const recentActivities = [
        {
            user: 'Alisher Karimov',
            action: 'yangi xodim qo\'shildi',
            time: '5 daqiqa oldin',
            avatar: 'AK',
        },
        {
            user: 'Malika Yusupova',
            action: 'profil yangilandi',
            time: '1 soat oldin',
            avatar: 'MY',
        },
        {
            user: 'Sardor Rahimov',
            action: 'ariza yuborildi',
            time: '2 soat oldin',
            avatar: 'SR',
        },
    ]

    const quickActions = [
        { icon: UserPlus, label: 'Xodim Qo\'shish', color: 'primary', path: '/employees/new' },
        { icon: Search, label: 'Qidirish', color: 'secondary', path: '/employees' },
        { icon: BarChart3, label: 'Hisobotlar', color: 'yellow', path: '/reports' },
        { icon: Calendar, label: 'Kalendar', color: 'green', path: '/calendar' },
    ]

    return (
        <Layout>
            <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold mb-1 text-gray-900">
                            Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Xush kelibsiz! Bu yerda umumiy ma'lumotlarni ko'rishingiz mumkin.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="btn btn-ghost text-gray-600 hover:bg-gray-100">
                            <Bell className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/employees/new')}
                            className="btn btn-primary"
                        >
                            <UserPlus className="w-5 h-5" />
                            Yangi Xodim
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <StatCard {...stat} />
                        </motion.div>
                    ))}
                </div>

                {/* Charts & Activity */}
                <div className="grid lg:grid-cols-3 gap-4">
                    {/* Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 card bg-white border border-gray-200 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-display font-semibold text-gray-900">
                                Xodimlar Statistikasi
                            </h3>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1 text-sm rounded-lg bg-primary-50 text-primary-600 font-medium">
                                    Hafta
                                </button>
                                <button className="px-3 py-1 text-sm rounded-lg text-gray-500 hover:bg-gray-100">
                                    Oy
                                </button>
                                <button className="px-3 py-1 text-sm rounded-lg text-gray-500 hover:bg-gray-100">
                                    Yil
                                </button>
                            </div>
                        </div>

                        {/* Simple bar chart visualization */}
                        <div className="h-64 flex items-end justify-between gap-2">
                            {[65, 45, 78, 52, 88, 72, 95].map((height, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                                        className="w-full bg-gradient-to-t from-primary-500 to-primary-300 rounded-t-lg relative group cursor-pointer"
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                                            {height}%
                                        </div>
                                    </motion.div>
                                    <span className="text-xs text-gray-500">
                                        {['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'][index]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="card bg-white border border-gray-200 shadow-sm"
                    >
                        <h3 className="text-lg font-display font-semibold mb-6 text-gray-900">
                            So'nggi Faoliyat
                        </h3>
                        <div className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <RecentActivity key={index} {...activity} />
                            ))}
                        </div>
                        <button className="w-full mt-4 btn btn-ghost text-sm text-gray-600 hover:bg-gray-50">
                            Barchasini ko'rish
                        </button>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="card bg-white border border-gray-200 shadow-sm"
                >
                    <h3 className="text-lg font-display font-semibold mb-6 text-gray-900">
                        Tez Harakatlar
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => navigate(action.path)}
                                className="card-hover text-center p-6 border border-gray-100 rounded-xl hover:border-primary-100 hover:bg-primary-50/30 transition-all"
                            >
                                <action.icon className={`w-8 h-8 mx-auto mb-3 text-${action.color}-500`} />
                                <p className="text-sm font-medium text-gray-700">{action.label}</p>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </Layout>
    )
}
