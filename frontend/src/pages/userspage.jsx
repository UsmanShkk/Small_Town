import { useEffect, useState } from 'react';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../../api/users';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Customer' });
  const [editId, setEditId] = useState(null);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateUser(editId, form);
        setEditId(null);
      } else {
        await createUser(form);
      }
      setForm({ name: '', email: '', password: '', role: 'Customer' });
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this user?')) {
      try {
        await deleteUser(id);
        loadUsers();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const startEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      password: '', // don't prefill password
      role: user.role,
    });
    setEditId(user._id);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User Management</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input type="text" placeholder="Name" className="border p-2 w-full"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="email" placeholder="Email" className="border p-2 w-full"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" className="border p-2 w-full"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="border p-2 w-full"
          value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="Customer">Customer</option>
          <option value="Admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editId ? 'Update User' : 'Create User'}
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border">
                <button onClick={() => startEdit(u)} className="text-blue-600 mr-2">Edit</button>
                <button onClick={() => handleDelete(u._id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
