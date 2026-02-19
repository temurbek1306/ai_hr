import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react'
import Layout from '../../components/Layout'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { testService } from '../../services/test.service'



export default function TestCatalog() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [tests, setTests] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchTests = async () => {
            try {
                setIsLoading(true);
                const response = await testService.getAll();
                const fetchedTests = (response as any)?.body || response;
                setTests(Array.isArray(fetchedTests) ? fetchedTests : []);
                setError(null);
            } catch (error: any) {
                console.error('Failed to fetch tests:', error);
                setError('Testlarni yuklashda xatolik yuz berdi.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTests();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Ushbu testni o\'chirmoqchimisiz?')) {
            try {
                await testService.deleteTest(id);
                setTests(tests.filter(t => t.id !== id));
            } catch (error) {
                console.error('Failed to delete test:', error);
                alert('Testni o\'chirishda xatolik yuz berdi');
            }
        }
    };

    return (
        <Layout>
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-gray-900">{t('tests.title')}</h1>
                        <p className="text-gray-500 text-sm">{t('tests.subtitle')}</p>
                    </div>
                    <Button icon={<Plus size={20} />} onClick={() => navigate('/admin/testing/new')}>
                        {t('tests.add')}
                    </Button>
                </div>

                {error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                        <p className="font-medium text-sm">{error}</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Testlar yuklanmoqda...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                            <Input
                                placeholder={t('common.search')}
                                icon={<Search size={20} />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-sm font-medium">
                                    <tr>
                                        <th className="px-6 py-4">{t('tests.table.title')}</th>
                                        <th className="px-6 py-4">{t('tests.table.questionsCount')}</th>
                                        <th className="px-6 py-4">{t('tests.table.duration')}</th>
                                        <th className="px-6 py-4">{t('tests.table.createdAt')}</th>
                                        <th className="px-6 py-4">{t('tests.table.status')}</th>
                                        <th className="px-6 py-4 text-right">{t('common.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {tests.map((test) => (
                                        <tr key={test.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{test.title}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{test.questionsCount} ta</td>
                                            <td className="px-6 py-4 text-gray-600">{test.duration} daqiqa</td>
                                            <td className="px-6 py-4 text-gray-600">{test.createdAt}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${test.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {test.status === 'active' ? t('tests.status.active') : t('tests.status.draft')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => navigate(`/admin/testing/${test.id}/edit`)}
                                                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                        title="Tahrirlash"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(test.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="O'chirish"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {tests.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Testlar topilmadi</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    )
}
