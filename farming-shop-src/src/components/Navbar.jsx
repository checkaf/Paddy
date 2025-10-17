import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { getFirestore, collection, onSnapshot, query, where } from 'firebase/firestore';

export default function Navbar() {
    const { user, role, logout, dictionary, language } = useAuth();
    const t = dictionary[language];
    const [notifications, setNotifications] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (!user) return;
        const db = getFirestore();
        // Listen for orders delivered for this user
        const q = query(collection(db, 'orders'), where('userUid', '==', user.uid), where('status', '==', 'Delivered'));
        const unsub = onSnapshot(q, (snap) => {
            const notes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            if (notes.length) {
                setNotifications(notes);
                setShowPopup(true);
            }
        });
        return () => unsub();
    }, [user]);

    return (
        <header className="bg-white/70 backdrop-blur border-b border-gray-200 sticky top-0 z-40">
            <div className="container-px mx-auto py-3 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-green-700">Farming Shop SRC</Link>
                <nav className="flex items-center gap-4">
                    {(!user || role !== 'farmer') && (
                        <NavLink to="/" className="text-sm text-gray-700 hover:text-green-700">{t.home}</NavLink>
                    )}
                    {user && role === 'farmer' && (
                        <NavLink to="/home/farmer" className="text-sm text-gray-700 hover:text-green-700">{t.dashboard}</NavLink>
                    )}
                    {user && (
                        <NavLink to="/orders" className="text-sm text-gray-700 hover:text-green-700">{t.orders}</NavLink>
                    )}
                    {user && <NavLink to="/profile" className="text-sm text-gray-700 hover:text-green-700">Profile</NavLink>}
                    {user && (
                        <button className="relative" onClick={() => setShowPopup((v) => !v)} aria-label="Notifications">
                            <span className="inline-block w-5 h-5">🔔</span>
                            {!!notifications.length && <span className="absolute -top-1 -right-1 text-[10px] bg-red-600 text-white rounded-full px-1">{notifications.length}</span>}
                        </button>
                    )}
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
            {showPopup && !!notifications.length && (
                <div className="fixed right-4 top-16 bg-white border rounded shadow-lg w-80 z-50">
                    <div className="p-3 border-b flex items-center justify-between">
                        <div className="font-medium">Notifications</div>
                        <button className="text-sm text-gray-600" onClick={() => setShowPopup(false)}>Close</button>
                    </div>
                    <div className="max-h-80 overflow-auto">
                        {notifications.map(n => (
                            <div key={n.id} className="p-3 border-b last:border-b-0 text-sm">
                                Order for <span className="font-medium">{n.productName}</span> was delivered.
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}


