import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { IBook } from "../../../types/books.type";
import type { ModalState } from "../../../types/modal.type";

const initialState: ModalState = {
  isOpen: false,
  book: null,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<IBook>) => {
      state.isOpen = true;
      state.book = action.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.book = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;