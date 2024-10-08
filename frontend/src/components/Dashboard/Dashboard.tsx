import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUsers } from '../../services/api'
import { logout } from '../../store/slices/authSlice'
import { setUsers } from '../../store/slices/userSlice'
import { RootState } from '../../store/store'

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector((state: RootState) => state.auth.user)
  const users = useSelector((state: RootState) => state.user.users)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers()
        dispatch(setUsers(response.data))
      } catch (error) {
        console.error('Failed to fetch users:', error)
      }
    }
    fetchUsers()
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Welcome, {currentUser?.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold mb-4">User List</h2>
          <ul className="bg-white shadow overflow-hidden sm:rounded-md">
            {users.map((user) => (
              <li key={user._id} className="border-b border-gray-200 last:border-b-0">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">{user.name}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}

export default Dashboard