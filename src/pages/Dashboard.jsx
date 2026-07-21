import Navbar from '../components/Navbar'

function Dashboard() {
  return (
    <div>
        <Navbar />
        <div className="p-8">
            <h1 className="text-2xl font-bold">Anketlerim</h1>
            <p className="text-slate-500">Buraya anketler gelecek.</p>
        </div>
    </div>
  )
}

export default Dashboard