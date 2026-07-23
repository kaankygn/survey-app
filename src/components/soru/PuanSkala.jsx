function PuanSkala({ value, onSec, readonly = false }) {
    const sayilar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    return (
        <div>
            <div className="flex items-center gap-4">
                <div className="flex items-end gap-1.5 flex-1 h-16">
                    {sayilar.map((n) => {
                        const dolu = value >= n
                        return (
                            <button
                                key={n}
                                type="button"
                                disabled={readonly}
                                onClick={() => onSec(value === n ? null : n)}
                                className="flex-1 h-full flex items-end group"
                            >
                                <div
                                    className={
                                        (dolu ? "bg-indigo-600" : "bg-indigo-100 group-hover:bg-indigo-200") +
                                        " w-full rounded-t transition-all"
                                    }
                                    style={{ height: (n * 10) + '%' }}
                                ></div>
                            </button>
                        )
                    })}
                </div>
                <span className="text-2xl font-semibold text-indigo-600 w-8 text-right">
                    {value || '–'}
                </span>
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Düşük</span>
                <span>Yüksek</span>
            </div>
        </div>
    )
}

export default PuanSkala