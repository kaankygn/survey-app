import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase'

import Button from '../components/ui/Button'

function Fill() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [survey, setSurvey] = useState(null)
    const [answers, setAnswers] = useState({})
    const [profile, setProfile] = useState(null)
    const [hataVar, setHataVar] = useState(false)
    useEffect(() => {
        async function getir() {
            const docRef = doc(db, 'surveys', id)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setSurvey({ id: docSnap.id, ...docSnap.data() })
            }
        }
        getir()
    }, [id])
    useEffect(() => {
        async function getirProfil() {
            const res = await fetch('https://randomuser.me/api/')
            const data = await res.json()
            const u = data.results[0]
            setProfile({
                name: u.name.first + ' ' + u.name.last,
                city: u.location.city,
                photo: u.picture.thumbnail
            })
        }
        getirProfil()
    }, [])

    function cevapla(soruId, deger) {
        setAnswers({ ...answers, [soruId]: deger })
    }

    async function gonder() {
        const eksik = survey.questions.some((q) => q.required && !answers[q.id])
        if (eksik) {
            setHataVar(true)
            return
        }
        await addDoc(collection(db, 'responses'), {
            surveyId: id,
            answers: answers,
            profile: profile,
            createdAt: Date.now()
        })
        navigate('/thank-you/' + id)
    }

    if (!survey) {
        return <div className="p-8">Yükleniyor...</div>
    }
    const cevaplanan = survey.questions.filter((q) => answers[q.id]).length
    const yuzde = survey.questions.length
        ? Math.round((cevaplanan / survey.questions.length) * 100)
        : 0

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold">{survey.title}</h1>
            {profile && (
                <div className="flex items-center gap-3 mt-2">
                    <img src={profile.photo} alt="" className="w-10 h-10 rounded-full" />
                    <span className="text-sm text-slate-600">{profile.name} · {profile.city}</span>
                </div>
            )}
            <div className="mt-4">
                <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: yuzde + '%' }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">%{yuzde} tamamlandı</p>
            </div>
            {survey.questions.map((q) => (
                <div key={q.id} className="mt-6">
                    <p className="font-medium mb-2">
                        {q.text}{q.required && <span className="text-red-600"> *</span>}
                    </p>
                    {q.type === 'metin' && (
                        <input
                            value={answers[q.id] || ''}
                            onChange={(e) => cevapla(q.id, e.target.value)}
                            className="border border-slate-300 rounded px-3 py-2 w-full"
                        />
                    )}

                    {q.type === 'coktan-secmeli' && (
                        <div className="space-y-1">
                            {q.options.map((opt, i) => (
                                <label key={i} className="block">
                                    <input
                                        type="radio"
                                        name={q.id}
                                        checked={answers[q.id] === opt}
                                        onChange={() => cevapla(q.id, opt)}
                                        className="mr-2"
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    )}

                    {q.type === 'puan' && (
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                <button
                                    key={n}
                                    onClick={() => cevapla(q.id, n)}
                                    className={
                                        answers[q.id] === n
                                            ? "rounded w-9 h-9 bg-blue-600 text-white"
                                            : "border border-slate-300 rounded w-9 h-9"
                                    }
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    )}

                    {q.type === 'evet-hayir' && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => cevapla(q.id, 'Evet')}
                                className={
                                    answers[q.id] === 'Evet'
                                        ? "rounded px-4 py-2 bg-blue-600 text-white"
                                        : "border border-slate-300 rounded px-4 py-2"
                                }
                            >
                                Evet
                            </button>
                            <button
                                onClick={() => cevapla(q.id, 'Hayır')}
                                className={
                                    answers[q.id] === 'Hayır'
                                        ? "rounded px-4 py-2 bg-blue-600 text-white"
                                        : "border border-slate-300 rounded px-4 py-2"
                                }
                            >
                                Hayır
                            </button>
                        </div>
                    )}
                    {hataVar && q.required && !answers[q.id] && (
                        <p className="text-red-600 text-sm mt-1">Bu soru zorunludur.</p>
                    )}
                </div>
            ))}

            <div className="mt-8"><Button onClick={gonder}>Gönder</Button></div>
        </div>
    )
}

export default Fill