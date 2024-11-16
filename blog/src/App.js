import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Table } from 'react-bootstrap';

const App = () => {
  const [users, setUsers] = useState([]); // 사용자 데이터 상태
  const [showModal, setShowModal] = useState(false); // 모달 상태
  const [currentUser, setCurrentUser] = useState({ id: '', name: '', email: '' }); // 현재 선택된 사용자

  // 초기 데이터 로드 (JSON Server API 활용)
  useEffect(() => {
    fetch('http://localhost:3000/Users')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  // 사용자 추가/수정 저장 핸들러
  const handleSave = () => {
    if (currentUser.id) {
      // 기존 사용자 수정
      fetch(`http://localhost:3000/Users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentUser),
      }).then(() => {
        setUsers((prev) =>
          prev.map((user) => (user.id === currentUser.id ? currentUser : user))
        );
        setShowModal(false);
      });
    } else {
      // 새 사용자 추가
      fetch('http://localhost:3000/Users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentUser),
      })
        .then((res) => res.json())
        .then((newUser) => {
          setUsers((prev) => [...prev, newUser]);
          setShowModal(false);
        });
    }
  };

  // 사용자 삭제 핸들러
  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      fetch(`http://localhost:3000/Users/${id}`, { method: 'DELETE' }).then(() => {
        setUsers((prev) => prev.filter((user) => user.id !== id));
      });
    }
  };

  // 모달 열기 (새 사용자 추가 또는 기존 사용자 수정)
  const handleOpenModal = (user = { id: '', name: '', email: '' }) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">React CRUD Page</h1>

      {/* 사용자 리스트 테이블 */}
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleOpenModal(user)}
                >
                  Edit
                </Button>{' '}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* 사용자 추가 버튼 */}
      <Button onClick={() => handleOpenModal()} className="btn btn-primary">
        Add User
      </Button>

      {/* 사용자 추가/수정 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentUser.id ? 'Edit User' : 'Add User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={currentUser.name}
                onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={currentUser.email}
                onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;
