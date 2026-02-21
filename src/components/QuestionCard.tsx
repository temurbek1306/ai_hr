import { motion } from 'framer-motion'
import { useState } from 'react'

interface QuestionCardProps {
    questionNumber: number
    totalQuestions: number
    questionText: string
    options: { id: string; text: string }[]
    selectedOptionId?: string
    onAnswerSelect: (optionId: string) => void
    isReview?: boolean
    correctOptionId?: string
}

export default function QuestionCard({
    questionNumber,
    totalQuestions,
    questionText,
    options,
    selectedOptionId,
    onAnswerSelect,
    isReview = false,
    correctOptionId
}: QuestionCardProps) {
    const [hoveredOptionId, setHoveredOptionId] = useState<string | null>(null)


    const getOptionStyle = (optionId: string) => {
        if (isReview) {
            if (optionId === correctOptionId) {
                return 'border-green-500 bg-green-50 text-green-900'
            }
            if (optionId === selectedOptionId && optionId !== correctOptionId) {
                return 'border-red-500 bg-red-50 text-red-900'
            }

        }

        if (optionId === selectedOptionId) {
            return 'border-primary-500 bg-primary-50 text-primary-900 ring-2 ring-primary-200'
        }

        if (hoveredOptionId === optionId) {
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
                        key={`${option.id}-${index}`}

                        whileHover={{ scale: isReview ? 1 : 1.01 }}
                        whileTap={{ scale: isReview ? 1 : 0.99 }}
                        onClick={() => !isReview && onAnswerSelect(option.id)}
                        onMouseEnter={() => setHoveredOptionId(option.id)}
                        onMouseLeave={() => setHoveredOptionId(null)}
                        disabled={isReview}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${getOptionStyle(option.id)} ${isReview ? 'cursor-default' : 'cursor-pointer'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${option.id === selectedOptionId
                                ? isReview && option.id !== correctOptionId
                                    ? 'border-red-500 bg-red-500'
                                    : 'border-primary-500 bg-primary-500'
                                : isReview && option.id === correctOptionId
                                    ? 'border-green-500 bg-green-500'
                                    : 'border-gray-300'
                                }`}>
                                {option.id === selectedOptionId && (
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                )}
                                {isReview && option.id === correctOptionId && option.id !== selectedOptionId && (
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                )}
                            </div>
                            <span className="font-medium">{option.text}</span>
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Review Feedback */}
            {isReview && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 p-4 rounded-lg ${selectedOptionId === correctOptionId
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                        }`}
                >
                    <p className={`font-semibold ${selectedOptionId === correctOptionId ? 'text-green-900' : 'text-red-900'
                        }`}>
                        {selectedOptionId === correctOptionId
                            ? '✓ To\'g\'ri javob!'
                            : `✗ Noto'g'ri. To'g'ri javob: ${correctOptionId}`
                        }
                    </p>

                </motion.div>
            )}
        </motion.div>
    )
}
