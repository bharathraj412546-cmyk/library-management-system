import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdEmail, MdPerson } from 'react-icons/md';
import './Users.css';

const Users = () => {
  const { state, dispatch } = useLibrary();
  const { users } = state;

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
        <div>
          <h1>Users Management</h1>
          <p>Manage library members and their details.</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <MdAdd /> Add New User
        </button>
      </div>

      <div className="table-controls">
        <div className="search-box">
          <MdSearch />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Table 
        headers={['Name', 'Email', 'ID', 'Actions']}
        data={displayedUsers}
        renderRow={(user) => (
          <tr key={user.id}>
            <td>
              <div className="user-info">
                <div className="user-avatar">
                  <MdPerson />
                </div>
                <strong>{user.name}</strong>
              </div>
            </td>
            <td>
              <div className="email-link">
                <MdEmail /> {user.email}
              </div>
            </td>
            <td>#USR-{user.id}</td>
            <td>
              <div className="action-buttons">
                <button className="btn-icon edit" onClick={() => handleOpenModal(user)}>
                  <MdEdit />
                </button>
                <button className="btn-icon delete" onClick={() => {
                  setUserToDelete(user);
                  setIsDeleteModalOpen(true);
                }}>
                  <MdDelete />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <form onSubmit={handleSubmit} className="user-form">
          <label>Full Name</label>
          <input 
            type="text" 
            required 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          
          <label>Email Address</label>
          <input 
            type="email" 
            required 
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">
              {editingUser ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <p>Are you sure you want to delete user <strong>{userToDelete?.name}</strong>? All their transaction history will be affected.</p>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
          <button className="btn-danger" onClick={handleDelete}>Delete User</button>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
