import {
  Routes,
  Route,
} from 'react-router-dom'
import React from 'react'
import ObjDetection from './pages/ObjDetection'
import TfDetection from './pages/TfDetection'

function App() {
  return (

    <Routes>
      <Route path="/ObjDetection" element={<ObjDetection />} />
      <Route path="/TfDetection" element={<TfDetection />} />
      <Route path="/" />
    </Routes>

  )
}

export default App
