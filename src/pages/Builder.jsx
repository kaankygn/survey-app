import { useState, useEffect } from "react"
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from '../firebase'
import { useNavigate, useParams } from "react-router-dom"

//companents
import Button from "../components/ui/Button"
import Layout from "../components/ui/Layout"
import SoruEkleMenu from "../components/builder/SoruEkleMenu"
import SoruKart from "../components/builder/SoruKart"


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
            const res = await fetch('https://randomuser.me/api/')
            const data = await res.json()
            const u = data.results[0]
            const creator = {
                name: u.name.first + ' ' + u.name.last,
                city: u.location.city,
                photo: u.picture.thumbnail
            }
            await addDoc(collection(db, 'surveys'), {
                title: title,
                questions: questions,
                published: published,
                creator: creator,
                createdAt: Date.now()
            })
        }
        navigate('/')
    }
    return (

        <Layout>
            <h1 className="text-2xl font-bold">{id ? 'Anketi Düzenle' : 'Anket Oluştur'}</h1>

            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Anket başlığı"
                className="border border-slate-300 rounded px-3 py-2 mt-4 block w-full max-w-md"
            />

            <SoruEkleMenu onEkle={soruEkle} />

            <div className="mt-4">
                {questions.map((q) => (
                    <SoruKart
                        key={q.id}
                        q={q}
                        onSil={soruSil}
                        onZorunlu={zorunluDegistir}
                        onMetin={soruMetniDegistir}
                        onSecenekDegistir={secenekDegistir}
                        onSecenekEkle={secenekEkle}
                    />
                ))}
            </div>
            
            <div className="mt-4 flex gap-2">
                <Button variant="secondary" onClick={() => kaydet(false)}>Taslak Kaydet</Button>
                <Button variant="primary" onClick={() => kaydet(true)}>Yayınla</Button>
            </div>
        </Layout>

    )
}
export default Builder