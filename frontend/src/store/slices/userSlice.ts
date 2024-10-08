import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  _id: string
  name: string
  email: string
}

interface UserState {
  currentUser: User | null
  users: User[]
}

const initialState: UserState = {
  currentUser: JSON.parse(localStorage.getItem('user') || 'null'),
  users: [],
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
      localStorage.setItem('user', JSON.stringify(action.payload))
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload
    },
    clearUser: (state) => {
      state.currentUser = null
      state.users = []
      localStorage.removeItem('user')
    },
  },
})

export const { setCurrentUser, setUsers, clearUser } = userSlice.actions
export default userSlice.reducer