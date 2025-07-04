export interface ModalState {
    isOpen: boolean;
    book: IBook | null;
};

export interface BorrowFormValues {
    quantity: number;
    dueDate: Date | undefined;
};