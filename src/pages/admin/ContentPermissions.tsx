import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Globe, Shield } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Layout from '../../components/Layout'
import Button from '../../components/Button'

export default function ContentPermissions() {
    const navigate = useNavigate()

    const [permissions] = useState([
        { id: 1, role: 'Admin', categories: ['Policies', 'Tutorials', 'Onboarding', 'Secret'], accessLevel: 'full' },
        { id: 2, role: 'HR Manager', categories: ['Policies', 'Tutorials', 'Onboarding'], accessLevel: 'edit' },
        { id: 3, role: 'Department Lead', categories: ['Policies', 'Tutorials'], accessLevel: 'view' },
        { id: 4, role: 'Employee', categories: ['Policies', 'Tutorials'], accessLevel: 'view' }
    ])

    const [editingRole, setEditingRole] = useState<any>(null)

    // Mock Permission Modules
    const modules = [
        { id: 'content', name: 'Bilimlar Bazasi' },
        { id: 'users', name: 'Xodimlar' },
        { id: 'surveys', name: 'So\'rovnomalar' },
        { id: 'analytics', name: 'Analitika' }
    ]

    // Mock Actions
    const actions = [
        { id: 'view', name: 'Ko\'rish' },
        { id: 'create', name: 'Yaratish' },
        { id: 'edit', name: 'Tahrirlash' },
        { id: 'delete', name: 'O\'chirish' },
        { id: 'publish', name: 'Chop etish' }
    ]

    const handleEditClick = (role: any) => {
        setEditingRole({ ...role, permissions: role.permissions || {} }) // Ensure permissions object exists
    }

    const handlePermissionChange = (moduleId: string, actionId: string) => {
        if (!editingRole) return
        const currentPerms = editingRole.permissions[moduleId] || []
        const newPerms = currentPerms.includes(actionId)
            ? currentPerms.filter((p: string) => p !== actionId)
            : [...currentPerms, actionId]

        setEditingRole({
            ...editingRole,
            permissions: {
                ...editingRole.permissions,
                [moduleId]: newPerms
            }
        })
    }

    const handleSaveRole = () => {
        // Here we would save to API
        console.log('Saving Role Permissions:', editingRole)
        toast.success('Ruxsatlar muvaffaqiyatli saqlandi!')
        setEditingRole(null)
    }

    return (
        <Layout>
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/content')}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-display font-bold text-gray-900">Ruxsatlar</h1>
                            <p className="text-gray-500 text-sm">Tizim rollari va ruxsatlarini boshqarish</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Shield size={20} className="text-primary-500" />
                            Rolga asoslangan ruxsatlar
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Kim qaysi turdagi maqolalarni ko'rishi mumkinligini belgilang</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-sm font-medium">
                                <tr>
                                    <th className="px-6 py-4">Rol</th>
                                    <th className="px-6 py-4">Ruxsat darajasi</th>
                                    <th className="px-6 py-4">Ochiq kategoriyalar</th>
                                    <th className="px-6 py-4 text-right">Amallar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {permissions.map((perm) => (
                                    <tr key={perm.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{perm.role}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                ${perm.accessLevel === 'full' ? 'bg-purple-100 text-purple-700' :
                                                    perm.accessLevel === 'edit' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {perm.accessLevel === 'full' ? 'To\'liq' : perm.accessLevel === 'edit' ? 'Tahrirlash' : 'Ko\'rish'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-sm">
                                            <div className="flex flex-wrap gap-1">
                                                {perm.categories.map(cat => (
                                                    <span key={cat} className="px-2 py-0.5 bg-gray-100 rounded text-xs border border-gray-200">{cat}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="secondary" size="sm" onClick={() => handleEditClick(perm)}>
                                                O'zgartirish
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Edit Modal */}
                {editingRole && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900">{editingRole.role} ruxsatlarini tahrirlash</h3>
                                <button onClick={() => setEditingRole(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                            </div>

                            <div className="p-6 space-y-6">
                                {modules.map(module => (
                                    <div key={module.id} className="space-y-3">
                                        <h4 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">{module.name}</h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {actions.map(action => {
                                                const isChecked = editingRole.permissions?.[module.id]?.includes(action.id)
                                                return (
                                                    <label key={action.id} className="flex items-center gap-2 cursor-pointer select-none group">
                                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                                                            ${isChecked ? 'bg-primary-500 border-primary-500' : 'border-gray-300 group-hover:border-primary-400'}`}>
                                                            {isChecked && <Shield size={12} className="text-white" />}
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={isChecked || false}
                                                            onChange={() => handlePermissionChange(module.id, action.id)}
                                                        />
                                                        <span className="text-sm text-gray-700">{action.name}</span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                                <Button variant="secondary" onClick={() => setEditingRole(null)}>Bekor qilish</Button>
                                <Button onClick={handleSaveRole}>Saqlash</Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                    <Globe className="text-blue-600 w-5 h-5 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-blue-900 text-sm">Ommaviy ruxsatlar</h4>
                        <p className="text-blue-700 text-sm mt-1">Barcha xodimlar uchun "Policies" va "News" kategoriyalari avtomatik ravishda ochiq.</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
