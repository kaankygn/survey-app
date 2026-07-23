import { NavLink, Link } from 'react-router-dom'
import { BarChart3, Plus } from 'lucide-react'

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-slate-900 to-indigo-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
          <BarChart3 className="w-8 h-8 text-indigo-400" />
          SurveyApp
        </Link>

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-white text-base border-b-2 border-indigo-400 pb-0.5"
              : "text-slate-400 text-base hover:text-white"
          }
        >
          Anketlerim
        </NavLink>

        <Link
          to="/create"
          className="ml-auto flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-base px-5 py-2.5 rounded-lg font-medium"
        >
          <Plus className="w-5 h-5" />
          Yeni Anket
        </Link>
        <div className="w-13 h-13 rounded-full bg-indigo-300 text-indigo-950 flex items-center justify-center text-sm font-medium shadow-md">
          KK
        </div>
      </div>
    </nav>
  )
}

export default Navbar