import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MdDashboard, 
  MdLibraryBooks, 
  MdPeople, 
  MdSwapHoriz, 
  MdSettings 
} from 'react-icons/md';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <MdLibraryBooks size={28} />
        <span>LibManager</span>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <MdDashboard />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/books" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <MdLibraryBooks />
          <span>Books</span>
        </NavLink>
        
        <NavLink to="/users" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <MdPeople />
          <span>Users</span>
        </NavLink>
        
        <NavLink to="/transactions" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <MdSwapHoriz />
          <span>Issue / Return</span>
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <div className="nav-item">
          <MdSettings />
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
