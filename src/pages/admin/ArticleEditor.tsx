import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Eye, Video, Headphones, FileText } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Layout from '../../components/Layout'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Select from '../../components/Select'
import { knowledgeService } from '../../services/knowledge.service'
import { profileService } from '../../services/profile.service'
import { useEffect } from 'react'

export default function ArticleEditor() {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('')
    const [content, setContent] = useState('')
    const [contentType, setContentType] = useState('article')
    const [mediaUrl, setMediaUrl] = useState('')
    const [isPreview, setIsPreview] = useState(false)
    const [authorId, setAuthorId] = useState('admin')

    const [categories, setCategories] = useState<any[]>([
        { value: 'onboarding', label: 'Onboarding' },
        { value: 'policies', label: 'Kompaniya Siyosati' },
        { value: 'tutorials', label: 'Video Qo\'llanmalar' },
        { value: 'faq', label: 'F.A.Q' }
    ])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await knowledgeService.getCategories()
                if (data && data.length > 0) {
                    setCategories(data.map((c: any) => ({ value: c.id, label: c.name })))
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error)
            }
        }

        const fetchProfile = async () => {
            try {
                const response = await profileService.getProfile()
                if (response?.id) {
                    setAuthorId(response.id)
                }
            } catch (error) {
                console.error('Failed to fetch profile for authorId:', error)
            }
        }

        fetchCategories()
        fetchProfile()
    }, [])


    const handleSave = async () => {
        if (!title) return toast.error('Maqola sarlavhasini kiriting')
        if (!category) return toast.error('Kategoriyani tanlang')
        if (contentType === 'article' && !content) return toast.error('Maqola matnini kiriting')
        if (contentType !== 'article' && !mediaUrl) return toast.error('Fayl yuklang yoki havola kiriting')

        try {
            await knowledgeService.createArticle({
                title,
                categoryId: category,
                content: content,
                mediaUrl: contentType === 'article' ? undefined : mediaUrl,
                type: contentType.toUpperCase() as any,
                authorId: authorId,
                status: 'PUBLISHED'
            } as any)

            toast.success('Maqola muvaffaqiyatli chop etildi!')
            navigate('/admin/content')
        } catch (error: any) {
            console.error('Save error:', error)
            toast.error('Saqlashda xatolik: ' + error.message)
        }
    }

    return (
        <Layout>
            <div className="max-w-5xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/content')}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-display font-bold text-gray-900">Yangi Maqola</h1>
                            <p className="text-gray-500 text-sm">Bilimlar bazasi uchun yangi kontent</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={() => setIsPreview(!isPreview)} icon={<Eye size={20} />}>
                            {isPreview ? 'Tahrirlash' : 'Ko\'rib chiqish'}
                        </Button>
                        <Button icon={<Save size={20} />} onClick={handleSave}>Chop etish</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Settings */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="card bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Kontent Sozlamalari</h3>
                            <Input
                                label="Sarlavha"
                                placeholder="Kontent sarlavhasi..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <Select
                                label="Kontent Turi"
                                options={[
                                    { value: 'article', label: 'Maqola' },
                                    { value: 'video', label: 'Video Darslik' },
                                    { value: 'audio', label: 'Audio Podkast' },
                                    { value: 'presentation', label: 'Prezentatsiya (PDF/PPT)' }
                                ]}
                                value={contentType}
                                onChange={(e) => setContentType(e.target.value)}
                            />

                            <Select
                                label="Kategoriya"
                                options={categories}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />

                            {contentType !== 'article' && (
                                <div className="space-y-2">
                                    <Input
                                        label={`${contentType === 'video' ? 'Video' : contentType === 'audio' ? 'Audio' : 'Fayl'} havolasi (URL)`}
                                        placeholder="Havola (URL) kiriting..."
                                        value={mediaUrl}
                                        onChange={(e) => setMediaUrl(e.target.value)}
                                        icon={contentType === 'video' ? <Video size={20} /> : contentType === 'audio' ? <Headphones size={20} /> : <FileText size={20} />}
                                    />
                                    <p className="text-xs text-gray-500 italic">
                                        Eslatma: Hozircha faqat tashqi havolalar (YouTube, Google Drive va h.k.) qo'llab-quvvatlanadi.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Editor Area */}
                    <div className="lg:col-span-2">
                        <div className="card bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                            {isPreview ? (
                                <div className="p-8 prose max-w-none">
                                    <span className="text-sm font-medium text-primary-600 uppercase tracking-wider mb-2 block">
                                        {contentType === 'article' ? 'Maqola' : contentType}
                                    </span>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{title || 'Sarlavha yo\'q'}</h1>

                                    {contentType === 'video' && (
                                        <div className="aspect-video bg-gray-900 rounded-xl mb-6 flex items-center justify-center text-white">
                                            <Video size={48} />
                                            <span className="ml-2">Video pleyer preview</span>
                                        </div>
                                    )}

                                    {contentType === 'audio' && (
                                        <div className="h-16 bg-gray-100 rounded-xl mb-6 flex items-center justify-center text-gray-500">
                                            <Headphones size={24} />
                                            <span className="ml-2">Audio pleyer preview</span>
                                        </div>
                                    )}

                                    <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                                        {content || (contentType === 'article' ? 'Maqola matni bu yerda ko\'rinadi...' : 'Qo\'shimcha tavsif...')}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {contentType === 'article' ? (
                                        <>
                                            <div className="border-b border-gray-200 p-3 bg-gray-50 flex gap-2">
                                                <button className="p-2 hover:bg-white rounded-lg transition-colors font-bold text-gray-600">B</button>
                                                <button className="p-2 hover:bg-white rounded-lg transition-colors italic text-gray-600">I</button>
                                                <button className="p-2 hover:bg-white rounded-lg transition-colors underline text-gray-600">U</button>
                                            </div>
                                            <textarea
                                                className="flex-1 w-full p-6 outline-none resize-none text-lg text-gray-700 leading-relaxed"
                                                placeholder="Maqola matnini bu yerga yozing..."
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                            />
                                        </>
                                    ) : (
                                        <div className="p-6 flex-1 flex flex-col">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Tavsif (ixtiyoriy)</label>
                                            <textarea
                                                className="flex-1 w-full p-4 border border-gray-200 rounded-xl outline-none resize-none text-lg text-gray-700 leading-relaxed focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                                                placeholder={`${contentType} haqida qisqacha tavsif...`}
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
