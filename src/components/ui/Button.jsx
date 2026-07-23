function Button ({ children, onClick, variant = 'primary' }) {

    const stiller = {
        primary: 'bg-blue-600 text-white',
        secondary: 'bg-slate-200 text-slate-800'
    }

    return(
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded ${stiller[variant]}`}
        >
            {children}
        </button>
    )
}

export default Button