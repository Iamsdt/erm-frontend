import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  selectedProjectId: null,
  selectedSprintId: null,
  filters: {
    status: "All",
    search: "",
  },
}

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setSelectedProject: (state, action) => {
      state.selectedProjectId = action.payload
    },
    setSelectedSprint: (state, action) => {
      state.selectedSprintId = action.payload
    },
    setProjectFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetProjectFilters: (state) => {
      state.filters = initialState.filters
    },
  },
})

export const {
  setSelectedProject,
  setSelectedSprint,
  setProjectFilters,
  resetProjectFilters,
} = projectSlice.actions
export default projectSlice.reducer
