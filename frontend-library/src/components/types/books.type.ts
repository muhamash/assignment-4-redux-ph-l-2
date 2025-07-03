export export interface IBook {
    id: string;
    _id: string;
    title: string;
    author: string;
    genre: string;
    isbn: string;
    description: string;
    available: boolean;
    copies: number;
    createdAt: string;
    createdBy: {
      _id: string;
      name: string;
      email: string;
      id: string;
    };
};  