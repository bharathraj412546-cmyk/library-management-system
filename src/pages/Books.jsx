import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdFilterList } from 'react-icons/md';
import './Books.css';

const Books = () => {
  const { state, dispatch } = useLibrary();
  const { books } = state;

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    quantity: 1
  });

  // Filter and Search Logic
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'All' || book.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  // Pagination Logic
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
        <div>
          <h1>Books Management</h1>
          <p>Manage your library's collection of books.</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <MdAdd /> Add New Book
        </button>
      </div>

      <div className="table-controls">
        <div className="search-box">
          <MdSearch />
          <input 
            type="text" 
            placeholder="Search by title or author..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-box">
          <MdFilterList />
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

      <Table 
        headers={['Title', 'Author', 'Category', 'Qty', 'Avail', 'Actions']}
        data={displayedBooks}
        renderRow={(book) => (
          <tr key={book.id}>
            <td><strong>{book.title}</strong></td>
            <td>{book.author}</td>
            <td><span className="category-tag">{book.category}</span></td>
            <td>{book.quantity}</td>
            <td>
              <span className={`stock-status ${book.available > 0 ? 'instock' : 'outstock'}`}>
                {book.available}
              </span>
            </td>
            <td>
              <div className="action-buttons">
                <button className="btn-icon edit" onClick={() => handleOpenModal(book)}>
                  <MdEdit />
                </button>
                <button className="btn-icon delete" onClick={() => {
                  setBookToDelete(book);
                  setIsDeleteModalOpen(true);
                }}>
                  <MdDelete />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingBook ? 'Edit Book' : 'Add New Book'}
      >
        <form onSubmit={handleSubmit} className="book-form">
          <label>Book Title</label>
          <input 
            type="text" 
            required 
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
          
          <label>Author</label>
          <input 
            type="text" 
            required 
            value={formData.author}
            onChange={e => setFormData({...formData, author: e.target.value})}
          />
          
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <input 
                type="text" 
                required 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input 
                type="number" 
                required 
                min="1"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">
              {editingBook ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <p>Are you sure you want to delete <strong>{bookToDelete?.title}</strong>? This action cannot be undone.</p>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
          <button className="btn-danger" onClick={handleDelete}>Delete Book</button>
        </div>
      </Modal>
    </div>
  );
};

export default Books;
