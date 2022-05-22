import {
  Routes,
  Route,
} from 'react-router-dom'
import React from 'react'

import PageUI from './pages/PageUI'

function App() {
  return (

    <Routes>

      <Route path="/" element={<PageUI />} />
    </Routes>

  )
}

export default App
