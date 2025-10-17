import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { listProducts, placeOrder } from '../utils/db.js';

export default function BuyerDashboard() {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState([]);
    useEffect(() => { listProducts().then(setProducts); }, []);

    const filtered = useMemo(() => {
        const q = query.toLowerCase();
        return products.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }, [query, products]);

    const onOrder = async (product) => {
        await placeOrder({ productId: product.id, qty: 1 });
        alert(`Order placed for ${product.name}`);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-4">
            <h2 className="text-2xl font-semibold">Buyer Dashboard</h2>
            <input className="w-full border rounded px-3 py-2" placeholder="Search products" value={query} onChange={(e) => setQuery(e.target.value)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} onOrder={onOrder} />
                ))}
            </div>
        </div>
    );
}


