import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  currentModule: "ERM", // Default app name
  standupStatus: "Not Submitted", // "Not Submitted", "In Review", "Done"
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
    reset: () => initialState,
  },
})

export const { setCurrentModule, setStandupStatus, reset } = appSlice.actions
export default appSlice.reducer
