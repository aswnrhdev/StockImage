import { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Dashboard from './components/Dashboard/Dashboard'
import ResetPassword from './components/ResetPassword/ResetPassword'
import { RootState } from './store/store'
import { setCredentials } from './store/slices/authSlice'
import { setCurrentUser } from './store/slices/userSlice'

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null')

    if (token && storedUser) {
      dispatch(setCredentials({ token, user: storedUser }))
      dispatch(setCurrentUser(storedUser))
    }
  }, [dispatch])

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
    </Routes>
  )
}

export default App