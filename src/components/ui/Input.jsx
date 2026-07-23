function Input({ value, onChange, placeholder, className = '' }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${className}`}
    />
  )
}

export default Input