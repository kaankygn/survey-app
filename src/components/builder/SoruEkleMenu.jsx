import { useState } from 'react'
import Button from '../ui/Button'

function SoruEkleMenu({ onEkle }) {
    const [menuAcik, setMenuAcik] = useState(false)

    function sec(type) {
        onEkle(type)
        setMenuAcik(false)
    }

    return (
        <div className="mt-4">
            <Button onClick={() => setMenuAcik(!menuAcik)}>+ Soru Ekle</Button>

            {menuAcik && (
                <div className="flex gap-2 mt-2">
                    <button onClick={() => sec('coktan-secmeli')} className="bg-slate-200 px-3 py-2 rounded">+ Çoktan Seçmeli</button>
                    <button onClick={() => sec('metin')} className="bg-slate-200 px-3 py-2 rounded">+ Metin</button>
                    <button onClick={() => sec('puan')} className="bg-slate-200 px-3 py-2 rounded">+ Puanlama</button>
                    <button onClick={() => sec('evet-hayir')} className="bg-slate-200 px-3 py-2 rounded">+ Evet / Hayır</button>
                </div>
            )}
        </div>
    )
}

export default SoruEkleMenu