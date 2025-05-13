import { useEffect } from 'react'
import './App.css'
import { useNavigate } from 'react-router'
import { DashBoard } from './components/DashBoard';

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
    <DashBoard></DashBoard>
    </>
  )
}

export default App
