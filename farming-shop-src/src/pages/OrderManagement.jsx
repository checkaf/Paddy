import { useEffect, useState } from 'react';
import { auth } from '../firebase/config.js';
import { listOrdersForUser, updateOrderStatus } from '../utils/db.js';

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        const uid = auth.currentUser?.uid;
        if (uid) {
            listOrdersForUser(uid).then(setOrders);
        }
    }, []);

    const cycle = (status) => (status === 'Pending' ? 'Shipped' : status === 'Shipped' ? 'Delivered' : 'Pending');
    const updateStatusLocal = async (id) => {
        const next = cycle(orders.find(o => o.id === id)?.status || 'Pending');
        await updateOrderStatus(id, next);
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: next } : o)));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Orders</h2>
            <div className="space-y-3">
                {orders.map((o) => (
                    <div key={o.id} className="border rounded p-4 bg-white flex items-center justify-between">
                        <div>
                            <div className="font-medium">{o.product}</div>
                            <div className="text-sm text-gray-600">Quantity: {o.qty}</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm px-2 py-1 rounded border">{o.status}</span>
                            <button className="text-sm bg-gray-800 text-white px-3 py-1 rounded" onClick={() => updateStatusLocal(o.id)}>Update</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


