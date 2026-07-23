import Navbar from './Navbar'

function Layout({ children }) {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-indigo-50 min-h-screen bg-fixed">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  )
}

export default Layout