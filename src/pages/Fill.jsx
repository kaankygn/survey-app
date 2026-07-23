import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase'

//components
import Button from '../components/ui/Button'
import ProfilRozeti from '../components/ui/ProfilRozeti'
import CoktanSecmeli from '../components/soru/CoktanSecmeli'
import PuanSkala from '../components/soru/PuanSkala'
import EvetHayir from '../components/soru/EvetHayir'
import Input from '../components/ui/Input'

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
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50 bg-fixed py-10">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl shadow-sm p-6 md:p-8">
                    <h1 className="text-3xl font-semibold text-slate-900">{survey.title}</h1>
                    {profile && (
                        <div className="mt-3">
                            <ProfilRozeti size="lg" photo={profile.photo} name={profile.name} city={profile.city} />
                        </div>
                    )}
                    <div className="mt-5">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: yuzde + '%' }}></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5">%{yuzde} tamamlandı</p>
                    </div>
                    {survey.questions.map((q, index) => (
                        <div key={q.id} className="mt-8">
                            <p className="text-base font-medium text-slate-900 mb-3">
                                <span className="text-indigo-600 font-semibold">{index + 1}.</span> {q.text}
                                {q.required && (
                                    <span className="ml-2 text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full align-middle">
                                        Zorunlu
                                    </span>
                                )}
                            </p>
                            {q.type === 'metin' && (
                                <Input
                                    value={answers[q.id] || ''}
                                    onChange={(e) => cevapla(q.id, e.target.value)}
                                    placeholder="Yanıtınızı yazın…"
                                    className="w-full px-4 py-2.5"
                                />
                            )}

                            {q.type === 'coktan-secmeli' && (
                                <CoktanSecmeli
                                    options={q.options}
                                    value={answers[q.id]}
                                    onSec={(opt) => cevapla(q.id, opt)}
                                    soruId={q.id}
                                />
                            )}
                            {q.type === 'puan' && (
                                <PuanSkala value={answers[q.id]} onSec={(n) => cevapla(q.id, n)} />
                            )}

                            {q.type === 'evet-hayir' && (
                                <EvetHayir value={answers[q.id]} onSec={(s) => cevapla(q.id, s)} />
                            )}
                            {hataVar && q.required && !answers[q.id] && (
                                <p className="text-red-600 text-sm mt-2">Bu soru zorunludur.</p>
                            )}
                        </div>
                    ))}

                    <div className="mt-8 flex justify-end">
                        <Button onClick={gonder}>Gönder</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Fill