import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/config.js';

const AuthContext = createContext(null);

const defaultDictionary = {
    en: { home: 'Home', dashboard: 'Dashboard', orders: 'Orders', login: 'Login', logout: 'Logout', register: 'Register' },
    ta: { home: 'முகப்பு', dashboard: 'டாஷ்போர்டு', orders: 'ஆர்டர்கள்', login: 'உள் நுழை', logout: 'வெளியேறு', register: 'பதிவு' },
    si: { home: 'මුල්', dashboard: 'පුවරුව', orders: 'ඇණවුම්', login: 'ප්‍රවිෂ්ට වන්න', logout: 'පිටවන්න', register: 'ලියාපදිංචි' },
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // 'farmer' | 'buyer'
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState('en');
    const [dictionary] = useState(defaultDictionary);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            if (u?.photoURL === 'farmer' || u?.photoURL === 'buyer') {
                setRole(u.photoURL);
            } else {
                setRole(null);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const login = async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const register = async (email, password, chosenRole) => {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        // Use photoURL to store simple role flag to avoid extra Firestore setup
        await updateProfile(cred.user, { photoURL: chosenRole });
    };

    const logout = async () => {
        await signOut(auth);
    };

    const value = useMemo(() => ({ user, role, loading, login, register, logout, language, setLanguage, dictionary }), [user, role, loading, language, dictionary]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}


