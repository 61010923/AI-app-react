import {
  Routes,
  Route,
} from 'react-router-dom'
import React from 'react'
import ObjDetection from './pages/ObjDetection'
import TfDetection from './pages/TfDetection'
import PageUI from './pages/PageUI'

function App() {
  return (

    <Routes>
      <Route path="/ObjDetection" element={<ObjDetection />} />
      <Route path="/TfDetection" element={<TfDetection />} />
      <Route path="/" element={<PageUI />} />
    </Routes>

  )
}

export default App
