import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import HomebaseLive from './pages/HomebaseLive'
import HomebaseHistory from './pages/HomebaseHistory'

export default function App() {
  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 pt-16 md:p-6 md:pt-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/homebase/:id" element={<HomebaseLive />} />
          <Route path="/homebase/:id/history" element={<HomebaseHistory />} />
        </Routes>
      </main>
    </div>
  )
}
