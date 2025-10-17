import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';

export default function Navbar() {
    const { user, role, logout, dictionary, language } = useAuth();
    const t = dictionary[language];

    return (
        <header className="bg-white/70 backdrop-blur border-b border-gray-200 sticky top-0 z-40">
            <div className="container-px mx-auto py-3 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-green-700">Farming Shop SRC</Link>
                <nav className="flex items-center gap-4">
                    <NavLink to="/" className="text-sm text-gray-700 hover:text-green-700">{t.home}</NavLink>
                    {user && role === 'farmer' && (
                        <NavLink to="/dashboard/farmer" className="text-sm text-gray-700 hover:text-green-700">{t.dashboard}</NavLink>
                    )}
                    {user && (
                        <NavLink to="/orders" className="text-sm text-gray-700 hover:text-green-700">{t.orders}</NavLink>
                    )}
                    {user && <NavLink to="/profile" className="text-sm text-gray-700 hover:text-green-700">Profile</NavLink>}
                    <LanguageSwitcher />
                    {!user ? (
                        <div className="flex items-center gap-2">
                            <NavLink to="/login" className="text-sm text-gray-700 hover:text-green-700">{t.login}</NavLink>
                            <NavLink to="/register" className="text-sm text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded">{t.register}</NavLink>
                        </div>
                    ) : (
                        <button onClick={logout} className="text-sm text-white bg-gray-800 hover:bg-gray-900 px-3 py-1 rounded">{t.logout}</button>
                    )}
                </nav>
            </div>
        </header>
    );
}


