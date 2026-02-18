import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Save, Trash2, CheckCircle2, Circle, Square, CheckSquare } from 'lucide-react'
import Layout from '../../components/Layout'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Select from '../../components/Select'
import { testService, TestCreateDto, TestQuestionCreateDto } from '../../services/test.service'

type QuestionType = 'single' | 'multiple' | 'text'

interface Option {
    id: string
    text: string
    isCorrect: boolean
}

interface Question {
    id: string
    text: string
    type: QuestionType
    options: Option[]
    points: number
}

export default function TestBuilder() {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [testType, setTestType] = useState<'PRE' | 'POST' | 'QUALIFICATION' | 'GENERAL'>('GENERAL')
    const [passingScore, setPassingScore] = useState('70')
    const [questions, setQuestions] = useState<Question[]>([])
    const [isSaving, setIsSaving] = useState(false)

    // Question Editor State
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)
    const [currentQuestion, setCurrentQuestion] = useState<Question>({
        id: '',
        text: '',
        type: 'single',
        options: [
            { id: '1', text: '', isCorrect: false },
            { id: '2', text: '', isCorrect: false }
        ],
        points: 10
    })

    const handleAddQuestion = () => {
        const newQuestion: Question = {
            id: Date.now().toString(),
            text: '',
            type: 'single',
            options: [
                { id: Date.now().toString() + '1', text: '', isCorrect: false },
                { id: Date.now().toString() + '2', text: '', isCorrect: false }
            ],
            points: 10
        }
        setCurrentQuestion(newQuestion)
        setEditingQuestionId(newQuestion.id)
    }

    const handleSaveQuestion = () => {
        if (!currentQuestion.text) return alert('Savol matnini kiriting')

        if (editingQuestionId && questions.find(q => q.id === editingQuestionId)) {
            setQuestions(questions.map(q => q.id === editingQuestionId ? currentQuestion : q))
        } else {
            setQuestions([...questions, currentQuestion])
        }
        setEditingQuestionId(null)
    }

    const handleDeleteQuestion = (id: string) => {
        if (confirm('Ushbu savolni o\'chirmoqchimisiz?')) {
            setQuestions(questions.filter(q => q.id !== id))
        }
    }

    const handleSaveTest = async () => {
        if (!title) return alert('Test nomini kiriting')
        if (questions.length === 0) return alert('Kamida bitta savol qo\'shing')

        setIsSaving(true)
        try {
            // Convert questions to API format
            const apiQuestions: TestQuestionCreateDto[] = questions.map(q => ({
                questionText: q.text,
                options: q.options.map(opt => opt.text),
                correctAnswer: q.options.find(opt => opt.isCorrect)?.text || q.options[0].text
            }))

            const testData: TestCreateDto = {
                title,
                type: testType,
                passScore: parseInt(passingScore),
                questions: apiQuestions
            }

            await testService.createTest(testData)
            alert('Test muvaffaqiyatli saqlandi!')
            navigate('/admin/testing')
        } catch (error: any) {
            console.error('Test saqlashda xatolik:', error)
            alert('Xatolik yuz berdi: ' + (error.response?.data?.message || error.message))
        } finally {
            setIsSaving(false)
        }
    }

    const updateOption = (idx: number, field: keyof Option, value: any) => {
        const newOptions = [...currentQuestion.options]
        newOptions[idx] = { ...newOptions[idx], [field]: value }
        setCurrentQuestion({ ...currentQuestion, options: newOptions })
    }

    const addOption = () => {
        setCurrentQuestion({
            ...currentQuestion,
            options: [...currentQuestion.options, { id: Date.now().toString(), text: '', isCorrect: false }]
        })
    }

    const removeOption = (idx: number) => {
        if (currentQuestion.options.length <= 2) return
        const newOptions = currentQuestion.options.filter((_, i) => i !== idx)
        setCurrentQuestion({ ...currentQuestion, options: newOptions })
    }

    return (
        <Layout>
            <div className="max-w-5xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/testing')}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-display font-bold text-gray-900">Yangi Test Yaratish</h1>
                            <p className="text-gray-500 text-sm">Xodimlar uchun yangi sinov testi tuzish</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={() => navigate('/admin/testing')} disabled={isSaving}>Bekor qilish</Button>
                        <Button icon={<Save size={20} />} onClick={handleSaveTest} disabled={isSaving}>
                            {isSaving ? 'Saqlanmoqda...' : 'Saqlash'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Test Settings */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="card bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Asosiy Ma'lumotlar</h3>
                            <Input
                                label="Test Nomi"
                                placeholder="Masalan: Menedjment asoslari"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tavsif</label>
                                <textarea
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none h-24"
                                    placeholder="Test haqida qisqacha..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Select
                                    label="Test turi"
                                    value={testType}
                                    onChange={(e) => setTestType(e.target.value as any)}
                                    options={[
                                        { value: 'PRE', label: 'Pre-test' },
                                        { value: 'POST', label: 'Post-test' },
                                        { value: 'QUALIFICATION', label: 'Malaka' },
                                        { value: 'GENERAL', label: 'Umumiy' }
                                    ]}
                                />
                                <Input
                                    label="O'tish bali (%)"
                                    type="number"
                                    value={passingScore}
                                    onChange={(e) => setPassingScore(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Questions Builder */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Question List */}
                        <div className="card bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-lg text-gray-900">Savollar ({questions.length})</h3>
                                <Button size="sm" icon={<Plus size={16} />} onClick={handleAddQuestion}>
                                    Savol qo'shish
                                </Button>
                            </div>

                            {questions.length === 0 && !editingQuestionId ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <p className="text-gray-500">Hozircha savollar yo'q</p>
                                    <button
                                        onClick={handleAddQuestion}
                                        className="text-primary-600 font-medium hover:underline mt-2"
                                    >
                                        Birinchi savolni qo'shing
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {questions.map((q, idx) => (
                                        <div key={q.id} className="p-4 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors bg-white group">
                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-3">
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-medium">
                                                        {idx + 1}
                                                    </span>
                                                    <div>
                                                        <p className="font-medium text-gray-900 line-clamp-2">{q.text}</p>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {q.type === 'single' ? 'Bitta to\'g\'ri javob' : q.type === 'multiple' ? 'Ko\'p tanlovli' : 'Yozma javob'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            setCurrentQuestion(q)
                                                            setEditingQuestionId(q.id)
                                                        }}
                                                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                                                    >
                                                        Tahrirlash
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteQuestion(q.id)}
                                                        className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Question Editor */}
                        {editingQuestionId && (
                            <div className="card bg-white p-6 rounded-2xl border border-primary-200 shadow-lg ring-4 ring-primary-50">
                                <h3 className="font-semibold text-lg text-gray-900 mb-4">
                                    {questions.find(q => q.id === editingQuestionId) ? 'Savolni Tahrirlash' : 'Yangi Savol'}
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <textarea
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none h-24 text-lg"
                                            placeholder="Savol matnini kiriting..."
                                            value={currentQuestion.text}
                                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                                            autoFocus
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-1/2">
                                            <Select
                                                label="Savol turi"
                                                value={currentQuestion.type}
                                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, type: e.target.value as QuestionType })}
                                                options={[
                                                    { value: 'single', label: 'Bitta to\'g\'ri javob' },
                                                    { value: 'multiple', label: 'Bir nechta to\'g\'ri javob' },
                                                    { value: 'text', label: 'Yozma javob' }
                                                ]}
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <Input
                                                label="Ball"
                                                type="number"
                                                value={currentQuestion.points}
                                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                    </div>

                                    {currentQuestion.type !== 'text' && (
                                        <div className="space-y-3 pt-2">
                                            <label className="block text-sm font-medium text-gray-700">Javob variantlari</label>
                                            {currentQuestion.options.map((opt, idx) => (
                                                <div key={opt.id} className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => updateOption(idx, 'isCorrect', !opt.isCorrect)}
                                                        className={`flex-shrink-0 p-1 rounded transition-colors ${opt.isCorrect ? 'text-green-600' : 'text-gray-300 hover:text-gray-400'}`}
                                                    >
                                                        {currentQuestion.type === 'single' ? (
                                                            opt.isCorrect ? <CheckCircle2 size={24} /> : <Circle size={24} />
                                                        ) : (
                                                            opt.isCorrect ? <CheckSquare size={24} /> : <Square size={24} />
                                                        )}
                                                    </button>
                                                    <div className="flex-1">
                                                        <Input
                                                            placeholder={`Variant ${idx + 1}`}
                                                            value={opt.text}
                                                            onChange={(e) => updateOption(idx, 'text', e.target.value)}
                                                            className="mb-0"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => removeOption(idx)}
                                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                        disabled={currentQuestion.options.length <= 2}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={addOption}
                                                className="text-primary-600 text-sm font-medium hover:underline flex items-center gap-1 pl-9"
                                            >
                                                <Plus size={16} />
                                                Variant qo'shish
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                        <Button variant="secondary" onClick={() => setEditingQuestionId(null)}>Bekor qilish</Button>
                                        <Button onClick={handleSaveQuestion}>Saqlash</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}
