function Card({ children, className = '' }) {
  return (
    <div className={`border border-slate-200 rounded p-4 ${className}`}>
      {children}
    </div>
  )
}

export default Card