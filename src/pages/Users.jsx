import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiMail, FiUser } from 'react-icons/fi';
import './Users.css';

const Users = () => {
  const { state, dispatch } = useLibrary();
  const { users } = state;

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [formData, setFormData] = useState({ name: '', email: '' });

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const displayedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      dispatch({ type: 'UPDATE_USER', payload: { ...editingUser, ...formData } });
    } else {
      dispatch({ type: 'ADD_USER', payload: formData });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_USER', payload: userToDelete.id });
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  return (
    <div className="users-page">
      <div className="page-header">
        <div className="header-text">
          <h1>Member Directory</h1>
          <p>Manage and track all registered library members.</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <FiPlus /> Register Member
        </button>
      </div>

      <div className="search-controls">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name, email, or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper-main">
        <Table 
          headers={['Member Name', 'Contact Info', 'Member ID', 'Actions']}
          data={displayedUsers}
          renderRow={(user) => (
            <tr key={user.id}>
              <td>
                <div className="user-profile-cell">
                  <div className="user-avatar-small">
                    <FiUser size={14} />
                  </div>
                  <span className="user-name-text">{user.name}</span>
                </div>
              </td>
              <td>
                <div className="user-email-cell">
                  <FiMail size={14} className="email-icon" />
                  <span>{user.email}</span>
                </div>
              </td>
              <td>
                <code className="user-id-badge">#USR-{user.id}</code>
              </td>
              <td>
                <div className="action-buttons">
                  <button className="btn-icon" onClick={() => handleOpenModal(user)} title="Edit Member">
                    <FiEdit2 size={16} />
                  </button>
                  <button className="btn-icon delete" onClick={() => {
                    setUserToDelete(user);
                    setIsDeleteModalOpen(true);
                  }} title="Remove Member">
                    <FiTrash2 size={16} />
                  </button>
                </div>
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

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Update Member Profile' : 'Register New Member'}
      >
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-field">
            <label>Full Name</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="form-field">
            <label>Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="e.g. john@example.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">
              {editingUser ? 'Save Updates' : 'Complete Registration'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Removal"
      >
        <div className="delete-confirmation">
          <p>Are you sure you want to remove member <strong>{userToDelete?.name}</strong>? All associated history will be impacted.</p>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Dismiss</button>
            <button className="btn-danger" onClick={handleDelete}>Confirm Removal</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
