import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200 px-8 py-4 flex items-center gap-6">
      <Link to="/" className="font-bold text-blue-600 text-lg">SurveyApp</Link>
      <Link to="/" className="text-slate-600">Anketlerim</Link>
      <Link to="/create" className="text-slate-600">Yeni Anket</Link>
    </nav>
  )
}

export default Navbar