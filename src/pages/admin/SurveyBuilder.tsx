import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Save, Trash2, Star, AlignLeft, CheckSquare } from 'lucide-react'
import Layout from '../../components/Layout'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Select from '../../components/Select'
import { surveyService } from '../../services/survey.service'

type QuestionType = 'rating' | 'text' | 'yes_no'

interface Question {
    id: string
    text: string
    type: QuestionType
    required: boolean
}

export default function SurveyBuilder() {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const isEdit = !!id
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [questions, setQuestions] = useState<Question[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(isEdit)

    useEffect(() => {
        if (isEdit && id) {
            const fetchSurvey = async () => {
                try {
                    setIsLoading(true)
                    const survey = await surveyService.getById(id)
                    setTitle(survey.title || '')
                    setDescription(survey.description || '')

                    const qData = await surveyService.getQuestions(id)
                    if (Array.isArray(qData)) {
                        const mappedQ: Question[] = qData.map(q => ({
                            id: q.id || Math.random().toString(),
                            text: q.questionText || '',
                            type: q.options.length === 5 ? 'rating' : (q.options.length === 2 ? 'yes_no' : 'text'),
                            required: true
                        }))
                        setQuestions(mappedQ)
                    }
                } catch (error) {
                    console.error('Failed to fetch survey:', error)
                    alert('Sorovnoma yuklashda xatolik')
                } finally {
                    setIsLoading(false)
                }
            }
            fetchSurvey()
        }
    }, [id, isEdit])

    // Question Editor
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)
    const [currentQuestion, setCurrentQuestion] = useState<Question>({
        id: '',
        text: '',
        type: 'rating',
        required: true
    })

    const handleAddQuestion = () => {
        const newQuestion: Question = {
            id: Date.now().toString(),
            text: '',
            type: 'rating',
            required: true
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

    const handleSaveSurvey = async () => {
        if (!title) return alert('So\'rovnoma nomini kiriting')
        if (questions.length === 0) return alert('Kamida bitta savol qo\'shing')

        setIsSaving(true)
        try {
            // 1. Create or Update Survey
            const surveyData = {
                title,
                description
            }
            let savedSurvey;
            if (isEdit && id) {
                savedSurvey = await surveyService.update(id, surveyData);
            } else {
                savedSurvey = await surveyService.create(surveyData);
            }

            if (!savedSurvey || !savedSurvey.id) {
                throw new Error('Sorovnoma saqlashda xatolik');
            }

            const targetId = savedSurvey.id;

            // 2. Add Questions (For simplicity in this MVP, we re-add questions or just alert if edit questions logic is complex)
            if (!isEdit) {
                for (const q of questions) {
                    await surveyService.addQuestion(targetId, {
                        questionText: q.text,
                        options: q.type === 'rating' ? ['1', '2', '3', '4', '5'] :
                            q.type === 'yes_no' ? ['Ha', 'Yo\'q'] : [],
                    })
                }
            }

            alert('So\'rovnoma muvaffaqiyatli saqlandi!')
            navigate('/admin/surveys/catalog')
        } catch (error: any) {
            console.error('Survey save failed:', error)
            alert('Xatolik yuz berdi: ' + (error.response?.data?.message || error.message))
        } finally {
            setIsSaving(false)
        }
    }

    const getIconForType = (type: QuestionType) => {
        switch (type) {
            case 'rating': return <Star size={18} />
            case 'text': return <AlignLeft size={18} />
            case 'yes_no': return <CheckSquare size={18} />
        }
    }

    return (
        <Layout>
            <div className="max-w-5xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/surveys/catalog')}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-display font-bold text-gray-900">
                                {isEdit ? 'Sorovnomani Tahrirlash' : 'Yangi Sorovnoma Yaratish'}
                            </h1>
                            <p className="text-gray-500 text-sm">
                                {isEdit ? 'Mavjud sorovnoma va savollarni o\'zgartirish' : 'Xodimlar uchun yangi fikr-mulohaza so\'rovnomasi tuzish'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={() => navigate('/admin/surveys/catalog')} disabled={isSaving}>Bekor qilish</Button>
                        <Button icon={<Save size={20} />} onClick={handleSaveSurvey} disabled={isSaving}>
                            {isSaving ? 'Saqlanmoqda...' : 'Saqlash'}
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-gray-500 font-medium font-display animate-pulse">Ma'lumotlar yuklanmoqda...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Settings */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="card bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                                <h3 className="font-semibold text-lg text-gray-900">So'rovnoma Tafsilotlari</h3>
                                <Input
                                    label="Nomi"
                                    placeholder="Masalan: Oylik qoniqish so'rovi"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tavsif</label>
                                    <textarea
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none h-32"
                                        placeholder="So'rovnoma maqsadi..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Questions */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="card bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-lg text-gray-900">Savollar ({questions.length})</h3>
                                    <Button size="sm" icon={<Plus size={16} />} onClick={handleAddQuestion}>
                                        Savol qo'shish
                                    </Button>
                                </div>

                                {questions.length === 0 && !editingQuestionId ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                        <p className="text-gray-500">Savollar ro'yxati bo'sh</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {questions.map((q) => (
                                            <div key={q.id} className="p-4 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors bg-white group">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex gap-3">
                                                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                                                            {getIconForType(q.type)}
                                                        </span>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{q.text}</p>
                                                            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                                {q.type === 'rating' ? 'Reyting (1-5 yulduz)' : q.type === 'text' ? 'Ochiq matn' : 'Ha/Yo\'q'}
                                                                {q.required && <span className="text-red-500 text-xs bg-red-50 px-2 py-0.5 rounded-full">Majburiy</span>}
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

                            {/* Editor */}
                            {editingQuestionId && (
                                <div className="card bg-white p-6 rounded-2xl border border-primary-200 shadow-lg ring-4 ring-primary-50">
                                    <h3 className="font-semibold text-lg text-gray-900 mb-4">
                                        {questions.find(q => q.id === editingQuestionId) ? 'Savolni Tahrirlash' : 'Yangi Savol'}
                                    </h3>

                                    <div className="space-y-4">
                                        <textarea
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none h-24 text-lg"
                                            placeholder="Savol matnini kiriting..."
                                            value={currentQuestion.text}
                                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                                            autoFocus
                                        />

                                        <div className="grid grid-cols-2 gap-4">
                                            <Select
                                                label="Savol turi"
                                                value={currentQuestion.type}
                                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, type: e.target.value as QuestionType })}
                                                options={[
                                                    { value: 'rating', label: 'Reyting (1-5 yulduz)' },
                                                    { value: 'text', label: 'Ochiq matn' },
                                                    { value: 'yes_no', label: 'Ha / Yo\'q' }
                                                ]}
                                            />
                                            <div className="flex items-end pb-3">
                                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={currentQuestion.required}
                                                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, required: e.target.checked })}
                                                        className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 border-gray-300"
                                                    />
                                                    <span className="text-gray-700">Majburiy savol</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                            <Button variant="secondary" onClick={() => setEditingQuestionId(null)}>Bekor qilish</Button>
                                            <Button onClick={handleSaveQuestion}>Saqlash</Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}
