import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import Card from '../components/Card';
import Table from '../components/Table';
import { FiBook, FiUsers, FiCheckCircle, FiActivity, FiArrowRight } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const { state } = useLibrary();
  const { books, users, transactions } = state;

  const totalBooks = books.reduce((acc, book) => acc + book.quantity, 0);
  const issuedBooks = transactions.filter(t => t.status === 'Issued').length;
  const availableBooks = books.reduce((acc, book) => acc + book.available, 0);

  const recentTransactions = transactions.slice(0, 5);

  const getBookTitle = (id) => books.find(b => b.id === id)?.title || 'Unknown Book';
  const getUserName = (id) => users.find(u => u.id === id)?.name || 'Unknown User';

  return (
    <div className="dashboard">
      <div className="page-header">
        <div className="header-text">
          <h1>Overview</h1>
          <p>Real-time statistics for your library management system.</p>
        </div>
      </div>

      <div className="grid grid-cols-4">
        <Card 
          title="Total Books" 
          value={totalBooks} 
          icon={<FiBook />} 
          trend={12} 
          color="#3b82f6" 
        />
        <Card 
          title="Issued Books" 
          value={issuedBooks} 
          icon={<FiActivity />} 
          trend={5} 
          color="#f59e0b" 
        />
        <Card 
          title="Available Books" 
          value={availableBooks} 
          icon={<FiCheckCircle />} 
          trend={-2} 
          color="#10b981" 
        />
        <Card 
          title="Total Users" 
          value={users.length} 
          icon={<FiUsers />} 
          trend={8} 
          color="#8b5cf6" 
        />
      </div>

      <div className="dashboard-sections">
        <div className="recent-activity-section">
          <div className="section-header">
            <div className="section-title">
              <FiActivity className="section-icon" />
              <h3>Recent Activity</h3>
            </div>
            <button className="btn-secondary btn-sm">
              View Analytics <FiArrowRight size={14} />
            </button>
          </div>
          
          <div className="table-wrapper">
            <Table 
              headers={['Book Name', 'Customer', 'Date Issued', 'Status']}
              data={recentTransactions}
              renderRow={(item) => (
                <tr key={item.id}>
                  <td className="font-medium">{getBookTitle(item.bookId)}</td>
                  <td>{getUserName(item.userId)}</td>
                  <td className="text-muted">{item.issueDate}</td>
                  <td>
                    <span className={`status-pill ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
