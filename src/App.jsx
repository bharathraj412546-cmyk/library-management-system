import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LibraryProvider } from './context/LibraryContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Users from './pages/Users';
import Transactions from './pages/Transactions';

function App() {
  return (
    <ThemeProvider>
      <LibraryProvider>
        <Router>
          <div className="app-container">
            <Sidebar />
            <div className="main-content">
              <Navbar />
              <div className="page-container fade-in">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/books" element={<Books />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/transactions" element={<Transactions />} />
                </Routes>
              </div>
            </div>
          </div>
        </Router>
      </LibraryProvider>
    </ThemeProvider>
  );
}

export default App;
