import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  currentModule: "ERM", // Default app name
  standupStatus: "Not Submitted", // "Not Submitted", "In Review", "Done"
  notificationCount: 0, // Unread notification count — updated when notifications are fetched
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setCurrentModule: (state, action) => {
      state.currentModule = action.payload
    },
    setStandupStatus: (state, action) => {
      state.standupStatus = action.payload
    },
    setNotificationCount: (state, action) => {
      state.notificationCount = action.payload
    },
    reset: () => initialState,
  },
})

export const {
  setCurrentModule,
  setStandupStatus,
  setNotificationCount,
  reset,
} = appSlice.actions
export default appSlice.reducer
