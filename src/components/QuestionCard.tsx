import { motion } from 'framer-motion'
import { useState } from 'react'

interface QuestionCardProps {
    questionNumber: number
    totalQuestions: number
    questionText: string
    options: string[]
    selectedAnswer?: string
    onAnswerSelect: (answer: string) => void
    isReview?: boolean
    correctAnswer?: string
}

export default function QuestionCard({
    questionNumber,
    totalQuestions,
    questionText,
    options,
    selectedAnswer,
    onAnswerSelect,
    isReview = false,
    correctAnswer
}: QuestionCardProps) {
    const [hoveredOption, setHoveredOption] = useState<string | null>(null)

    const getOptionStyle = (option: string) => {
        if (isReview) {
            if (option === correctAnswer) {
                return 'border-green-500 bg-green-50 text-green-900'
            }
            if (option === selectedAnswer && option !== correctAnswer) {
                return 'border-red-500 bg-red-50 text-red-900'
            }
        }

        if (option === selectedAnswer) {
            return 'border-primary-500 bg-primary-50 text-primary-900 ring-2 ring-primary-200'
        }

        if (hoveredOption === option) {
            return 'border-primary-300 bg-primary-25'
        }

        return 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card p-8 max-w-3xl mx-auto"
        >
            {/* Question Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-primary-600">
                        Savol {questionNumber} / {totalQuestions}
                    </span>
                    <div className="h-1 flex-1 mx-4 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <span className="text-sm text-gray-500">
                        {Math.round((questionNumber / totalQuestions) * 100)}%
                    </span>
                </div>

                <h2 className="text-2xl font-display font-bold text-gray-900">
                    {questionText}
                </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
                {options.map((option, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ scale: isReview ? 1 : 1.01 }}
                        whileTap={{ scale: isReview ? 1 : 0.99 }}
                        onClick={() => !isReview && onAnswerSelect(option)}
                        onMouseEnter={() => setHoveredOption(option)}
                        onMouseLeave={() => setHoveredOption(null)}
                        disabled={isReview}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${getOptionStyle(option)} ${isReview ? 'cursor-default' : 'cursor-pointer'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${option === selectedAnswer
                                    ? isReview && option !== correctAnswer
                                        ? 'border-red-500 bg-red-500'
                                        : 'border-primary-500 bg-primary-500'
                                    : isReview && option === correctAnswer
                                        ? 'border-green-500 bg-green-500'
                                        : 'border-gray-300'
                                }`}>
                                {option === selectedAnswer && (
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                )}
                                {isReview && option === correctAnswer && option !== selectedAnswer && (
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                )}
                            </div>
                            <span className="font-medium">{option}</span>
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Review Feedback */}
            {isReview && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 p-4 rounded-lg ${selectedAnswer === correctAnswer
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                        }`}
                >
                    <p className={`font-semibold ${selectedAnswer === correctAnswer ? 'text-green-900' : 'text-red-900'
                        }`}>
                        {selectedAnswer === correctAnswer
                            ? '✓ To\'g\'ri javob!'
                            : `✗ Noto'g'ri. To'g'ri javob: ${correctAnswer}`
                        }
                    </p>
                </motion.div>
            )}
        </motion.div>
    )
}
