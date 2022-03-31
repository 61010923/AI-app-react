import {
  Routes,
  Route,
} from 'react-router-dom'
import React from 'react'
import ObjDetection from './pages/ObjDetection'

function App() {
  return (

    <Routes>
      <Route path="/ObjDetection" element={<ObjDetection />} />
      <Route path="/users" />
      <Route path="/" />
    </Routes>

  )
}

export default App
