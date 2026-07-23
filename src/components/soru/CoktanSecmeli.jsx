function CoktanSecmeli({ options, value, onSec, soruId }) {
    return (
        <div className="space-y-2">
            {options.map((opt, i) => {
                const secili = value === opt
                return (
                    <div
    key={i}
    onClick={() => onSec(secili ? null : opt)}
    className={
        secili
            ? "flex items-center gap-3 border-2 border-indigo-600 bg-indigo-50 rounded-lg px-4 py-3 cursor-pointer"
            : "flex items-center gap-3 border border-slate-200 rounded-lg px-4 py-3 cursor-pointer hover:border-slate-300"
    }
>
    <input
        type="radio"
        name={soruId}
        checked={secili}
        readOnly
        className="accent-indigo-600 pointer-events-none"
    />
    <span className={secili ? "text-indigo-900" : "text-slate-700"}>{opt}</span>
</div>
                )
            })}
        </div>
    )
}

export default CoktanSecmeli