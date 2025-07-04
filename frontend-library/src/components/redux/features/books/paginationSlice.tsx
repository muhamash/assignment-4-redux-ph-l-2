import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { PaginationState } from "../../../types/books.type";

const initialState: PaginationState = {
  page: 1,
  limit: 10,
  tab: "all",
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
    },
    setTab(state, action: PayloadAction<"all" | "my">) {
      state.tab = action.payload;
      state.page = 1;
    },
    resetPagination(state) {
      state.page = 1;
      state.limit = 10;
      state.tab = "all";
    },
  },
});

export const { setPage, setLimit, setTab, resetPagination } = paginationSlice.actions;
export default paginationSlice.reducer;
