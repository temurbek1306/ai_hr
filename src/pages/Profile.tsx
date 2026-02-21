import { useState, useEffect } from 'react'
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
    Camera,
    Loader2
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout'
import Input from '../components/Input'
import Button from '../components/Button'

import { profileService } from '../services/profile.service'
import { toast } from 'react-hot-toast'

interface ProfileProps {
    role?: 'admin' | 'user'
}

export default function Profile({ role = 'admin' }: ProfileProps) {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState('personal')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [profileData, setProfileData] = useState<any>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: ''
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const data = await profileService.getProfile();
                setProfileData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    location: (data as any).location || ''
                })
            } catch (error) {
                console.error('Failed to fetch profile:', error)
                toast.error('Profil ma\'lumotlarini yuklashda xatolik')
            } finally {
                setIsLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const tabs = [
        { id: 'personal', label: t('profile.tabs.overview'), icon: User },
        { id: 'security', label: t('profile.tabs.settings'), icon: Shield },
        { id: 'notifications', label: t('profile.tabs.activity'), icon: Bell },
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const updated = await profileService.updateProfile({
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                phone: profileData.phone,
                location: profileData.location,
                email: profileData.email
            } as any);

            setProfileData({
                firstName: updated.firstName || profileData.firstName,
                lastName: updated.lastName || profileData.lastName,
                email: updated.email || profileData.email,
                phone: updated.phone || profileData.phone,
                location: (updated as any).location || profileData.location
            });

            // Sync with Sidebar (localStorage)
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const u = JSON.parse(userStr);
                localStorage.setItem('user', JSON.stringify({
                    ...u,
                    fullName: `${updated.firstName} ${updated.lastName}`.trim(),
                    firstName: updated.firstName,
                    email: updated.email
                }));
                window.dispatchEvent(new Event('user-profile-updated'));
            }

            toast.success('Profil muvaffaqiyatli saqlandi')
        } catch (error: any) {
            console.error('Failed to save profile:', error)
            const msg = error.response?.data?.message || error.message || 'Saqlashda xatolik yuz berdi'
            toast.error(msg)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Layout role={role}>
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-2xl font-display font-bold text-gray-900">{t('profile.title')}</h1>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar / Tabs */}
                    <div className="w-full lg:w-64 flex-shrink-0 space-y-4">
                        {/* Profile Summary Card */}
                        <div className="card bg-white border border-gray-200 shadow-sm p-6 rounded-2xl text-center">
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                {isLoading ? (
                                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-3xl font-bold shadow-md">
                                        {profileData?.firstName?.[0] || 'U'}
                                    </div>
                                )}
                                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 hover:bg-gray-50 text-gray-500 hover:text-primary-500 transition-colors">
                                    <Camera size={16} />
                                </button>
                            </div>
                            <h2 className="font-bold text-gray-900">
                                {isLoading ? 'Yuklanmoqda...' : `${profileData?.firstName || 'Foydalanuvchi'}`}
                            </h2>
                            <p className="text-sm text-gray-500">{role === 'admin' ? t('roles.administrator') : t('roles.employee')}</p>
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
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.tabs.overview')}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    label={t('employees.form.firstName')}
                                                    value={profileData?.firstName || ''}
                                                    onChange={e => setProfileData({ ...profileData, firstName: e.target.value })}
                                                    icon={<User size={18} />}
                                                />
                                                <Input
                                                    label={t('employees.form.lastName')}
                                                    value={profileData?.lastName || ''}
                                                    onChange={e => setProfileData({ ...profileData, lastName: e.target.value })}
                                                    icon={<User size={18} />}
                                                />
                                                <Input
                                                    label={t('profile.email')}
                                                    type="email"
                                                    value={profileData?.email || ''}
                                                    onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                                    icon={<Mail size={18} />}
                                                    className="md:col-span-2"
                                                />
                                                <Input
                                                    label={t('profile.phone')}
                                                    type="tel"
                                                    value={profileData?.phone || ''}
                                                    onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                                                    icon={<Phone size={18} />}
                                                />
                                                <Input
                                                    label={t('profile.location')}
                                                    value={profileData?.location || ''}
                                                    onChange={e => setProfileData({ ...profileData, location: e.target.value })}
                                                    icon={<MapPin size={18} />}
                                                />
                                            </div>
                                            <div className="flex justify-end pt-4 border-t border-gray-200">
                                                <Button type="submit" variant="primary" icon={<Save size={18} />} isLoading={isSaving}>
                                                    {t('common.save')}
                                                </Button>
                                            </div>
                                        </form>
                                    )}

                                    {activeTab === 'security' && (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.security.title')}</h3>
                                            <div className="space-y-4">
                                                <Input label={t('profile.security.currentPassword')} type="password" icon={<Key size={18} />} />
                                                <Input label={t('profile.security.newPassword')} type="password" icon={<Key size={18} />} />
                                                <Input label={t('profile.security.confirmPassword')} type="password" icon={<Key size={18} />} />
                                            </div>
                                            <div className="flex justify-end pt-4 border-t border-gray-200">
                                                <Button type="submit" variant="primary" icon={<Save size={18} />} isLoading={isLoading}>
                                                    {t('profile.security.updateButton')}
                                                </Button>
                                            </div>
                                        </form>
                                    )}

                                    {activeTab === 'notifications' && (
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.notifications.title')}</h3>
                                            <div className="space-y-4">
                                                <div className="space-y-4">
                                                    {['newEmployee', 'application', 'news'].map((key, index) => (
                                                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                            <div>
                                                                <h4 className="font-medium text-gray-900">{t(`profile.notifications.${key}.title`)}</h4>
                                                                <p className="text-sm text-gray-500">{t(`profile.notifications.${key}.desc`)}</p>
                                                            </div>
                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                <input type="checkbox" className="sr-only peer" defaultChecked={index !== 2} />
                                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
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
