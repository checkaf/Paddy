import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
    const { register } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [nic, setNic] = useState('');
    const [location, setLocation] = useState('');
    const [role, setRole] = useState('farmer');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(email, password, role, { name, phone, nic, location });
            navigate(role === 'farmer' ? '/home/farmer' : '/home/buyer');
        } catch (e) {
            setError(e.message || 'Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold">Create account</h2>
            <form onSubmit={onSubmit} className="mt-4 space-y-3">
                <input className="w-full border rounded px-3 py-2" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input className="w-full border rounded px-3 py-2" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <input className="w-full border rounded px-3 py-2" placeholder="NIC" value={nic} onChange={(e) => setNic(e.target.value)} />
                <select className="w-full border rounded px-3 py-2" value={location} onChange={(e) => setLocation(e.target.value)}>
                    <option value="">Select Location</option>
                    <option value="Village A">Village A</option>
                    <option value="Town B">Town B</option>
                </select>
                <select className="w-full border rounded px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="farmer">Farmer</option>
                    <option value="buyer">Buyer</option>
                </select>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button className="w-full bg-green-600 text-white rounded px-3 py-2">Register</button>
            </form>
            <p className="mt-3 text-sm text-gray-600">Have an account? <Link to="/login" className="text-green-700">Login</Link></p>
        </div>
    );
}


