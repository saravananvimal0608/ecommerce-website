import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from '../components/otherComponent/Loader';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const UserList = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const navigate = useNavigate();
  const userToDelete = users.find(user => user._id === confirmDeleteId);


  const BASE_URL = process.env.REACT_APP_BASE_URL;


  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
  };

  // Fetch users from backend
  const fetchUsers = async () => {
    setStatus(true)

    const token = localStorage.getItem("token");
    try {

      const res = await axios.get(`${BASE_URL}/user/getusers`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUsers(res.data.data);
      toast.success(res.data.message);
      setStatus(false);
    } catch (error) {
      toast.error(error.response.data.message)
      navigate('/login')
      setStatus(false)

    }
  };
  useEffect(() => {
    fetchUsers();
  }, [refreshFlag]);

  // Handle delete user
  const handleConfirmDelete = async () => {

    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${BASE_URL}/user/delete/${confirmDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(res.data.message);
      setConfirmDeleteId(null);
      setRefreshFlag(prev => !prev);

    } catch (err) {
      if (err.status === 403) {
        toast.error(err.response.data.message)
        navigate('/login')
      }
      else {
        toast.error(err.message)
      }
    }
  };


  if (status) {
    return <Loader />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h2>User List</h2>
        {confirmDeleteId && (
          <div
            className="modal show"
            style={{ display: 'block', position: 'initial' }}
          >
            <Modal show={!!confirmDeleteId} onHide={() => setConfirmDeleteId(null)}>
              <Modal.Header closeButton>
                <Modal.Title>{userToDelete ? `${userToDelete.firstname}` : "delete user"}</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <p>Are you sure you want to delete this user?</p>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleConfirmDelete}>Yes</Button>
                <Button variant="primary" onClick={() => setConfirmDeleteId(null)}>No</Button>
              </Modal.Footer>
            </Modal>
          </div>
        )}

        <Link to="/register" className="para text-black">
          new user
        </Link>
      </div>
      {users.length === 0 ? (
        <p className="text-center text-muted">No users found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>

              <th>Name</th>
              <th>Email</th>
              <th>description</th>
              <th>address</th>
              <th>Mobile</th>
              <th>Avatar</th>
              <th>Actions</th>
              

            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.firstname} {user.lastname}</td>
                <td>{user.email}</td>
                <td>{user.description}</td>
                <td>
                  {Array.isArray(user.address)
                    ? user.address.map((addr) => addr.line).join(", ")
                    : user.address}
                </td>
                <td>{user.mobile}</td>
                <td>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="avatarImg"
                    />
                  ) : (
                    <span className="text-muted">No avatar</span>
                  )}
                </td>

                <td>
                  <Link
                    className="btn btn-primary text-white text-decoration-none me-2"
                    to={`/edit/${user._id}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger text-white me-2"
                    onClick={() => handleDeleteClick(user._id)}
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
