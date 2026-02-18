import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Calendar, MapPin, Briefcase, Edit2, Save, X, Camera, Lock, Bell, Globe, Loader2 } from 'lucide-react'
import Layout from '../../components/Layout'
import { analyticsService } from '../../services/analytics.service'

export default function UserProfile() {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile')

    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        joinDate: '',
        location: ''
    })

    const [settings, setSettings] = useState({
        language: 'uz',
        notifications: {
            email: true,
            push: true,
            sms: false
        },
        theme: 'light'
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data: any = await analyticsService.getEmployeeSummary('me')
                setProfileData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    position: data.position || '',
                    department: data.department || '',
                    joinDate: data.joinDate || '',
                    location: data.location || ''
                })
            } catch (error) {
                console.error('Failed to fetch profile:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // API call to save profile
            await new Promise(resolve => setTimeout(resolve, 1000)) // Mock delay
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to save profile:', error)
            alert('Profilni saqlashda xatolik yuz berdi')
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        // Reset form data
    }

    if (isLoading) {
        return (
            <Layout role="user">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Profil yuklanmoqda...</p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout role="user">
            <div className="p-4 md:p-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Shaxsiy Profil</h1>
                        <p className="text-gray-600">Shaxsiy ma'lumotlaringizni boshqaring</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`pb-4 px-1 font-medium transition-colors relative ${activeTab === 'profile'
                                ? 'text-primary-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Profil Ma'lumotlari
                            {activeTab === 'profile' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`pb-4 px-1 font-medium transition-colors relative ${activeTab === 'settings'
                                ? 'text-primary-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Sozlamalar
                            {activeTab === 'settings' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                                />
                            )}
                        </button>
                    </div>
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Avatar Section */}
                        <div className="lg:col-span-1">
                            <div className="card p-6 text-center">
                                <div className="relative inline-block mb-4">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-4xl font-bold">
                                        {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border-2 border-gray-100 hover:bg-gray-50 transition-colors">
                                        <Camera className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">
                                    {profileData.firstName} {profileData.lastName}
                                </h2>
                                <p className="text-gray-600 mb-4">{profileData.position}</p>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Briefcase className="w-4 h-4" />
                                        <span>{profileData.department}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>Qo'shildi: {profileData.joinDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="w-4 h-4" />
                                        <span>{profileData.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <div className="lg:col-span-2">
                            <div className="card p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-900">Shaxsiy Ma'lumotlar</h3>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="btn btn-ghost flex items-center gap-2"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Tahrirlash
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleCancel}
                                                className="btn btn-ghost flex items-center gap-2"
                                                disabled={isSaving}
                                            >
                                                <X className="w-4 h-4" />
                                                Bekor qilish
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="btn btn-primary flex items-center gap-2"
                                                disabled={isSaving}
                                            >
                                                {isSaving ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Save className="w-4 h-4" />
                                                )}
                                                Saqlash
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <User className="w-4 h-4 inline mr-1" />
                                            Ism
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.firstName}
                                            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                            disabled={!isEditing}
                                            className="input w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <User className="w-4 h-4 inline mr-1" />
                                            Familiya
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.lastName}
                                            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                            disabled={!isEditing}
                                            className="input w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Mail className="w-4 h-4 inline mr-1" />
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            disabled={!isEditing}
                                            className="input w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Phone className="w-4 h-4 inline mr-1" />
                                            Telefon
                                        </label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            disabled={!isEditing}
                                            className="input w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Briefcase className="w-4 h-4 inline mr-1" />
                                            Lavozim
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.position}
                                            disabled
                                            className="input w-full bg-gray-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <MapPin className="w-4 h-4 inline mr-1" />
                                            Manzil
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.location}
                                            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                            disabled={!isEditing}
                                            className="input w-full"
                                        />
                                    </div>
                                </div>

                                {/* Change Password Section */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Lock className="w-5 h-5" />
                                        Parolni o'zgartirish
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Joriy parol
                                            </label>
                                            <input
                                                type="password"
                                                className="input w-full"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div></div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Yangi parol
                                            </label>
                                            <input
                                                type="password"
                                                className="input w-full"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Parolni tasdiqlash
                                            </label>
                                            <input
                                                type="password"
                                                className="input w-full"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <button className="btn btn-primary mt-4">
                                        Parolni yangilash
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="max-w-3xl">
                        <div className="card p-6 space-y-8">
                            {/* Language Settings */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Globe className="w-5 h-5" />
                                    Til sozlamalari
                                </h3>
                                <select
                                    value={settings.language}
                                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                                    className="input w-full max-w-xs"
                                >
                                    <option value="uz">O'zbekcha</option>
                                    <option value="ru">Русский</option>
                                    <option value="en">English</option>
                                </select>
                            </div>

                            {/* Notification Settings */}
                            <div className="pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Bell className="w-5 h-5" />
                                    Bildirishnoma sozlamalari
                                </h3>
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                        <div>
                                            <p className="font-medium text-gray-900">Email bildirishnomalar</p>
                                            <p className="text-sm text-gray-600">Yangiliklar va xabarnomalarni emailga olish</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.email}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                notifications: { ...settings.notifications, email: e.target.checked }
                                            })}
                                            className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                        <div>
                                            <p className="font-medium text-gray-900">Push bildirishnomalar</p>
                                            <p className="text-sm text-gray-600">Brauzer orqali bildirishnomalar olish</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.push}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                notifications: { ...settings.notifications, push: e.target.checked }
                                            })}
                                            className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                        <div>
                                            <p className="font-medium text-gray-900">SMS bildirishnomalar</p>
                                            <p className="text-sm text-gray-600">Muhim xabarlarni SMS orqali olish</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.sms}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                notifications: { ...settings.notifications, sms: e.target.checked }
                                            })}
                                            className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end pt-6 border-t border-gray-200">
                                <button className="btn btn-primary">
                                    Sozlamalarni saqlash
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}
