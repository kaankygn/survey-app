import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import Navbar from '../components/Navbar'

function Dashboard() {
    const [surveys, setSurveys] = useState([])
    useEffect(() => {
        async function getir() {
            const snapshot = await getDocs(collection(db, 'surveys'))
            const liste = snapshot.docs.map((doc) =>({
                id: doc.id,
                ...doc.data()
            }))
            setSurveys(liste)
        }
        getir()
    }, []
    )
  return (
    <div>
        <Navbar />
        <div className="p-8">
            <h1 className="text-2xl font-bold">Anketlerim</h1>
            
            {surveys.map((survey) => (
                <div key={survey.id} className="border border-slate-200 rounded p-4 mt-4">
                    <h2 className="font-bold">{survey.title}</h2>
                    </div>
            ))}
        </div>
    </div>
  )
}

export default Dashboard