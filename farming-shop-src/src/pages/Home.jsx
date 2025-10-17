import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useEffect, useMemo, useState } from 'react';
import { listProducts, placeOrder } from '../utils/db.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Home() {
    const { user, role } = useAuth();
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState({ category: '', location: '', sort: 'latest' });
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (role === 'buyer') {
            listProducts().then(setProducts);
        }
    }, [role]);

    const filtered = useMemo(() => {
        let list = [...products];
        const q = query.toLowerCase();
        if (q) list = list.filter(p => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
        if (filters.category) list = list.filter(p => p.category === filters.category);
        if (filters.location) list = list.filter(p => p.location === filters.location);
        if (filters.sort === 'latest') list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        if (filters.sort === 'oldest') list.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        if (filters.sort === 'low') list.sort((a, b) => (a.price || 0) - (b.price || 0));
        if (filters.sort === 'high') list.sort((a, b) => (b.price || 0) - (a.price || 0));
        if (filters.sort === 'rating') list.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
        return list;
    }, [products, query, filters]);

    if (!user) {
        return (
            <div className="max-w-5xl mx-auto">
                <section className="text-center py-12">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome to Farming Shop SRC</h1>
                    <p className="mt-2 text-gray-600">Connect farmers with buyers, get AI price suggestions, and manage orders.</p>
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <Link to="/login" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Login</Link>
                    </div>
                </section>
            </div>
        );
    }

    if (role === 'buyer') {
        const onOrder = async (product) => {
            const qtyStr = globalThis?.prompt?.('Enter quantity to order:', '1');
            const qty = Number(qtyStr || '0');
            if (Number.isNaN(qty) || qty <= 0) return;
            await placeOrder({ product, qty });
            alert('Order placed');
        };
        return (
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
                <aside className="md:col-span-1 space-y-3">
                    <input className="w-full border rounded px-3 py-2" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
                    <select className="w-full border rounded px-3 py-2" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
                        <option value="">All Categories</option>
                        <option value="Grain">Grain</option>
                        <option value="Leaf">Leaf</option>
                    </select>
                    <select className="w-full border rounded px-3 py-2" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })}>
                        <option value="">All Locations</option>
                        <option value="Village A">Village A</option>
                        <option value="Town B">Town B</option>
                    </select>
                    <select className="w-full border rounded px-3 py-2" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
                        <option value="latest">Latest First</option>
                        <option value="oldest">Old First</option>
                        <option value="low">Low to High (Price)</option>
                        <option value="high">High to Low (Price)</option>
                        <option value="rating">High Rating</option>
                    </select>
                </aside>
                <main className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(p => <ProductCard key={p.id} product={p} onOrder={onOrder} />)}
                    {!filtered.length && <div className="text-sm text-gray-500">No products found.</div>}
                </main>
            </div>
        );
    }

    // Farmers should not see Home content; redirect to dashboard
    return (
        <div className="max-w-5xl mx-auto py-8">
            <Link to="/dashboard/farmer" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Go to Dashboard</Link>
        </div>
    );
}


