import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Bell,
    Key,
    Save,
    Camera
} from 'lucide-react'
import Layout from '../components/Layout'
import Input from '../components/Input'
import Button from '../components/Button'

interface ProfileProps {
    role?: 'admin' | 'user'
}

export default function Profile({ role = 'admin' }: ProfileProps) {
    const [activeTab, setActiveTab] = useState('personal')
    const [isLoading, setIsLoading] = useState(false)

    const tabs = [
        { id: 'personal', label: 'Shaxsiy Ma\'lumotlar', icon: User },
        { id: 'security', label: 'Xavfsizlik', icon: Shield },
        { id: 'notifications', label: 'Bildirishnomalar', icon: Bell },
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // API simulation
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsLoading(false)
    }

    return (
        <Layout role={role}>
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-2xl font-display font-bold text-gray-900">Mening Profilim</h1>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar / Tabs */}
                    <div className="w-full lg:w-64 flex-shrink-0 space-y-4">
                        {/* Profile Summary Card */}
                        <div className="card bg-white border border-gray-200 shadow-sm p-6 rounded-2xl text-center">
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-3xl font-bold shadow-md">
                                    A
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 hover:bg-gray-50 text-gray-500 hover:text-primary-500 transition-colors">
                                    <Camera size={16} />
                                </button>
                            </div>
                            <h2 className="font-bold text-gray-900">Admin User</h2>
                            <p className="text-sm text-gray-500">Administrator</p>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="card bg-white border border-gray-200 shadow-sm p-2 rounded-2xl">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-primary-50 text-primary-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        <div className="card bg-white border border-gray-200 shadow-sm p-6 rounded-2xl">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {activeTab === 'personal' && (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shaxsiy Ma'lumotlar</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input label="Ism" defaultValue="Admin" icon={<User size={18} />} />
                                                <Input label="Familiya" defaultValue="User" icon={<User size={18} />} />
                                                <Input label="Email" type="email" defaultValue="admin@aihr.uz" icon={<Mail size={18} />} className="md:col-span-2" />
                                                <Input label="Telefon" type="tel" defaultValue="+998 90 123 45 67" icon={<Phone size={18} />} />
                                                <Input label="Manzil" defaultValue="Toshkent, O'zbekiston" icon={<MapPin size={18} />} />
                                            </div>
                                            <div className="flex justify-end pt-4 border-t border-gray-200">
                                                <Button type="submit" variant="primary" icon={<Save size={18} />} isLoading={isLoading}>
                                                    Saqlash
                                                </Button>
                                            </div>
                                        </form>
                                    )}

                                    {activeTab === 'security' && (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Parol va Xavfsizlik</h3>
                                            <div className="space-y-4">
                                                <Input label="Joriy Parol" type="password" icon={<Key size={18} />} />
                                                <Input label="Yangi Parol" type="password" icon={<Key size={18} />} />
                                                <Input label="Parolni Tasdiqlang" type="password" icon={<Key size={18} />} />
                                            </div>
                                            <div className="flex justify-end pt-4 border-t border-gray-200">
                                                <Button type="submit" variant="primary" icon={<Save size={18} />} isLoading={isLoading}>
                                                    Parolni Yangilash
                                                </Button>
                                            </div>
                                        </form>
                                    )}

                                    {activeTab === 'notifications' && (
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bildirishnoma Sozlamalari</h3>
                                            <div className="space-y-4">
                                                {[
                                                    { title: 'Yangi xodim qo\'shilganda', desc: 'Email orqali xabar berish' },
                                                    { title: 'Ariza kelib tushganda', desc: 'Email va Push notification' },
                                                    { title: 'Tizim yangiliklari', desc: 'Faqat muhim xabarlar' }
                                                ].map((item, index) => (
                                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input type="checkbox" className="sr-only peer" defaultChecked={index !== 2} />
                                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
