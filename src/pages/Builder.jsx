import { useState } from "react"
import { collection, addDoc } from "firebase/firestore"
import { db } from'../firebase'
import Navbar from "../components/Navbar"

function Builder() {
    const [title, setTitle] = useState('')

    async function kaydet() {
        await addDoc(collection(db, 'surveys'), {
            title: title,
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