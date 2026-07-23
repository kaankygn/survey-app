import Button from '../ui/Button'
import { ListChecks, AlignLeft, Star, ToggleLeft } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

function SoruEkleMenu({ onEkle }) {
    const [menuAcik, setMenuAcik] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        function disariTikla(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuAcik(false)
            }
        }
        document.addEventListener('mousedown', disariTikla)
        return () => document.removeEventListener('mousedown', disariTikla)
    }, [])

    function sec(type) {
        onEkle(type)
        setMenuAcik(false)
    }

    return (
        <div className="mt-4 relative inline-block" ref={menuRef}>
            <Button onClick={() => setMenuAcik(!menuAcik)}>+ Soru Ekle</Button>

            {menuAcik && (
                <div className="menu-anim absolute z-20 mt-2 w-60 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5">
                    <button onClick={() => sec('coktan-secmeli')} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-indigo-50 transition text-left">
                        <ListChecks className="w-4 h-4 text-indigo-500" /> Çoktan Seçmeli
                    </button>
                    <button onClick={() => sec('metin')} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-indigo-50 transition text-left">
                        <AlignLeft className="w-4 h-4 text-indigo-500" /> Metin
                    </button>
                    <button onClick={() => sec('puan')} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-indigo-50 transition text-left">
                        <Star className="w-4 h-4 text-indigo-500" /> Puanlama
                    </button>
                    <button onClick={() => sec('evet-hayir')} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-indigo-50 transition text-left">
                        <ToggleLeft className="w-4 h-4 text-indigo-500" /> Evet / Hayır
                    </button>
                </div>
            )}
        </div>
    )
}

export default SoruEkleMenu