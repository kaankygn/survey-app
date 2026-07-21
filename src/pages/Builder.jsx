import { useState } from "react"
import { collection, addDoc } from "firebase/firestore"
import { db } from'../firebase'
import Navbar from "../components/Navbar"

function Builder() {
    const [title, setTitle] = useState('')
    const [questions, setQuestions] = useState([])

    function soruEkle(type) {
        const yeniSoru = {
            id: Date.now(),
            text:'Yeni soru',
            type: type,
            options: type === 'coktan-secmeli' ? ['Seçenek1', 'Seçenek2']: []
        }
        setQuestions([...questions, yeniSoru])
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

    async function kaydet() {
        await addDoc(collection(db, 'surveys'), {
            title: title,
            questions: questions,
            createdAt: Date.now()
        }
    )
      alert('Anket kaydedildi!') 
    }
    return(
    <div>
        <Navbar/>
        <div className="p-8">
        <h1 className="text-2xl font-bold">Anket Oluştur</h1>
        
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
            <div className="text-xs text-slate-400 mb-1">{q.type}</div>
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
        
        <button
            onClick={kaydet}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
            Kaydet
            </button>
        </div>
    </div>
    )
}
export default Builder