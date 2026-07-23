import Card from '../ui/Card'
import Input from '../ui/Input'
import { Trash2, Plus } from 'lucide-react'

function SoruKart({ q, onSil, onZorunlu, onMetin, onSecenekDegistir, onSecenekEkle }) {

    const tipEtiket = {
        'coktan-secmeli': 'Çoktan Seçmeli',
        'metin': 'Metin',
        'puan': 'Puanlama',
        'evet-hayir': 'Evet / Hayır'
    }

    return (
        <Card className="mt-2">
            <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
                    {tipEtiket[q.type]}
                </span>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                            type="checkbox"
                            checked={q.required || false}
                            onChange={() => onZorunlu(q.id)}
                            className="accent-indigo-600"
                        />
                        Zorunlu
                    </label>
                    <button
                        onClick={() => onSil(q.id)}
                        className="flex items-center gap-1 text-red-600 text-sm hover:text-red-700"
                    >
                        <Trash2 className="w-4 h-4" /> Sil
                    </button>
                </div>
            </div>
            <Input
                value={q.text}
                onChange={(e) => onMetin(q.id, e.target.value)}
                placeholder="Soru metnini yaz"
                className="w-full px-4 py-2.5"
            />
            {q.type === 'coktan-secmeli' && (
                <div className="mt-3 pl-3 border-l-2 border-slate-200 space-y-2">
                    <p className="text-xs font-medium text-slate-400">Seçenekler</p>
                    {q.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full border-2 border-slate-300 shrink-0"></span>
                            <Input
                                value={opt}
                                onChange={(e) => onSecenekDegistir(q.id, i, e.target.value)}
                                placeholder={'Seçenek ' + (i + 1)}
                                className="w-full px-3 py-1.5 text-sm"
                            />
                        </div>
                    ))}
                    <button
                        onClick={() => onSecenekEkle(q.id)}
                        className="flex items-center gap-1 text-indigo-600 text-sm hover:text-indigo-700"
                    >
                        <Plus className="w-4 h-4" /> Seçenek ekle
                    </button>
                </div>
            )}
        </Card>
    )
}

export default SoruKart