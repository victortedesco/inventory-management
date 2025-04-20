import { useEffect } from 'react'
import './App.css'
import { useNavigate } from 'react-router'

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [])

  return (
    <>
    </>
  )
}

export default App
