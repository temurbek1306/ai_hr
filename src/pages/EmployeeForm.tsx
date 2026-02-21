import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import {
    User,
    Mail,
    Phone,
    Calendar,
    Upload,
    ArrowLeft,
    Save,
    Video,
    Copy,
    Check,
    CheckCircle2
} from 'lucide-react'
import Layout from '../components/Layout'
import Input from '../components/Input'
import Select from '../components/Select'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { employeeService } from '../services/employee.service'
import { testService } from '../services/test.service'

export default function EmployeeForm() {
    const { t } = useTranslation()
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
        position: 'Employee', // Default value
        department: 'General', // Default value
        status: 'active' as 'active' | 'inactive' | 'on-leave',
        startDate: new Date().toISOString().split('T')[0],
        avatar: null as string | null,
        videoUrl: '', // Added for video link
        assignedTestIds: [] as string[] // Changed to multiple assignments
    })

    const [availableTests, setAvailableTests] = useState<{ id: string, title: string }[]>([])
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [credentials, setCredentials] = useState<{ email: string, username: string, password?: string } | null>(null)
    const [isCopied, setIsCopied] = useState(false)

    useEffect(() => {
        testService.getAll().then(data => {
            const tests = (data as any)?.body || data
            if (Array.isArray(tests)) {
                setAvailableTests(tests.map((t: any) => ({ id: t.id, title: t.title || t.name })))
            }
        }).catch(err => console.error('Failed to load tests:', err))

        if (isEdit && id) {
            Promise.all([
                employeeService.getById(id),
                employeeService.getAssignments(id)
            ]).then(([employeeData, assignments]) => {
                const testAssignments = assignments.filter(a => a.assignmentType === 'TEST');
                setFormData({
                    firstName: employeeData.firstName || '',
                    lastName: employeeData.lastName || '',
                    email: employeeData.email || '',
                    phone: employeeData.phone || '',
                    position: employeeData.position || 'Employee',
                    department: employeeData.department || 'General',
                    status: (employeeData.status as 'active' | 'inactive' | 'on-leave') || 'active',
                    startDate: employeeData.startDate || new Date().toISOString().split('T')[0],
                    avatar: (employeeData as any).avatar || null,
                    videoUrl: (employeeData as any).videoUrl || '',
                    assignedTestIds: testAssignments.map(a => a.referenceId)
                })
            }).catch(err => console.error('Failed to load employee details or assignments:', err))
        }

    }, [id, isEdit])

    const statuses = [
        { value: 'active', label: t('filters.statuses.active') },
        { value: 'inactive', label: t('filters.statuses.inactive') },
        { value: 'on-leave', label: t('filters.statuses.onLeave') || 'Ta\'tilda' },
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

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
            toast.error('Iltimos, barcha majburiy maydonlarni to\'ldiring')
            return
        }

        setIsLoading(true)
        try {
            if (isEdit && id) {
                // Update existing employee
                const updateData = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    position: formData.position,
                    department: formData.department,
                    status: formData.status,
                    startDate: formData.startDate,
                    videoUrl: formData.videoUrl
                }
                await employeeService.update(id, updateData)

                // Update assignment if selected - separate try-catch so it doesn't block
                // Update assignments if selected
                if (formData.assignedTestIds.length > 0) {
                    try {
                        await employeeService.createAssignment(id, {
                            assignmentType: 'TEST',
                            referenceIds: formData.assignedTestIds
                        });
                    } catch (assignErr) {
                        console.warn('Assignment create warning (non-blocking):', assignErr);
                    }
                }

                toast.success(t('common.updated'))

            } else {
                // Create new employee
                const createData = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    position: formData.position,
                    department: formData.department,
                    startDate: formData.startDate,
                    videoUrl: formData.videoUrl
                }
                const response = await employeeService.create(createData)
                const createdData = (response as any)?.body || response;
                const newEmployeeId = createdData?.id;

                if (createdData?.username) {
                    setCredentials({
                        email: formData.email,
                        username: createdData.username,
                        password: createdData.generatedPassword || 'welcome123'
                    })
                    setShowSuccessModal(true)
                    toast.success(t('common.added'))
                    return; // Don't navigate yet, let them see the modal
                }

                // Assign test if selected - separate try-catch
                // Assign tests if selected
                if (formData.assignedTestIds.length > 0 && newEmployeeId) {
                    try {
                        await employeeService.createAssignment(newEmployeeId, {
                            assignmentType: 'TEST',
                            referenceIds: formData.assignedTestIds
                        });
                    } catch (assignErr) {
                        console.warn('Assignment create warning (non-blocking):', assignErr);
                    }
                }
                toast.success(t('common.added'))
                navigate('/admin/employees')
            }
        } catch (error: any) {
            console.error('Xatolik:', error)
            toast.error('Xatolik yuz berdi: ' + (error.response?.data?.message || error.message))

        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/admin/employees')}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-gray-900">
                            {isEdit ? t('employees.form.editTitle') : t('employees.form.newTitle')}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {isEdit ? t('employees.form.editSubtitle') : t('employees.form.newSubtitle')}
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
                                            <span className="text-xs text-gray-500">{t('employees.form.uploadAvatar')}</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-xs font-medium">{t('employees.form.change')}</span>
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
                                    label={t('employees.form.firstName')}
                                    placeholder={t('employees.form.firstName')}
                                    icon={<User size={18} />}
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                />
                                <Input
                                    label={t('employees.form.lastName')}
                                    placeholder={t('employees.form.lastName')}
                                    icon={<User size={18} />}
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    required
                                />
                                <Input
                                    label={t('employees.table.email')}
                                    type="email"
                                    placeholder="email@example.com"
                                    icon={<Mail size={18} />}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="md:col-span-2"
                                />
                                <Input
                                    label={t('employees.table.phone')}
                                    type="tel"
                                    placeholder="+998 90 123 45 67"
                                    icon={<Phone size={18} />}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />

                                <Input
                                    label="Lavozim"
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    placeholder="Masalan: Dasturchi"
                                    icon={<User size={18} />}
                                    required
                                />

                                <Input
                                    label="Bo'lim"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    placeholder="Masalan: IT"
                                    icon={<User size={18} />}
                                    required
                                />

                                <Input
                                    label={t('employees.form.startDate')}
                                    type="date"
                                    icon={<Calendar size={18} />}
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Job Details Card */}
                    <div className="card bg-white border border-gray-200 shadow-sm p-6 rounded-2xl">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('employees.form.jobDetails')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                className="md:col-span-2"
                                label={t('employees.table.status')}
                                options={statuses}
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'on-leave' })}
                            />
                            <Input
                                label={t('employees.form.videoTutorial')}
                                placeholder="https://youtube.com/watch?v=..."
                                icon={<Video size={18} />}
                                value={formData.videoUrl}
                                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                            />
                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-medium text-gray-700">{t('employees.form.assignedTests')}</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    {availableTests.map(test => (
                                        <label key={test.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
                                                checked={formData.assignedTestIds.includes(test.id)}
                                                onChange={(e) => {
                                                    const newIds = e.target.checked
                                                        ? [...formData.assignedTestIds, test.id]
                                                        : formData.assignedTestIds.filter(id => id !== test.id);
                                                    setFormData({ ...formData, assignedTestIds: newIds });
                                                }}
                                            />
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
                                                {test.title}
                                            </span>
                                        </label>
                                    ))}
                                    {availableTests.length === 0 && (
                                        <p className="text-sm text-gray-500 italic col-span-full py-2">Testlar topilmadi</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/admin/employees')}
                            type="button"
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            isLoading={isLoading}
                            icon={<Save size={20} />}
                        >
                            {isEdit ? t('common.save') : t('common.add')}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Success Modal */}
            <Modal
                isOpen={showSuccessModal}
                onClose={() => navigate('/admin/employees')}
                title="Xodim muvaffaqiyatli qo'shildi!"
                size="sm"
            >
                <div className="space-y-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 size={40} />
                        </div>
                        <p className="text-gray-600">
                            Xodim profile yaratildi. Quyidagi login ma'lumotlarini xodimga yetkazing:
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email (Login):</label>
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                                <span className="font-medium text-gray-900">{credentials?.email}</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Foydalanuvchi nomi:</label>
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                                <span className="font-medium text-gray-900">{credentials?.username}</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Boshlang'ich parol:</label>
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                                <span className="font-mono font-bold text-primary-600 text-lg">{credentials?.password}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button
                            variant="primary"
                            icon={isCopied ? <Check size={20} /> : <Copy size={20} />}
                            onClick={() => {
                                const text = `HR Tizimi Login Ma'lumotlari:\nEmail: ${credentials?.email}\nUsername: ${credentials?.username}\nParol: ${credentials?.password}`;
                                navigator.clipboard.writeText(text);
                                setIsCopied(true);
                                setTimeout(() => setIsCopied(false), 2000);
                                toast.success('Nusxalandi!');
                            }}
                            className="w-full h-12"
                        >
                            {isCopied ? 'Nusxalandi' : 'Ma\'lumotlarni nusxalash'}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/admin/employees')}
                            className="w-full h-12"
                        >
                            Xodimlar ro'yxatiga qaytish
                        </Button>
                    </div>
                </div>
            </Modal>
        </Layout>
    )
}
