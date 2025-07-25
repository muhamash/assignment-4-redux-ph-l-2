import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { IBook } from "../../../types/books.type";
import type { BorrowModalBook, ModalState } from "../../../types/modal.type";

const initialState: ModalState = {
  editModal: {
    isOpen: false,
    book: null,
  },
  borrowModal: {
    isOpen: false,
    book: null,
    isConfirm: false,
  }
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openBorrowModal: (state, action: PayloadAction<BorrowModalBook>) => {
      state.borrowModal.isOpen = true;
      state.borrowModal.book = action.payload;
    },
    closeBorrowModal: (state) => {
      state.borrowModal.isOpen = false;
      state.borrowModal.book = null;
      state.borrowModal.isOpen = true;
    },
    openEditModal: (state, action: PayloadAction<IBook>) => {
      state.editModal.isOpen = true;
      state.editModal.book = action.payload;
    },
    closeEditModal: (state) => {
      state.editModal.isOpen = false;
      state.editModal.book = null;
    },
  },
});

export const { openBorrowModal, openEditModal, closeBorrowModal, closeEditModal } = modalSlice.actions;
export default modalSlice.reducer;