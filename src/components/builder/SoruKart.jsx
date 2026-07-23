import Card from '../ui/Card'

function SoruKart({ q, onSil, onZorunlu, onMetin, onSecenekDegistir, onSecenekEkle }) {
    return (
        <Card className="mt-2">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-400">{q.type}</span>
                <label className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                    <input
                        type="checkbox"
                        checked={q.required || false}
                        onChange={() => onZorunlu(q.id)}
                    />
                    Zorunlu
                </label>
                <button onClick={() => onSil(q.id)} className="text-red-600 text-sm">Sil</button>
            </div>
            <input
                value={q.text}
                onChange={(e) => onMetin(q.id, e.target.value)}
                className="border border-slate-300 rounded px-3 py-2 w-full"
            />
            {q.type === 'coktan-secmeli' && (
                <div className="mt-2 space-y-1">
                    {q.options.map((opt, i) => (
                        <input
                            key={i}
                            value={opt}
                            onChange={(e) => onSecenekDegistir(q.id, i, e.target.value)}
                            className="border border-slate-300 rounded px-2 py-1 w-full text-sm"
                        />
                    ))}
                    <button onClick={() => onSecenekEkle(q.id)} className="text-blue-600 text-sm">
                        + Seçenek ekle
                    </button>
                </div>
            )}
        </Card>
    )
}

export default SoruKart