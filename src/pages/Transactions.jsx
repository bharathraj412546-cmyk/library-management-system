import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import { MdSwapHoriz, MdAdd, MdHistory, MdAssignmentReturn, MdSearch } from 'react-icons/md';
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
        <div>
          <h1>Issue / Return Books</h1>
          <p>Track book assignments and manage returns.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsIssueModalOpen(true)}>
          <MdAdd /> Issue New Book
        </button>
      </div>

      <div className="table-controls">
        <div className="search-box">
          <MdSearch />
          <input 
            type="text" 
            placeholder="Search by book or user..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="transactions-content">
        <div className="section-title">
          <MdHistory /> Transaction History
        </div>
        
        <Table 
          headers={['Book', 'Issued To', 'Issue Date', 'Due Date', 'Status', 'Actions']}
          data={displayedTransactions}
          renderRow={(t) => (
            <tr key={t.id}>
              <td><strong>{getBookTitle(t.bookId)}</strong></td>
              <td>{getUserName(t.userId)}</td>
              <td>{t.issueDate}</td>
              <td className={new Date(t.dueDate) < new Date() && t.status === 'Issued' ? 'overdue' : ''}>
                {t.dueDate}
              </td>
              <td>
                <span className={`status-badge ${t.status.toLowerCase()}`}>
                  {t.status}
                </span>
              </td>
              <td>
                {t.status === 'Issued' && (
                  <button className="btn-return" onClick={() => handleReturnBook(t.id)}>
                    <MdAssignmentReturn /> Return
                  </button>
                )}
                {t.status === 'Returned' && (
                  <span className="return-date">Returned on {t.returnDate}</span>
                )}
              </td>
            </tr>
          )}
        />

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Issue Book Modal */}
      <Modal 
        isOpen={isIssueModalOpen} 
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue New Book"
      >
        <form onSubmit={handleIssueBook} className="issue-form">
          <label>Select User</label>
          <select 
            required 
            value={issueData.userId}
            onChange={e => setIssueData({...issueData, userId: e.target.value})}
          >
            <option value="">-- Choose User --</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
            ))}
          </select>

          <label>Select Book</label>
          <select 
            required 
            value={issueData.bookId}
            onChange={e => setIssueData({...issueData, bookId: e.target.value})}
          >
            <option value="">-- Choose Book --</option>
            {books.filter(b => b.available > 0).map(book => (
              <option key={book.id} value={book.id}>{book.title} ({book.available} available)</option>
            ))}
          </select>

          <label>Due Date</label>
          <input 
            type="date" 
            required 
            value={issueData.dueDate}
            onChange={e => setIssueData({...issueData, dueDate: e.target.value})}
          />

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setIsIssueModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Issue Book</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Transactions;
