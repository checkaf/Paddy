import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
    const { login, role } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            if (role === 'farmer') navigate('/dashboard/farmer');
            else if (role === 'buyer') navigate('/dashboard/buyer');
            else navigate('/');
        } catch (e) {
            setError(e.message || 'Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold">Login</h2>
            <form onSubmit={onSubmit} className="mt-4 space-y-3">
                <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button className="w-full bg-green-600 text-white rounded px-3 py-2">Login</button>
            </form>
            <p className="mt-3 text-sm text-gray-600">No account? <Link to="/register" className="text-green-700">Register</Link></p>
        </div>
    );
}


