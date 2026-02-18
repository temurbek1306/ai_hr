import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Check } from 'lucide-react'
import Button from './Button'
import Select from './Select'
import { employeeService } from '../services/employee.service'
import { assignmentService, AssignmentCreateDto } from '../services/assignment.service'
import { testService } from '../services/test.service'
import { surveyService } from '../services/survey.service'
import { knowledgeService } from '../services/knowledge.service'
import { Employee } from '../types/types'

interface AssignmentModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function AssignmentModal({ isOpen, onClose }: AssignmentModalProps) {
    const { t } = useTranslation()
    const [selectedType, setSelectedType] = useState('test')
    const [selectedMaterial, setSelectedMaterial] = useState('')
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
    const [deadline, setDeadline] = useState('')
    const [employees, setEmployees] = useState<Employee[]>([])
    const [fetchedMaterials, setFetchedMaterials] = useState<any>({
        test: [],
        survey: [],
        knowledge: []
    })
    const [isFetchingMaterials, setIsFetchingMaterials] = useState(false)

    useEffect(() => {
        if (isOpen) {
            employeeService.getAll().then(data => setEmployees(data as any || []))

            // Fetch all materials
            setIsFetchingMaterials(true)
            Promise.all([
                testService.getAll(), // Use getAll instead of availableTests for admin
                surveyService.getAll(),
                knowledgeService.getArticles()
            ]).then(([tests, surveys, articles]) => {
                // Handle both raw arrays and ApiResponse wrappers
                const testsData = (tests as any)?.body || tests
                const surveysData = (surveys as any)?.body || surveys
                const articlesData = (articles as any)?.body || (articles as any)?.data || articles

                setFetchedMaterials({
                    test: Array.isArray(testsData)
                        ? testsData
                            .filter((t: any) => (t.title || t.name) !== 'string')
                            .map((t: any) => ({ value: t.id, label: t.title || t.name || 'Noma\'lum test' }))
                        : [],
                    survey: Array.isArray(surveysData)
                        ? surveysData
                            .filter((s: any) => (s.title || s.name) !== 'string')
                            .map((s: any) => ({ value: s.id, label: s.title || s.name || 'Noma\'lum so\'rovnoma' }))
                        : [],
                    knowledge: Array.isArray(articlesData)
                        ? articlesData
                            .filter((a: any) => (a.title || a.name) !== 'string')
                            .map((a: any) => ({ value: a.id, label: (a as any).title || (a as any).name || 'Noma\'lum material' }))
                        : []
                })
            }).catch(err => {
                console.error('Failed to fetch materials:', err)
            }).finally(() => {
                setIsFetchingMaterials(false)
            })
        } else {
            // Reset state
            setSelectedType('test')
            setSelectedMaterial('')
            setSelectedEmployees([])
            setDeadline('')
        }
    }, [isOpen])

    if (!isOpen) return null

    const materials = fetchedMaterials

    const handleAssign = async () => {
        if (!selectedMaterial) return alert('Materialni tanlang')
        if (selectedEmployees.length === 0) return alert('Kamida bitta xodimni tanlang')

        try {
            // Create assignments for each selected employee
            const assignmentType = selectedType === 'test' ? 'TEST' :
                selectedType === 'survey' ? 'SURVEY' : 'MATERIAL'

            const assignmentData: AssignmentCreateDto = {
                assignmentType: assignmentType as 'TEST' | 'SURVEY' | 'MATERIAL',
                referenceId: selectedMaterial
            }

            // Create assignment for each employee
            await Promise.all(
                selectedEmployees.map(employeeId =>
                    assignmentService.createAssignment(employeeId, assignmentData)
                )
            )

            alert('Muvaffaqiyatli biriktirildi!')
            onClose()
        } catch (error: any) {
            console.error('Assignment creation error:', error)
            alert('Xatolik yuz berdi: ' + (error.response?.data?.message || error.message))
        }
    }

    const toggleEmployee = (id: string) => {
        if (selectedEmployees.includes(id)) {
            setSelectedEmployees(selectedEmployees.filter(e => e !== id))
        } else {
            setSelectedEmployees([...selectedEmployees, id])
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-semibold text-lg text-gray-900">Yangi Biriktirish</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {/* Step 1: Material Selection */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center">1</span>
                            Nima biriktirmoqchisiz?
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => { setSelectedType('test'); setSelectedMaterial('') }}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${selectedType === 'test' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-primary-200'}`}
                            >
                                Test
                            </button>
                            <button
                                onClick={() => { setSelectedType('survey'); setSelectedMaterial('') }}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${selectedType === 'survey' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-primary-200'}`}
                            >
                                So'rovnoma
                            </button>
                            <button
                                onClick={() => { setSelectedType('knowledge'); setSelectedMaterial('') }}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${selectedType === 'knowledge' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-primary-200'}`}
                            >
                                Maqola/Material
                            </button>
                        </div>

                        <Select
                            label={isFetchingMaterials ? "Yuklanmoqda..." : "Materialni tanlang"}
                            options={materials[selectedType as keyof typeof materials]}
                            value={selectedMaterial}
                            onChange={(e) => setSelectedMaterial(e.target.value)}
                            disabled={isFetchingMaterials}
                        />
                    </div>

                    <div className="border-t border-gray-100 my-4"></div>

                    {/* Step 2: Employee Selection */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center">2</span>
                                Kimga biriktiriladi?
                            </h4>
                            <span className="text-sm text-gray-500">{selectedEmployees.length} ta tanlandi</span>
                        </div>

                        <div className="border border-gray-200 rounded-xl max-h-48 overflow-y-auto">
                            {employees.length === 0 ? (
                                <div className="p-4 text-center text-gray-500 text-sm">Xodimlar yuklanmoqda...</div>
                            ) : (
                                employees
                                    .filter(emp => (emp as any).firstName || (emp as any).lastName || (emp as any).email)
                                    .map(emp => (
                                        <div
                                            key={emp.id}
                                            onClick={() => toggleEmployee(emp.id)}
                                            className={`flex items-center justify-between p-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors ${selectedEmployees.includes(emp.id) ? 'bg-primary-50 hover:bg-primary-100' : ''}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                    {emp.firstName ? emp.firstName.charAt(0) : '?'}
                                                    {emp.lastName ? emp.lastName.charAt(0) : ''}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {(emp as any).firstName || (emp as any).lastName
                                                            ? `${(emp as any).firstName || ''} ${(emp as any).lastName || ''}`.trim()
                                                            : (emp as any).email || (emp as any).username || `ID: ${emp.id.substring(0, 8)}...`}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{emp.position || t('roles.employee') || 'Xodim'}</p>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${selectedEmployees.includes(emp.id) ? 'bg-primary-500 border-primary-500 text-white' : 'border-gray-300'}`}>
                                                {selectedEmployees.includes(emp.id) && <Check size={14} />}
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>

                    {/* Step 3: Deadline */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center">3</span>
                            Muddati
                        </h4>
                        <input
                            type="date"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>Bekor qilish</Button>
                    <Button onClick={handleAssign}>Biriktirish</Button>
                </div>
            </div>
        </div>
    )
}
