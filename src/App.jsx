import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Builder from './pages/Builder'
import Results from './pages/Results'
import Fill from './pages/Fill'
import ThankYou from './pages/ThankYou'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/create" element={<Builder/>} />
      <Route path="/edit/:id" element={<Builder/>} />
      <Route path="/results/:id" element={<Results/>} />
      <Route path="/survey/:id" element={<Fill/>} />
      <Route path="/thank-you/:id" element={<ThankYou/>} />
    </Routes>
  )
}

export default App