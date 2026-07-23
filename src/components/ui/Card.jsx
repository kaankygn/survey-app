function Card({ children, className = '' }) {
  return (
    <div className={`bg-white/30 backdrop-blur-md border border-white/60 rounded-xl shadow-sm p-5 ${className}`}>
      {children}
    </div>
  )
}

export default Card