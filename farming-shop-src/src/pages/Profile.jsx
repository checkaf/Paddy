import { useEffect, useState } from 'react';
import { auth } from '../firebase/config.js';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
// no auth profile mutation needed; we store profile in Firestore users doc

const db = getFirestore();

export default function Profile() {
    const user = auth.currentUser;
    const [displayName, setDisplayName] = useState('');
    const [phone, setPhone] = useState('');
    const [nic, setNic] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (!user) return;
        (async () => {
            const snap = await getDoc(doc(db, 'users', user.uid));
            if (snap.exists()) {
                const data = snap.data();
                setLocation(data.location || '');
                setPhone(data.phone || '');
                setNic(data.nic || '');
                setDisplayName(data.name || '');
            }
        })();
    }, [user]);

    const onSave = async (e) => {
        e.preventDefault();
        if (!user) return;
        // Persist all editable fields to users collection only (email/password excluded)
        await setDoc(doc(db, 'users', user.uid), { location, phone, nic, name: displayName }, { merge: true });
        setStatus('Saved');
        setTimeout(() => setStatus(''), 1500);
    };

    if (!user) return null;
    return (
        <div className="max-w-md mx-auto bg-white border rounded p-4 space-y-3">
            <h2 className="text-xl font-semibold">Profile</h2>
            <form onSubmit={onSave} className="space-y-3">
                <input className="w-full border rounded px-3 py-2" placeholder="Full Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                <input className="w-full border rounded px-3 py-2 bg-gray-50" placeholder="Email" value={user?.email || ''} disabled />
                <input className="w-full border rounded px-3 py-2" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <input className="w-full border rounded px-3 py-2" placeholder="NIC" value={nic} onChange={(e) => setNic(e.target.value)} />
                <select className="w-full border rounded px-3 py-2" value={location} onChange={(e) => setLocation(e.target.value)}>
                    <option value="">Select Location</option>
                    <option value="Village A">Village A</option>
                    <option value="Town B">Town B</option>
                </select>
                <button className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
            </form>
            {status && <div className="text-green-700 text-sm">{status}</div>}
        </div>
    );
}
