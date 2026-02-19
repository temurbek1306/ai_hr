import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Award, Download, Calendar, Target, Loader2 } from 'lucide-react'
import Layout from '../../components/Layout'
import { profileService } from '../../services/profile.service'

import type { TestResultItemDto } from '../../types/api.types'

export default function Results() {
    const [results, setResults] = useState<TestResultItemDto[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [stats, setStats] = useState({
        totalTests: 0,
        passedTests: 0,
        averageScore: 0,
        bestScore: 0
    })

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setIsLoading(true);
                const response = await profileService.getTestResults();
                let testResults = response.body;

                // Validate that testResults is actually an array
                if (!Array.isArray(testResults)) {
                    console.warn('API returned non-array results:', testResults);
                    if (testResults && typeof testResults === 'object' && Array.isArray((testResults as any).content)) {
                        // Handle potential paginated response structure
                        testResults = (testResults as any).content;
                    } else {
                        throw new Error('Invalid response format: expected array');
                    }
                }

                setResults(testResults || []);

                // Calculate statistics from real data
                if (Array.isArray(testResults) && testResults.length > 0) {
                    const totalTests = testResults.length;
                    const passedTests = testResults.filter((r: any) => r.passed).length;
                    const scores = testResults.map((r: any) => r.score || 0);
                    const averageScore = scores.reduce((sum: number, s: number) => sum + s, 0) / totalTests;
                    const bestScore = Math.max(...scores);

                    setStats({
                        totalTests,
                        passedTests,
                        averageScore: Math.round(averageScore),
                        bestScore
                    });
                } else {
                    setStats({
                        totalTests: 0,
                        passedTests: 0,
                        averageScore: 0,
                        bestScore: 0
                    });
                }
                setError(null);
            } catch (error: any) {
                console.error('Failed to fetch results:', error);
                setError('Natijalarni yuklashda xatolik yuz berdi. Iltimos, keyinroq urunib ko\'ring.');
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, []);

    const handleExport = async () => {
        try {
            const blob = await profileService.exportTestResults();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `test-results-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Eksport qilishda xatolik yuz berdi');
        }
    };

    return (
        <Layout role="user">
            <div className="p-4 md:p-8 space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Mening Natijalarim</h1>
                        <p className="text-gray-600">Test natijalari va o'zlashtirish ko'rsatkichlari</p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="btn btn-ghost border border-gray-200 flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Export (CSV)
                    </button>
                </header>

                {error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                        <p className="font-medium text-sm">{error}</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Natijalar yuklanmoqda...</p>
                    </div>
                ) : (
                    <>
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="card p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <BarChart3 className="w-6 h-6" />
                                    </div>
                                </div>
                                <p className="text-blue-100 text-sm mb-1">Jami Testlar</p>
                                <p className="text-4xl font-bold">{stats.totalTests}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="card p-6 bg-gradient-to-br from-green-500 to-green-600 text-white"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <Target className="w-6 h-6" />
                                    </div>
                                </div>
                                <p className="text-green-100 text-sm mb-1">O'tilgan Testlar</p>
                                <p className="text-4xl font-bold">{stats.passedTests}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="card p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                </div>
                                <p className="text-purple-100 text-sm mb-1">O'rtacha Ball</p>
                                <p className="text-4xl font-bold">{stats.averageScore}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="card p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <Award className="w-6 h-6" />
                                    </div>
                                </div>
                                <p className="text-orange-100 text-sm mb-1">Eng Yuqori Ball</p>
                                <p className="text-4xl font-bold">{stats.bestScore}</p>
                            </motion.div>
                        </div>

                        {/* Results Table */}
                        <div className="card overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-display font-bold text-gray-900">Test Natijalari</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Test Nomi</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ball</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Holat</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">To'g'ri Javoblar</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sana</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {Array.isArray(results) && results.map((result, index) => (
                                            <motion.tr
                                                key={result.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-gray-900">{result.testTitle || 'Test'}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${result.score >= 80 ? 'bg-green-500' :
                                                                    result.score >= 60 ? 'bg-orange-500' : 'bg-red-500'
                                                                    }`}
                                                                style={{ width: `${result.score}%` }}
                                                            />
                                                        </div>
                                                        <span className="font-bold text-gray-900">{result.score}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {result.passed ? (
                                                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-semibold">
                                                            O'tildi
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold">
                                                            O'tmadi
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-gray-600">
                                                        {result.correctAnswers} / {result.totalQuestions}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Calendar className="w-4 h-4" />
                                                        <span className="text-sm">
                                                            {new Date(result.completedAt).toLocaleDateString('uz-UZ')}
                                                        </span>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    )
}
