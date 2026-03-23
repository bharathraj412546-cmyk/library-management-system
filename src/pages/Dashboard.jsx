import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import Card from '../components/Card';
import Table from '../components/Table';
import { MdLibraryBooks, MdPeople, MdAssignmentTurnedIn, MdHistory } from 'react-icons/md';
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
        <h1>Library Dashboard</h1>
        <p>Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-4">
        <Card 
          title="Total Books" 
          value={totalBooks} 
          icon={<MdLibraryBooks />} 
          trend={12} 
          color="#4f46e5" 
        />
        <Card 
          title="Issued Books" 
          value={issuedBooks} 
          icon={<MdAssignmentTurnedIn />} 
          trend={5} 
          color="#f59e0b" 
        />
        <Card 
          title="Available Books" 
          value={availableBooks} 
          icon={<MdAssignmentTurnedIn />} 
          trend={-2} 
          color="#10b981" 
        />
        <Card 
          title="Total Users" 
          value={users.length} 
          icon={<MdPeople />} 
          trend={8} 
          color="#3b82f6" 
        />
      </div>

      <div className="dashboard-content grid grid-cols-1">
        <div className="recent-activity">
          <div className="section-header">
            <h3><MdHistory /> Recent Activity</h3>
            <button className="btn-text">View All</button>
          </div>
          
          <Table 
            headers={['Book', 'User', 'Date', 'Status']}
            data={recentTransactions}
            renderRow={(item) => (
              <tr key={item.id}>
                <td>{getBookTitle(item.bookId)}</td>
                <td>{getUserName(item.userId)}</td>
                <td>{item.issueDate}</td>
                <td>
                  <span className={`status-badge ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
