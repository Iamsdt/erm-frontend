import { createSlice } from "@reduxjs/toolkit"

import { queryClient } from "@/lib/query-client"
import ct from "@constants/"

export const authSlice = createSlice({
  name: ct.store.USER_STORE,
  initialState: {
    userName: "",
    isAuthenticated: false,
    userRole: "",
    leave_management_role: "", // "admin" | "employee" — scoped role for Leave Management module
    employee_management_role: "", // "admin" | "" — scoped role for Employee Management module
    attendance_management_role: "", // "admin" | "employee" — scoped role for Attendance Management module
  },
  reducers: {
    login: (state, action) => {
      state.userName = action.payload.userName
      state.isAuthenticated = true
      state.userRole = action.payload.userRole
      state.leave_management_role = action.payload.leave_management_role ?? ""
      state.employee_management_role =
        action.payload.employee_management_role ?? ""

      // as of not hardcode
      state.attendance_management_role =
        action.payload.employee_management_role ?? ""
    },
    logout: (state) => {
      state.userName = ""
      state.isAuthenticated = false
      state.userRole = ""
      state.attendance_management_role = ""
      state.leave_management_role = ""
      state.employee_management_role = ""

      // also clear localhost
      queryClient.clear()
    },
  },
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer
