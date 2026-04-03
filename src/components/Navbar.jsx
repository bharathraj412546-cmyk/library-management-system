import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiBell, FiSearch } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-search">
        <FiSearch size={18} />
        <input type="text" placeholder="Search for books or records..." />
      </div>
      
      <div className="navbar-actions">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
        </button>
        
        <div className="navbar-icon" title="Notifications">
          <FiBell size={20} />
          <span className="badge">3</span>
        </div>
        
        <div className="navbar-profile">
          <img src="https://ui-avatars.com/api/?name=Admin&background=eff6ff&color=3b82f6&bold=true" alt="Admin" />
          <span>Admin</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
