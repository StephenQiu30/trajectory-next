import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  user: UserAPI.LoginUserVO | null
  token: string | null
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  } as UserState,
  reducers: {
    setLoginUser: (state, action: PayloadAction<UserAPI.LoginUserVO>) => {
      state.user = action.payload
    },
    clearLoginUser: state => {
      state.user = null
      state.token = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
    },
  },
})

export const { setLoginUser, clearLoginUser } = userSlice.actions
export default userSlice.reducer
