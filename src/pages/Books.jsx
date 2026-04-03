import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import './Books.css';

const Books = () => {
  const { state, dispatch } = useLibrary();
  const { books } = state;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    quantity: 1
  });

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'All' || book.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const displayedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = ['All', ...new Set(books.map(b => b.category))];

  const handleOpenModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        category: book.category,
        quantity: book.quantity
      });
    } else {
      setEditingBook(null);
      setFormData({ title: '', author: '', category: '', quantity: 1 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBook) {
      dispatch({ type: 'UPDATE_BOOK', payload: { ...editingBook, ...formData, available: editingBook.available + (formData.quantity - editingBook.quantity) } });
    } else {
      dispatch({ type: 'ADD_BOOK', payload: formData });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_BOOK', payload: bookToDelete.id });
    setIsDeleteModalOpen(false);
    setBookToDelete(null);
  };

  return (
    <div className="books-page">
      <div className="page-header">
        <div className="header-text">
          <h1>Books Collection</h1>
          <p>Organize and manage your library's assets efficiently.</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <FiPlus /> Add New Record
        </button>
      </div>

      <div className="inventory-controls">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by title, author, or ISBN..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-dropdown">
          <FiFilter className="filter-icon" />
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-wrapper-main">
        <Table 
          headers={['Book Information', 'Category', 'Quantity', 'Stock Status', 'Actions']}
          data={displayedBooks}
          renderRow={(book) => (
            <tr key={book.id}>
              <td>
                <div className="book-info-cell">
                  <span className="book-title-main">{book.title}</span>
                  <span className="book-author-sub">{book.author}</span>
                </div>
              </td>
              <td>
                <span className="category-pill">{book.category}</span>
              </td>
              <td className="text-center">{book.quantity}</td>
              <td>
                <span className={`stock-indicator ${book.available > 0 ? 'in-stock' : 'low-stock'}`}>
                  {book.available} Available
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button className="btn-icon" onClick={() => handleOpenModal(book)} title="Edit Record">
                    <FiEdit2 size={16} />
                  </button>
                  <button className="btn-icon delete" onClick={() => {
                    setBookToDelete(book);
                    setIsDeleteModalOpen(true);
                  }} title="Delete Record">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingBook ? 'Update Book Details' : 'Register New Book'}
      >
        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-field">
            <label>Title</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. The Great Gatsby"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          
          <div className="form-field">
            <label>Author</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. F. Scott Fitzgerald"
              value={formData.author}
              onChange={e => setFormData({...formData, author: e.target.value})}
            />
          </div>
          
          <div className="form-grid">
            <div className="form-field">
              <label>Category</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Fiction"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              />
            </div>
            <div className="form-field">
              <label>Inventory Count</label>
              <input 
                type="number" 
                required 
                min="1"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">
              {editingBook ? 'Save Changes' : 'Initialize Record'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="delete-confirmation">
          <p>This action will permanently remove <strong>{bookToDelete?.title}</strong> from the database. This cannot be undone.</p>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Dismiss</button>
            <button className="btn-danger" onClick={handleDelete}>Confirm Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Books;
