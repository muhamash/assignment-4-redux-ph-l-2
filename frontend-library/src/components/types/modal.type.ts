import type { IBook } from "./books.type";

export interface ModalState {
    [ key: string ]: {
        isOpen: boolean;
        book: IBook | null;
        isConfirm?: boolean
    };
};  

export interface BorrowModalBook extends IBook {
    quantity?: number;
    dueDate?: string;
};