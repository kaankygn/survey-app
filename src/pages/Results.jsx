import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

//companents
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Card from '../components/Card'

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
    function zamanOnce(ms) {
        const fark = Date.now() - ms
        const dakika = Math.floor(fark / 60000)
        if (dakika < 1) return 'az önce'
        if (dakika < 60) return dakika + ' dk önce'
        const saat = Math.floor(dakika / 60)
        if (saat < 24) return saat + ' sa önce'
        const gun = Math.floor(saat / 24)
        return gun + ' gün önce'
    }
    function csvIndir() {
        const basliklar = survey.questions.map((q) => '"' + q.text + '"')
        const satirlar = responses.map((r) =>
            survey.questions.map((q) => '"' + (r.answers[q.id] || '') + '"').join(',')
        )
        const csv = [basliklar.join(','), ...satirlar].join('\n')

        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = survey.title + '.csv'
        a.click()
        URL.revokeObjectURL(url)
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
                <div className="mt-2">
                    <Button variant="secondary" onClick={csvIndir}> CSV İndir ⬇</Button>
                </div>

                {survey.questions.map((q) => (
                    <Card key={q.id} className="mt-4">
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
                    </Card>
                ))}
            </div>
            <Card className="mt-4">
                <h2 className="font-bold mb-2">Yanıt verenler</h2>
                {responses.map((r, i) => (
                    r.profile ? (
                        <div key={i} className="flex items-center gap-3 mt-2">
                            <img src={r.profile.photo} alt="" className="w-8 h-8 rounded-full" />
                            <span className="text-sm text-slate-600">
                                {r.profile.name} · {r.profile.city} · {zamanOnce(r.createdAt)}
                            </span>
                        </div>
                    ) : null
                ))}
            </Card>
        </div>
    )
}

export default Results