import { MAP_API_ACCESS_TOKEN } from "@/app.config";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  suggestModalOpen: false,
  updateInfoModalOpen: false,
  deleteReasonModalOpen: false,
};

const mapSlice = createSlice({
  name: "consumer",
  initialState,
  reducers: {
    setSuggestModalOpen: (state, action) => {
      state.suggestModalOpen = action.payload;
    },
    setUpdateInfoModalOpen: (state, action) => {
      state.updateInfoModalOpen = action.payload;
    },
    setDeleteReasonModalOpen: (state, action) => {
      state.deleteReasonModalOpen = action.payload;
    },
  },
});

export const {
  setSuggestModalOpen, setUpdateInfoModalOpen, setDeleteReasonModalOpen

} = mapSlice.actions;
export default mapSlice.reducer;
