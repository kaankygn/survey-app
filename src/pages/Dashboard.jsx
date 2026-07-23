import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'

//companents
import Card from '../components/ui/Card'
import Layout from '../components/ui/Layout'

function Dashboard() {
    const [surveys, setSurveys] = useState([])
    useEffect(() => {
        async function getir() {
            const surveySnap = await getDocs(collection(db, 'surveys'))
            const responseSnap = await getDocs(collection(db, 'responses'))
            const responses = responseSnap.docs.map((d) => d.data())

            const liste = surveySnap.docs.map((doc) => {
                const surveyResponses = responses.filter((r) => r.surveyId === doc.id)
                const count = surveyResponses.length
                const soruSayisi = (doc.data().questions || []).length

                let tamamlama = 0
                if (count > 0 && soruSayisi > 0) {
                    const toplamCevap = surveyResponses.reduce(
                        (sum, r) => sum + Object.keys(r.answers || {}).length, 0
                    )
                    tamamlama = Math.round((toplamCevap / (count * soruSayisi)) * 100)
                }

                return { id: doc.id, ...doc.data(), responseCount: count, tamamlama }
            })
            setSurveys(liste)
        }
        getir()
    }, [])

    async function sil(id) {
        if (!window.confirm('Bu anketi silmek istediğine emin misin?')) return
        await deleteDoc(doc(db, 'surveys', id))
        setSurveys(surveys.filter((s) => s.id !== id))
    }

    function paylas(id) {
        const link = window.location.origin + '/survey/' + id
        navigator.clipboard.writeText(link)
        alert('Link kopyalandı: ' + link)
    }

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4">Anketlerim</h1>

            {surveys.map((survey) => (
                <Card key={survey.id} className="mt-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            {survey.creator && (
                                <img src={survey.creator.photo} alt="" className="w-8 h-8 rounded-full" />
                            )}
                            <div>
                                <h2 className="font-bold">{survey.title}</h2>
                                {survey.creator && (
                                    <p className="text-xs text-slate-500">
                                        {survey.creator.name} · {survey.creator.city}
                                    </p>
                                )}
                            </div>
                        </div>
                        <span className={
                            survey.published
                                ? "text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                                : "text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded"
                        }>
                            {survey.published ? 'Yayında' : 'Taslak'}
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                        {survey.questions.length} soru · {survey.responseCount} yanıt · %{survey.tamamlama} tamamlama
                    </p>

                    <div className="flex gap-3 mt-3 text-sm">
                        <Link to={'/edit/' + survey.id} className="text-blue-600">Düzenle</Link>
                        <Link to={'/results/' + survey.id} className="text-blue-600">Sonuçlar</Link>
                        <button onClick={() => paylas(survey.id)} className="text-blue-600">Paylaş</button>
                        <button onClick={() => sil(survey.id)} className="text-red-600">Sil</button>
                    </div>
                </Card>
            ))}
        </Layout>

    )
}

export default Dashboard