import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import LoginPage from './pages/login.tsx'
import Initial from './pages/initial.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path='/login' element={<LoginPage/>} />
      <Route path="/initial" element={<Initial />} />
    </Routes>
  </BrowserRouter>,
)
