import { useEffect, useState } from 'react';
import { fetchAiPriceSuggestion } from '../utils/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { addProduct, listProducts, removeProduct } from '../utils/db.js';
import { auth } from '../firebase/config.js';

export default function FarmerDashboard() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: '', category: '', imageUrl: '', quantity: 0, location: '' });
    const [aiPrice, setAiPrice] = useState(null);

    useEffect(() => {
        if (form.name && form.quantity) {
            fetchAiPriceSuggestion({ name: form.name, category: form.category, quantity: Number(form.quantity) })
                .then((res) => setAiPrice(res.price))
                .catch(() => setAiPrice(null));
        } else {
            setAiPrice(null);
        }
    }, [form.name, form.category, form.quantity]);

    useEffect(() => {
        (async () => {
            const all = await listProducts();
            const uid = auth.currentUser?.uid;
            const mine = uid ? all.filter(p => p.ownerUid === uid) : all;
            setProducts(mine.slice(0, 6));
        })();
    }, []);

    const refresh = async () => {
        const all = await listProducts();
        const uid = auth.currentUser?.uid;
        const mine = uid ? all.filter(p => p.ownerUid === uid) : all;
        setProducts(mine.slice(0, 6));
    };

    const onAddProduct = async (e) => {
        e.preventDefault();
        await addProduct({ ...form, quantity: Number(form.quantity), aiPrice });
        setForm({ name: '', category: '', imageUrl: '', quantity: 0, location: '' });
        setAiPrice(null);
        await refresh();
    };

    const onDelete = async (id) => {
        await removeProduct(id);
        await refresh();
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold">Farmer Dashboard</h2>
            <form onSubmit={onAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white border rounded-lg p-4">
                <input className="border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="border rounded px-3 py-2" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                <input className="border rounded px-3 py-2" placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                <input className="border rounded px-3 py-2" placeholder="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                <select className="border rounded px-3 py-2" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
                    <option value="">Select Location</option>
                    <option value="Village A">Village A</option>
                    <option value="Town B">Town B</option>
                </select>
                <div className="flex items-center gap-2">
                    <button className="bg-green-600 text-white rounded px-4 py-2">Add Product</button>
                    {aiPrice && <span className="text-sm text-green-700">AI suggested: LKR {aiPrice}</span>}
                </div>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                    <div key={p.id} className="relative">
                        <ProductCard product={p} />
                        <button onClick={() => onDelete(p.id)} className="absolute top-2 right-2 bg-white/90 border text-xs px-2 py-1 rounded">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}


