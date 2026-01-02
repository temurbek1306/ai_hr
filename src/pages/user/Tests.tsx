import Layout from '../../components/Layout'

export default function Tests() {
    return (
        <Layout role="user">
            <div className="p-4 bg-white shadow rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Testlar</h1>
                <p className="text-gray-600">Bilim darajasini aniqlash uchun testlar.</p>
            </div>
        </Layout>
    )
}
