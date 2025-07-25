import { useState } from 'react';
import { loginUser } from '../../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(form);
      alert('Login successful!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-6">
      <div className="w-full max-w-md space-y-8">
        <h2 className="text-center text-3xl font-bold">Sign in to your account</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="space-y-4">
            <input name="email" type="email" autoComplete="email" required
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded"
            />
            <input name="password" type="password" autoComplete="current-password" required
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div>
            <button type="submit"
              className="group relative flex w-full justify-center rounded bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-700">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
