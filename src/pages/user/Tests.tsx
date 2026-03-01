import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2, Sparkles, ArrowLeft } from 'lucide-react'
import Layout from '../../components/Layout'
import TestCard from '../../components/TestCard'
import { testService } from '../../services/test.service'
import { profileService } from '../../services/profile.service'
import { employeeService } from '../../services/employee.service'
import type { TestDTO, AssignmentDto } from '../../types/api.types'

export default function Tests() {
    const navigate = useNavigate()
    const [tests, setTests] = useState<TestDTO[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Fetch data in parallel
                const [availableTestsRes, profile] = await Promise.all([
                    testService.getAvailableTests(),
                    profileService.getProfile()
                ]);

                // Fetch assignments if we have a profile
                let testList = availableTestsRes.body || [];

                if (profile?.id) {
                    try {
                        const assignments: AssignmentDto[] = await employeeService.getAssignments(profile.id);
                        const assignedTestIds = assignments
                            ?.filter(a => a.assignmentType === 'TEST')
                            .map(a => a.referenceId) || [];

                        // Log assigned IDs but don't strictly filter for now as requested
                        console.log('User assignments:', assignedTestIds);

                        // We can mark them as assigned in the UI later, but for now show all
                        // testList = testList.filter(t => assignedTestIds.includes(t.id));
                    } catch (e) {
                        console.error('Failed to fetch assignments:', e);
                        // Fallback: show all if we can't get assignments
                    }
                }



                if (!testList) {
                    console.warn('API returned empty body for tests');
                    setTests([]);
                    return;
                }

                if (!Array.isArray(testList)) {
                    console.warn('API returned non-array tests:', testList);
                    // Check if it's a paginated response with .content
                    if (testList && typeof testList === 'object' && Array.isArray((testList as any).content)) {
                        testList = (testList as any).content;
                    } else {
                        testList = [];
                    }
                }

                setTests(testList || []);
            } catch (error: any) {
                console.error('Failed to fetch tests data:', error);
                setError('Ma\'lumotlarni yuklashda xatolik yuz berdi.');
                setTests([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleStartTest = (testId: string) => {
        navigate(`/user/tests/${testId}/take`)
    }

    return (
        <Layout role="user">
            <div className="p-4 space-y-6">
                <header className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/user/dashboard')}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Testlar</h1>
                        <p className="text-gray-600">Bilim darajangizni oshirish uchun mavjud testlarni topshiring.</p>
                    </div>
                </header>

                {error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                        <p className="font-medium text-sm">{error}</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium font-display">Testlar yuklanmoqda...</p>
                    </div>
                ) : (
                    <>
                        {tests.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tests.map((test) => (
                                    <TestCard
                                        key={test.id}
                                        test={test}
                                        status="not_started"
                                        onStart={() => handleStartTest(test.id)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20 card bg-gray-50 border-dashed"
                            >
                                <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-display font-semibold text-gray-600">Hozircha testlar mavjud emas</h3>
                                <p className="text-gray-500">Yaqin orada yangi testlar qo'shiladi.</p>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    )
}
