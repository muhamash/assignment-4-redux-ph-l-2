export interface IBook {
    id?: string;
    _id?: string;
    title: string;
    author: string;
    genre: string;
    isbn: string;
    description: string;
    available: boolean;
    copies: number;
    createdAt?: string;
    createdBy?: {
      _id: string;
      name: string;
      email: string;
      id: string;
    };
};  

export interface BookQueryParams {
  filter?: string;
  sortBy?: string;
  sort?: "asc" | "desc";
  limit?: string;
  page?: string;
  userId?: string;
};

export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ICreateBookInput {
  title: string;
  author: string;
  genre: string;
  isbn: string;
  description?: string;
  copies?: number;
  createdBy: string; 
  available: boolean;
}

export interface IUpdateBookInput {
  title?: string;
  author?: string;
  genre?: string;
  isbn?: string;
  description?: string;
  copies?: number;
  available?: boolean;
}

export interface IBorrowSummaryItem {
  bookId: string;
  title: string;
  totalQuantity: number;
}

export interface PaginationState {
  page: number;
  limit: number;
  tab: "all" | "my";
}