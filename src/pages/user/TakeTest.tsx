import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, AlertCircle, Video, ExternalLink } from 'lucide-react'
import Layout from '../../components/Layout'
import QuestionCard from '../../components/QuestionCard'
import Timer from '../../components/Timer'
import { testService, TestDetailDto } from '../../services/test.service'

export default function TakeTest() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [test, setTest] = useState<TestDetailDto | null>(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [results, setResults] = useState<any>(null)
    const [, setSessionId] = useState<string | null>(null)
    const [prepVideoUrl, setPrepVideoUrl] = useState<string | null>(null)

    useEffect(() => {
        const startTest = async () => {
            if (!id) return

            try {
                // Start test session
                const session = await testService.startSession(id, 'me')
                // Handle both direct response and ApiResponse wrapper
                const sessionId = session.body?.sessionId || (session as any).sessionId
                const videoUrl = session.body?.videoUrl || (session as any).videoUrl
                setSessionId(sessionId || null)
                setPrepVideoUrl(videoUrl || null)

                // Fetch test details
                const data = await testService.getById(id)
                setTest(data)
            } catch (error) {
                console.error('Failed to start test:', error)
                alert('Testni boshlashda xatolik yuz berdi')
                navigate('/user/tests')
            } finally {
                setIsLoading(false)
            }
        }

        startTest()
    }, [id, navigate])

    const handleAnswerSelect = (answer: string) => {
        if (!test) return
        const currentQuestion = test.questions[currentQuestionIndex]
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: answer
        }))
    }

    const handleNext = () => {
        if (!test) return
        if (currentQuestionIndex < test.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        }
    }

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1)
        }
    }

    const handleSubmit = async () => {
        if (!test || !id) return

        const unansweredCount = test.questions.length - Object.keys(answers).length
        if (unansweredCount > 0) {
            const confirm = window.confirm(
                `${unansweredCount} ta savolga javob bermagansiz. Testni yakunlamoqchimisiz?`
            )
            if (!confirm) return
        }

        setIsSubmitting(true)

        try {
            const submitData = {
                employeeId: 'me',
                answers: Object.entries(answers).map(([questionId, selectedOptionId]) => ({
                    questionId,
                    selectedOptionId
                }))
            }

            const result = await testService.submitTest(id, submitData)
            setResults(result)
            setShowResults(true)
        } catch (error) {
            console.error('Failed to submit test:', error)
            alert('Testni yuborishda xatolik yuz berdi')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleTimeUp = () => {
        alert('Vaqt tugadi! Test avtomatik yakunlanmoqda...')
        handleSubmit()
    }

    if (isLoading) {
        return (
            <Layout role="user">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Test yuklanmoqda...</p>
                    </div>
                </div>
            </Layout>
        )
    }

    if (!test) {
        return (
            <Layout role="user">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Test topilmadi</h2>
                        <button onClick={() => navigate('/user/tests')} className="btn btn-primary mt-4">
                            Testlar ro'yxatiga qaytish
                        </button>
                    </div>
                </div>
            </Layout>
        )
    }

    if (showResults && results) {
        return (
            <Layout role="user">
                <div className="max-w-3xl mx-auto p-4 md:p-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card p-8 text-center"
                    >
                        <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${results.passed ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                            {results.passed ? (
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            ) : (
                                <XCircle className="w-12 h-12 text-red-600" />
                            )}
                        </div>

                        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                            {results.passed ? 'Tabriklaymiz!' : 'Afsuski...'}
                        </h1>
                        <p className="text-gray-600 mb-8">
                            {results.passed
                                ? 'Siz testdan muvaffaqiyatli o\'tdingiz!'
                                : 'Siz testdan o\'ta olmadingiz. Qayta urinib ko\'ring.'
                            }
                        </p>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="p-6 bg-gray-50 rounded-xl">
                                <p className="text-sm text-gray-600 mb-1">Sizning ballingiz</p>
                                <p className="text-4xl font-bold text-primary-600">{results.score}</p>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-xl">
                                <p className="text-sm text-gray-600 mb-1">To'g'ri javoblar</p>
                                <p className="text-4xl font-bold text-gray-900">
                                    {results.correctAnswers}/{results.totalQuestions}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => navigate('/user/tests')}
                                className="btn btn-ghost"
                            >
                                Testlar ro'yxatiga qaytish
                            </button>
                            {!results.passed && (
                                <button
                                    onClick={() => window.location.reload()}
                                    className="btn btn-primary"
                                >
                                    Qayta topshirish
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </Layout>
        )
    }

    const currentQuestion = test.questions[currentQuestionIndex]
    const isLastQuestion = currentQuestionIndex === test.questions.length - 1
    const answeredCount = Object.keys(answers).length

    return (
        <Layout role="user">
            <div className="max-w-5xl mx-auto p-4 md:p-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-gray-900">{test.title}</h1>
                        <p className="text-sm text-gray-600">
                            {answeredCount} / {test.questions.length} savolga javob berildi
                        </p>
                    </div>
                    <Timer duration={1200} onTimeUp={handleTimeUp} warningThreshold={300} />
                </div>

                {test && (prepVideoUrl || (test as any).videoUrl) && (
                    <div className="mb-6 p-4 bg-primary-50 border border-primary-100 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                                <Video size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Video darslik</h4>
                                <p className="text-sm text-gray-600 truncate">Testni boshlashdan oldin ushbu videoni ko'rish tavsiya etiladi</p>
                            </div>
                        </div>
                        <a
                            href={prepVideoUrl || (test as any).videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary py-2 px-4 text-sm gap-2 shrink-0"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Ko'rish
                        </a>
                    </div>
                )}

                {/* Question */}
                <AnimatePresence mode="wait">
                    <QuestionCard
                        key={currentQuestionIndex}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={test.questions.length}
                        questionText={currentQuestion.questionText}
                        options={currentQuestion.options}
                        selectedAnswer={answers[currentQuestion.id]}
                        onAnswerSelect={handleAnswerSelect}
                    />
                </AnimatePresence>

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className="btn btn-ghost flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Oldingi
                    </button>

                    <div className="flex gap-2">
                        {test.questions.map((_: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setCurrentQuestionIndex(index)}
                                className={`w-10 h-10 rounded-lg font-semibold transition-all ${index === currentQuestionIndex
                                    ? 'bg-primary-500 text-white'
                                    : answers[test.questions[index].id]
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    {isLastQuestion ? (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Yuborilmoqda...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Testni yakunlash
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            Keyingi
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </Layout >
    )
}
