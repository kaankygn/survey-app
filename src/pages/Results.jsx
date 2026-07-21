import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import Navbar from '../components/Navbar'

function Results() {
    const { id } = useParams()
    const [survey, setSurvey] = useState(null)
    const [responses, setResponses] = useState([])

    useEffect(() => {
        async function getir() {
            const surveySnap = await getDoc(doc(db, 'surveys', id))
            if (surveySnap.exists()) {
                setSurvey({ id: surveySnap.id, ...surveySnap.data() })
            }

            const respSnap = await getDocs(collection(db, 'responses'))
            const liste = respSnap.docs
                .map((d) => d.data())
                .filter((r) => r.surveyId === id)
            setResponses(liste)
        }
        getir()
    }, [id])
    function ortalamaPuan(soruId) {
        const puanlar = responses.map((r) => r.answers[soruId]).filter((v) => typeof v === 'number')
        if (puanlar.length === 0) return '-'
        const toplam = puanlar.reduce((a, b) => a + b, 0)
        return (toplam / puanlar.length).toFixed(1)
    }
    function secenekVerisi(q) {
        const secenekler = q.type === 'coktan-secmeli' ? q.options : ['Evet', 'Hayır']
        return secenekler.map((opt) => ({
            isim: opt,
            sayi: responses.filter((r) => r.answers[q.id] === opt).length
        }))
    }
    if (!survey) {
        return (
            <div>
                <Navbar />
                <div className="p-8">Yükleniyor...</div>
            </div>
        )
    }

    return (
        <div>
            <Navbar />
            <div className="p-8">
                <h1 className="text-2xl font-bold">{survey.title} — Sonuçlar</h1>
                <p className="text-slate-500 mt-1">{responses.length} yanıt</p>

                {survey.questions.map((q) => (
                    <div key={q.id} className="border border-slate-200 rounded p-4 mt-4">
                        <h2 className="font-bold">{q.text}</h2>
                        {(q.type === 'coktan-secmeli' || q.type === 'evet-hayir') && (
                            <BarChart width={400} height={200} data={secenekVerisi(q)}>
                                <XAxis dataKey="isim" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="sayi" fill="#2563eb" />
                            </BarChart>
                        )}


                        {q.type === 'puan' && (
                            <p className="text-sm text-slate-600 mt-2">Ortalama puan: {ortalamaPuan(q.id)}</p>
                        )}

                        {q.type === 'metin' && (
                            <div className="mt-2 space-y-1">
                                {responses.map((r, i) => (
                                    r.answers[q.id] ? (
                                        <div key={i} className="text-sm text-slate-600">• {r.answers[q.id]}</div>
                                    ) : null
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Results