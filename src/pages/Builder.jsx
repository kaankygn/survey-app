import { useState, useEffect } from "react"
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from '../firebase'
import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"

function Builder() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [title, setTitle] = useState('')
    const [questions, setQuestions] = useState([])

    useEffect(() => {
        if (!id) return
        async function getir() {
            const docSnap = await getDoc(doc(db, 'surveys', id))
            if (docSnap.exists()) {
                const data = docSnap.data()
                setTitle(data.title)
                setQuestions(data.questions)
            }
        }
        getir()
    }, [id])


    function soruEkle(type) {
        const yeniSoru = {
            id: Date.now(),
            text: 'Yeni soru',
            type: type,
            required: false,
            options: type === 'coktan-secmeli' ? ['Seçenek1', 'Seçenek2'] : []
        }
        setQuestions([...questions, yeniSoru])
    }

    function soruSil(id) {
        setQuestions(questions.filter((q) => q.id !== id))
    }

    function zorunluDegistir(id) {
        setQuestions(questions.map((q) =>
            q.id === id ? { ...q, required: !q.required } : q
        ))
    }

    function soruMetniDegistir(id, yeniMetin) {
        setQuestions(
            questions.map((q) =>
                q.id === id ? { ...q, text: yeniMetin } : q
            )
        )
    }
    function secenekDegistir(soruId, index, yeniDeger) {
        setQuestions(questions.map((q) => {
            if (q.id !== soruId) return q
            const yeniSecenekler = q.options.map((opt, i) => (i === index ? yeniDeger : opt))
            return { ...q, options: yeniSecenekler }
        }))
    }

    function secenekEkle(soruId) {
        setQuestions(questions.map((q) =>
            q.id === soruId ? { ...q, options: [...q.options, 'Yeni seçenek'] } : q
        ))
    }

    async function kaydet(published) {
        if (id) {
            await updateDoc(doc(db, 'surveys', id), {
                title: title,
                questions: questions,
                published: published
            })
        } else {
            await addDoc(collection(db, 'surveys'), {
                title: title,
                questions: questions,
                published: published,
                createdAt: Date.now()
            })
        }
        navigate('/')
    }
    return (
        <div>
            <Navbar />
            <div className="p-8">
                <h1 className="text-2xl font-bold">{id ? 'Anketi Düzenle' : 'Anket Oluştur'}</h1>

                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Anket başlığı"
                    className="border border-slate-300 rounded px-3 py-2 mt-4 block w-full max-w-md"
                />

                <div className="flex gap-2 mt-4">
                    <button onClick={() => soruEkle('coktan-secmeli')} className="bg-slate-200 px-3 py-2 rounded">+ Çoktan Seçmeli</button>
                    <button onClick={() => soruEkle('metin')} className="bg-slate-200 px-3 py-2 rounded">+ Metin</button>
                    <button onClick={() => soruEkle('puan')} className="bg-slate-200 px-3 py-2 rounded">+ Puanlama</button>
                    <button onClick={() => soruEkle('evet-hayir')} className="bg-slate-200 px-3 py-2 rounded">+ Evet / Hayır</button>
                </div>

                <div className="mt-4">
                    {questions.map((q) => (
                        <div key={q.id} className="border border-slate-200 rounded p-4 mt-2">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-slate-400">{q.type}</span>
                                <label className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={q.required || false}
                                        onChange={() => zorunluDegistir(q.id)}
                                    />
                                    Zorunlu
                                </label>
                                <button onClick={() => soruSil(q.id)} className="text-red-600 text-sm">Sil</button>
                            </div>
                            <input
                                value={q.text}
                                onChange={(e) => soruMetniDegistir(q.id, e.target.value)}
                                className="border border-slate-300 rounded px-3 py-2 w-full"
                            />
                            {q.type === 'coktan-secmeli' && (
                                <div className="mt-2 space-y-1">
                                    {q.options.map((opt, i) => (
                                        <input
                                            key={i}
                                            value={opt}
                                            onChange={(e) => secenekDegistir(q.id, i, e.target.value)}
                                            className="border border-slate-300 rounded px-2 py-1 w-full text-sm"
                                        />
                                    ))}
                                    <button onClick={() => secenekEkle(q.id)} className="text-blue-600 text-sm">
                                        + Seçenek ekle
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex gap-2">
                    <button onClick={() => kaydet(false)} className="bg-slate-200 px-4 py-2 rounded">
                        Taslak Kaydet
                    </button>
                    <button onClick={() => kaydet(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
                        Yayınla
                    </button>
                </div>
            </div>
        </div>
    )
}
export default Builder