import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiGrid, 
  FiBook, 
  FiUsers, 
  FiRepeat, 
  FiSettings 
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <FiBook size={24} />
        <span>LibManager</span>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <FiGrid size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/books" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <FiBook size={20} />
          <span>Books</span>
        </NavLink>
        
        <NavLink to="/users" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <FiUsers size={20} />
          <span>Users</span>
        </NavLink>
        
        <NavLink to="/transactions" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <FiRepeat size={20} />
          <span>Issue / Return</span>
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <div className="nav-item">
          <FiSettings size={20} />
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
