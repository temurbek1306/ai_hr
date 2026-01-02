import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Plus, Grid3x3, List, Mail, Phone, Briefcase } from 'lucide-react'
import Layout from '../components/Layout'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import { mockEmployees } from '../utils/mockData'
import { Employee } from '../types/types'

type ViewMode = 'grid' | 'table'

export default function Employees() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [departmentFilter, setDepartmentFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [viewMode, setViewMode] = useState<ViewMode>('grid')

    // Filter employees
    const filteredEmployees = useMemo(() => {
        return mockEmployees.filter(emp => {
            const matchesSearch =
                emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.position.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter
            const matchesStatus = statusFilter === 'all' || emp.status === statusFilter

            return matchesSearch && matchesDepartment && matchesStatus
        })
    }, [searchQuery, departmentFilter, statusFilter])

    const getStatusBadge = (status: Employee['status']) => {
        const styles = {
            active: 'bg-green-100 text-green-700 border-green-300',
            inactive: 'bg-red-100 text-red-700 border-red-300',
            'on-leave': 'bg-yellow-100 text-yellow-700 border-yellow-300'
        }
        const labels = {
            active: 'Faol',
            inactive: 'Nofaol',
            'on-leave': 'Ta\'tilda'
        }
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
                {labels[status]}
            </span>
        )
    }

    return (
        <Layout>
            <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-gray-900">Xodimlar</h1>
                        <p className="text-gray-600 mt-0.5 text-sm">{filteredEmployees.length} ta xodim topildi</p>
                    </div>
                    <Button
                        icon={<Plus size={20} />}
                        onClick={() => navigate('/admin/employees/new')}
                    >
                        Yangi Xodim
                    </Button>
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
                {filteredEmployees.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Xodim topilmadi</h3>
                        <p className="text-gray-500">Qidiruv so'rovini o'zgartiring yoki filtrlarni tozalang</p>
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
                                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-primary-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
                                onClick={() => navigate(`/admin/employees/${employee.id}/edit`)}
                            >
                                <div className="flex items-start gap-4">
                                    <img
                                        src={employee.avatar || `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=6366f1&color=fff`}
                                        alt={`${employee.firstName} ${employee.lastName}`}
                                        className="w-16 h-16 rounded-xl object-cover ring-2 ring-gray-200 group-hover:ring-primary-500 transition-all"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                            {employee.firstName} {employee.lastName}
                                        </h3>
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
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Xodim</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Lavozim</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Bo'lim</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Telefon</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
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
        </Layout>
    )
}
