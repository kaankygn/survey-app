function Button({ children, onClick, variant = 'primary' }) {

    const stiller = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
        secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300'
    }

    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg transition ${stiller[variant]}`}
        >
            {children}
        </button>
    )
}

export default Button