import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { MdDarkMode, MdLightMode, MdNotifications, MdSearch } from 'react-icons/md';
import './Navbar.css';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-search">
        <MdSearch />
        <input type="text" placeholder="Search books, users..." />
      </div>
      
      <div className="navbar-actions">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <MdDarkMode size={22} /> : <MdLightMode size={22} />}
        </button>
        
        <div className="navbar-icon">
          <MdNotifications size={22} />
          <span className="badge">3</span>
        </div>
        
        <div className="navbar-profile">
          <img src="https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff" alt="Admin" />
          <span>Admin</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
