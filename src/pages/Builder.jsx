import { useState } from "react"
import { collection, addDoc } from "firebase/firestore"
import { db } from'../firebase'
import Navbar from "../components/Navbar"

function Builder() {
    const [title, setTitle] = useState('')
    const [questions, setQuestions] = useState([])

    function soruEkle() {
        const yeniSoru = {
            id: Date.now(),
            text:'Yeni soru'
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

        <button onClick={soruEkle} className="mt-4 bg-slate-200 px-4 py-2 rounded">
          + Soru Ekle
        </button>

        <div className="mt-4">
          {questions.map((q) => (
            <div key={q.id} className="border border-slate-200 rounded p-4 mt-2">
                <input
                    value={q.text}
                    onChange={(e) => soruMetniDegistir(q.id, e.target.value)}
                    className="border border-slate-300 rounded px-3 py-2 w-full"
                />
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