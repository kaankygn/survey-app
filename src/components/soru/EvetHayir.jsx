function EvetHayir({ value, onSec, readonly = false }) {
    const secenekler = ['Evet', 'Hayır']
    return (
        <div className="flex gap-3">
            {secenekler.map((s) => {
                const secili = value === s
                return (
                    <button
                        key={s}
                        type="button"
                        disabled={readonly}
                        onClick={() => onSec(value === s ? null : s)}
                        className={
                            (secili
                                ? "border-2 border-indigo-600 bg-indigo-600 text-white"
                                : "border border-slate-200 text-slate-600 hover:border-slate-300") +
                            " flex-1 rounded-lg py-2.5 text-center transition"
                        }
                    >
                        {s}
                    </button>
                )
            })}
        </div>
    )
}

export default EvetHayir