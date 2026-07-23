import Navbar from './Navbar'

function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="p-8">
        {children}
      </div>
    </div>
  )
}

export default Layout