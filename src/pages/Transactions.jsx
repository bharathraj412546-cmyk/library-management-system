import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import { FiPlus, FiClock, FiCheckCircle, FiSearch, FiRepeat } from 'react-icons/fi';
import './Transactions.css';

const Transactions = () => {
  const { state, dispatch } = useLibrary();
  const { transactions, books, users } = state;

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueData, setIssueData] = useState({
    userId: '',
    bookId: '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const filteredTransactions = transactions.filter(t => {
    const bookTitle = books.find(b => b.id === t.bookId)?.title || '';
    const userName = users.find(u => u.id === t.userId)?.name || '';
    return bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
           userName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const displayedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleIssueBook = (e) => {
    e.preventDefault();
    dispatch({ 
      type: 'ISSUE_BOOK', 
      payload: { 
        userId: parseInt(issueData.userId), 
        bookId: parseInt(issueData.bookId), 
        dueDate: issueData.dueDate 
      } 
    });
    setIsIssueModalOpen(false);
    setIssueData({
      userId: '',
      bookId: '',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  };

  const handleReturnBook = (transactionId) => {
    dispatch({ type: 'RETURN_BOOK', payload: transactionId });
  };

  const getBookTitle = (id) => books.find(b => b.id === id)?.title || 'Unknown Book';
  const getUserName = (id) => users.find(u => u.id === id)?.name || 'Unknown User';

  return (
    <div className="transactions-page">
      <div className="page-header">
        <div className="header-text">
          <h1>Lending Services</h1>
          <p>Monitor book circulations and manage member returns.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsIssueModalOpen(true)}>
          <FiPlus /> Issue New Book
        </button>
      </div>

      <div className="circulation-controls">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by book title or member name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper-main">
        <div className="section-header-lite">
          <FiRepeat size={14} />
          <span>Active & Historical Records</span>
        </div>
        
        <Table 
          headers={['Book Asset', 'Borrowed By', 'Timeline', 'Status', 'Actions']}
          data={displayedTransactions}
          renderRow={(t) => (
            <tr key={t.id}>
              <td>
                <div className="asset-cell">
                  <strong>{getBookTitle(t.bookId)}</strong>
                </div>
              </td>
              <td>{getUserName(t.userId)}</td>
              <td>
                <div className="timeline-cell">
                  <span className="date-main">Due: {t.dueDate}</span>
                  <span className="date-sub">Issued: {t.issueDate}</span>
                </div>
              </td>
              <td>
                <span className={`status-pill ${t.status.toLowerCase()}`}>
                  {t.status}
                </span>
              </td>
              <td>
                {t.status === 'Issued' ? (
                  <button className="btn-action-return" onClick={() => handleReturnBook(t.id)}>
                    <FiCheckCircle size={14} /> Mark Returned
                  </button>
                ) : (
                  <span className="return-timestamp">Returned on {t.returnDate}</span>
                )}
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

      {/* Issue Book Modal */}
      <Modal 
        isOpen={isIssueModalOpen} 
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue Asset to Member"
      >
        <form onSubmit={handleIssueBook} className="issue-form">
          <div className="form-field">
            <label>Member Selection</label>
            <select 
              required 
              value={issueData.userId}
              onChange={e => setIssueData({...issueData, userId: e.target.value})}
            >
              <option value="">-- Choose Member --</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Asset Selection</label>
            <select 
              required 
              value={issueData.bookId}
              onChange={e => setIssueData({...issueData, bookId: e.target.value})}
            >
              <option value="">-- Choose Book --</option>
              {books.filter(b => b.available > 0).map(book => (
                <option key={book.id} value={book.id}>{book.title} ({book.available} in stock)</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Due Date</label>
            <input 
              type="date" 
              required 
              value={issueData.dueDate}
              onChange={e => setIssueData({...issueData, dueDate: e.target.value})}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsIssueModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Initialize Lending</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Transactions;
