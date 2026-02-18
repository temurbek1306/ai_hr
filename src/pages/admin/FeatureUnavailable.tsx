import { useSearchParams } from 'react-router-dom'
import FeaturePlaceholder from '../../components/FeaturePlaceholder'

export default function FeatureUnavailable() {
    const [searchParams] = useSearchParams()
    const title = searchParams.get('title') || 'Funksionallik'

    return (
        <FeaturePlaceholder
            title={title}
            description={`Ushbu "${title}" moduli hozirda ishlab chiqish jarayonida. To'liq ishlashi uchun backend API integratsiyasi talab qilinadi.`}
            backUrl="/admin/dashboard"
        />
    )
}
