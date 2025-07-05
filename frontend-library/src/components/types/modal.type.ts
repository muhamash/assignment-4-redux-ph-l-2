import type { IBook } from "./books.type";

export interface ModalState {
    [ key: string ]: {
        isOpen: boolean;
        book: IBook | null;
    };
};  

export interface BorrowFormValues {
    quantity: number;
    dueDate: string;
};