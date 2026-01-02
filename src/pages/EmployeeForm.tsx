import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    User,
    Mail,
    Phone,
    Calendar,
    Upload,
    ArrowLeft,
    Save,
    FileText
} from 'lucide-react'
import Layout from '../components/Layout'
import Input from '../components/Input'
import Select from '../components/Select'
import Button from '../components/Button'

export default function EmployeeForm() {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEdit = Boolean(id)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        status: 'active',
        videoUrl: '',
        testUrl: '',
        avatar: null as string | null
    })



    const statuses = [
        { value: 'active', label: 'Faol' },
        { value: 'inactive', label: 'Nofaol' },
        { value: 'on-leave', label: 'Ta\'tilda' },
    ]

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatar: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsLoading(false)
        navigate('/employees')
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/employees')}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-gray-900">
                            {isEdit ? 'Xodimni Tahrirlash' : 'Yangi Xodim'}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {isEdit ? 'Xodim ma\'lumotlarini o\'zgartirish' : 'Tizimga yangi xodim qo\'shish'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Main Info Card */}
                    <div className="card bg-white border border-gray-200 shadow-sm p-6 rounded-2xl">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Avatar Upload */}
                            <div className="flex flex-col items-center gap-4">
                                <div
                                    className="w-32 h-32 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary-500 transition-colors relative group"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {formData.avatar ? (
                                        <img
                                            src={formData.avatar}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center p-4">
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <span className="text-xs text-gray-500">Rasm yuklash</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-xs font-medium">O'zgartirish</span>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {/* Personal Info Fields */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Ism"
                                    placeholder="Ismini kiriting"
                                    icon={<User size={18} />}
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Familiya"
                                    placeholder="Familiyasini kiriting"
                                    icon={<User size={18} />}
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="Email manzil"
                                    icon={<Mail size={18} />}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="md:col-span-2"
                                />
                                <Input
                                    label="Telefon"
                                    type="tel"
                                    placeholder="+998 90 123 45 67"
                                    icon={<Phone size={18} />}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Tug'ilgan sana"
                                    type="date"
                                    icon={<Calendar size={18} />}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Job Details Card */}
                    <div className="card bg-white border border-gray-200 shadow-sm p-6 rounded-2xl">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ish Ma'lumotlari</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                className="md:col-span-2"
                                label="Status"
                                options={statuses}
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            />
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Video darslik</label>
                                <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) setFormData({ ...formData, videoUrl: file.name })
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Test materiali</label>
                                <Button
                                    variant="secondary"
                                    className="w-full justify-center border-dashed"
                                    icon={<FileText size={18} />}
                                    onClick={() => alert('Test biriktirish oynasi tez orada ochiladi')}
                                    type="button"
                                >
                                    Test Biriktirish
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/employees')}
                            type="button"
                        >
                            Bekor qilish
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            isLoading={isLoading}
                            icon={<Save size={20} />}
                        >
                            {isEdit ? 'Saqlash' : 'Qo\'shish'}
                        </Button>
                    </div>
                </form>
            </div>
        </Layout>
    )
}
