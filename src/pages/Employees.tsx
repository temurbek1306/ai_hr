import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { Search, Plus, Grid3x3, List, Mail, Phone, Briefcase, Loader2, FileDown, FileUp, ClipboardList, Video } from 'lucide-react'
import Layout from '../components/Layout'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import { employeeService } from '../services/employee.service'
import { Employee } from '../types/types'
import AssignmentModal from '../components/AssignmentModal'

type ViewMode = 'grid' | 'table'

export default function Employees() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const [searchQuery, setSearchQuery] = useState('')
    const [departmentFilter, setDepartmentFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [employees, setEmployees] = useState<Employee[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false)

    const fetchEmployees = async () => {
        try {
            setIsLoading(true)
            const data = await employeeService.getAll()
            console.log('📊 Fetched employees:', data)
            console.log('📊 Employee count:', data?.length || 0)
            setEmployees(data as any || [])
        } catch (error) {
            console.error('❌ Failed to fetch employees:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchEmployees()
    }, [location.pathname]) // Refetch when pathname changes (e.g., returning from /new)

    // Filter employees
    const filteredEmployees = useMemo(() => {
        console.log('🔍 Filtering employees. Total:', employees.length)
        return employees.filter(emp => {
            const matchesSearch =
                emp.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.position?.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter
            const matchesStatus = statusFilter === 'all' || emp.status === statusFilter

            return matchesSearch && matchesDepartment && matchesStatus
        })
    }, [employees, searchQuery, departmentFilter, statusFilter])

    const getStatusBadge = (status: Employee['status']) => {
        const styles = {
            active: 'bg-green-100 text-green-700 border-green-300',
            inactive: 'bg-red-100 text-red-700 border-red-300',
            'on-leave': 'bg-yellow-100 text-yellow-700 border-yellow-300'
        }

        // Using direct translation map might be cleaner if keys match status
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.inactive}`}>
                {status === 'active' ? t('filters.statuses.active') :
                    status === 'inactive' ? t('filters.statuses.inactive') :
                        t('filters.statuses.onLeave') || 'Ta\'tilda'}
            </span>
        )
    }

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImportClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
            toast.error(t('common.error') || 'Iltimos, .csv yoki .xlsx fayl yuklang')
            return
        }

        try {
            await employeeService.importEmployees(file)
            toast.success(t('common.success') || 'Muvaffaqiyatli import qilindi!')
            // Refresh list
            await fetchEmployees()
        } catch (error: any) {
            console.error('Import failed:', error)
            const errorMsg = error.response?.data?.message || error.message || t('common.unknownError') || 'Noma\'lum xatolik'
            toast.error(`${t('common.importError') || 'Import xatoligi'}: ${errorMsg}`)
        } finally {
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleExport = async () => {
        try {
            const blob = await employeeService.exportEmployees()
            const url = window.URL.createObjectURL(new Blob([blob]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`) // Assuming CSV
            document.body.appendChild(link)
            link.click()
            link.parentNode?.removeChild(link)
        } catch (error) {
            console.error('Export failed:', error)
            toast.error('Eksport qilishda xatolik yuz berdi')
        }
    }

    return (
        <Layout>
            <div className="p-4 space-y-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".csv,.xlsx"
                    onChange={handleFileChange}
                />
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-gray-900">{t('employees.title')}</h1>
                        <p className="text-gray-600 mt-0.5 text-sm">{t('employees.subtitle', { count: filteredEmployees.length })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            icon={<FileUp size={20} />}
                            onClick={handleImportClick}
                        >
                            {t('common.import')}
                        </Button>
                        <Button
                            variant="secondary"
                            icon={<FileDown size={20} />}
                            onClick={handleExport}
                        >
                            {t('common.export')}
                        </Button>
                        <Button
                            variant="secondary"
                            icon={<ClipboardList size={20} />}
                            onClick={() => setIsAssignmentModalOpen(true)}
                        >
                            {t('employees.assign')}
                        </Button>
                        <Button
                            icon={<Plus size={20} />}
                            onClick={() => navigate('/admin/employees/new')}
                        >
                            {t('employees.add')}
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <Input
                            placeholder="Qidirish (ism, email, lavozim)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            icon={<Search size={20} />}
                        />
                    </div>
                    <Select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        options={[
                            { value: 'all', label: 'Barcha bo\'limlar' },
                            { value: 'IT', label: 'IT' },
                            { value: 'HR', label: 'HR' },
                            { value: 'Marketing', label: 'Marketing' },
                            { value: 'Sales', label: 'Savdo' },
                            { value: 'Finance', label: 'Moliya' },
                            { value: 'Operations', label: 'Operatsiya' }
                        ]}
                    />
                    <div className="flex gap-2">
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={[
                                { value: 'all', label: 'Barcha statuslar' },
                                { value: 'active', label: 'Faol' },
                                { value: 'inactive', label: 'Nofaol' },
                                { value: 'on-leave', label: 'Ta\'tilda' }
                            ]}
                            className="flex-1"
                        />
                        <div className="flex gap-1 bg-dark-800/50 border border-dark-700/50 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                                    ? 'bg-primary-500 text-white'
                                    : 'text-dark-400 hover:text-dark-100'
                                    }`}
                            >
                                <Grid3x3 size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'table'
                                    ? 'bg-primary-500 text-white'
                                    : 'text-dark-400 hover:text-dark-100'
                                    }`}
                            >
                                <List size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Employees List */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">{t('common.loading')}</p>
                    </div>
                ) : filteredEmployees.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                    >
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-400" size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">{t('employees.empty.title')}</h3>
                        <p className="text-gray-500">{t('employees.empty.desc')}</p>
                    </motion.div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredEmployees.map((employee, index) => (
                            <motion.div
                                key={employee.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -4 }}
                                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-primary-500 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <img
                                        src={employee.avatar || `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=6366f1&color=fff`}
                                        alt={`${employee.firstName} ${employee.lastName}`}
                                        className="w-16 h-16 rounded-xl object-cover ring-2 ring-gray-200 group-hover:ring-primary-500 transition-all"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {employee.firstName} {employee.lastName}
                                            </h3>
                                            {(employee as any).videoUrl && (
                                                <Video size={16} className="text-primary-500 shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2 truncate">{employee.position}</p>
                                        {getStatusBadge(employee.status)}
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Briefcase size={16} />
                                        <span>{employee.department}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
                                        <Mail size={16} />
                                        <span className="truncate">{employee.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone size={16} />
                                        <span>{employee.phone}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            navigate(`/admin/employees/${employee.id}/edit`)
                                        }}
                                        className="flex-1 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                    >
                                        {t('common.edit') || 'Tahrirlash'}
                                    </button>
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation()
                                            if (confirm(`${employee.firstName} ${employee.lastName} ni o'chirmoqchimisiz?`)) {
                                                try {
                                                    await employeeService.delete(employee.id)
                                                    await fetchEmployees()
                                                    toast.success(t('common.deleted'))
                                                } catch (error: any) {
                                                    console.error('❌ Delete failed:', error)
                                                    const errorMsg = error.response?.data?.message || error.message || 'Noma\'lum xatolik'
                                                    toast.error(`O'chirishda xatolik: ${errorMsg}`)
                                                }
                                            }
                                        }}
                                        className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        {t('common.delete') || 'O\'chirish'}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">{t('employees.table.employee')}</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">{t('employees.table.position')}</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">{t('employees.table.department')}</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">{t('employees.table.email')}</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">{t('employees.table.phone')}</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">{t('employees.table.status')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredEmployees.map((employee, index) => (
                                        <motion.tr
                                            key={employee.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() => navigate(`/admin/employees/${employee.id}/edit`)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={employee.avatar || `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=6366f1&color=fff`}
                                                        alt={`${employee.firstName} ${employee.lastName}`}
                                                        className="w-10 h-10 rounded-lg object-cover"
                                                    />
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {employee.firstName} {employee.lastName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">{employee.position}</td>
                                            <td className="px-6 py-4 text-gray-700">{employee.department}</td>
                                            <td className="px-6 py-4 text-gray-700">{employee.email}</td>
                                            <td className="px-6 py-4 text-gray-700">{employee.phone}</td>
                                            <td className="px-6 py-4">{getStatusBadge(employee.status)}</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            <AssignmentModal
                isOpen={isAssignmentModalOpen}
                onClose={() => setIsAssignmentModalOpen(false)}
            />
        </Layout>
    )
}
