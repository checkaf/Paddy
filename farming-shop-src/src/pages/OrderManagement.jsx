import { useEffect, useState } from 'react';
import { auth } from '../firebase/config.js';
import { listOrdersForUser, updateOrderStatus, cancelOrder, getProduct } from '../utils/db.js';

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        const uid = auth.currentUser?.uid;
        if (uid) {
            listOrdersForUser(uid).then(setOrders);
        }
    }, []);

    const onCancel = async (id) => {
        await cancelOrder(id);
        setOrders(prev => prev.filter(o => o.id !== id));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Orders</h2>
            <div className="space-y-3">
                {orders.map((o) => (
                    <div key={o.id} className="border rounded p-4 bg-white">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <div className="font-medium">{o.productName}</div>
                                <div className="text-sm text-gray-600">Category: {o.category}</div>
                                <div className="text-sm text-gray-600">Location: {o.location}</div>
                                <div className="text-sm text-gray-600">Quantity: {o.qty}</div>
                                {o.unitPrice != null && (
                                    <div className="text-sm text-gray-600">Unit Price: LKR {o.unitPrice}</div>
                                )}
                                {o.totalPrice != null && (
                                    <div className="text-sm text-gray-800 font-medium">Total: LKR {o.totalPrice}</div>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm px-2 py-1 rounded border">{o.status}</span>
                                <button className="text-sm bg-red-600 text-white px-3 py-1 rounded" onClick={() => onCancel(o.id)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                ))}
                {!orders.length && <div className="text-sm text-gray-500">No orders yet.</div>}
            </div>
        </div>
    );
}


