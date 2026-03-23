import React, { createContext, useContext, useReducer, useEffect } from 'react';

const LibraryContext = createContext();

const initialState = {
  books: JSON.parse(localStorage.getItem('books')) || [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', quantity: 5, available: 5 },
    { id: 2, title: '1984', author: 'George Orwell', category: 'Dystopian', quantity: 3, available: 3 },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', quantity: 4, available: 4 },
  ],
  users: JSON.parse(localStorage.getItem('users')) || [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ],
  transactions: JSON.parse(localStorage.getItem('transactions')) || [],
  loading: false,
};

const libraryReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_BOOK':
      return { ...state, books: [...state.books, { ...action.payload, id: Date.now(), available: action.payload.quantity }] };
    case 'UPDATE_BOOK':
      return { 
        ...state, 
        books: state.books.map(book => book.id === action.payload.id ? action.payload : book) 
      };
    case 'DELETE_BOOK':
      return { ...state, books: state.books.filter(book => book.id !== action.payload) };
    
    case 'ADD_USER':
      return { ...state, users: [...state.users, { ...action.payload, id: Date.now() }] };
    case 'UPDATE_USER':
      return { 
        ...state, 
        users: state.users.map(user => user.id === action.payload.id ? action.payload : user) 
      };
    case 'DELETE_USER':
      return { ...state, users: state.users.filter(user => user.id !== action.payload) };

    case 'ISSUE_BOOK': {
      const { userId, bookId, dueDate } = action.payload;
      const bookIndex = state.books.findIndex(b => b.id === bookId);
      if (bookIndex === -1 || state.books[bookIndex].available <= 0) return state;

      const newBooks = [...state.books];
      newBooks[bookIndex] = { ...newBooks[bookIndex], available: newBooks[bookIndex].available - 1 };

      const newTransaction = {
        id: Date.now(),
        userId,
        bookId,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate,
        returnDate: null,
        status: 'Issued'
      };

      return { ...state, books: newBooks, transactions: [newTransaction, ...state.transactions] };
    }

    case 'RETURN_BOOK': {
      const transactionId = action.payload;
      const transactionIndex = state.transactions.findIndex(t => t.id === transactionId);
      if (transactionIndex === -1 || state.transactions[transactionIndex].status === 'Returned') return state;

      const transaction = state.transactions[transactionIndex];
      const bookIndex = state.books.findIndex(b => b.id === transaction.bookId);

      const newTransactions = [...state.transactions];
      newTransactions[transactionIndex] = { ...transaction, returnDate: new Date().toISOString().split('T')[0], status: 'Returned' };

      const newBooks = [...state.books];
      if (bookIndex !== -1) {
        newBooks[bookIndex] = { ...newBooks[bookIndex], available: newBooks[bookIndex].available + 1 };
      }

      return { ...state, transactions: newTransactions, books: newBooks };
    }

    default:
      return state;
  }
};

export const LibraryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(libraryReducer, initialState);

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(state.books));
    localStorage.setItem('users', JSON.stringify(state.users));
    localStorage.setItem('transactions', JSON.stringify(state.transactions));
  }, [state.books, state.users, state.transactions]);

  return (
    <LibraryContext.Provider value={{ state, dispatch }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => useContext(LibraryContext);
