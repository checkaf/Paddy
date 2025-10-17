import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="max-w-5xl mx-auto">
            <section className="text-center py-12">
                <h1 className="text-3xl font-bold text-gray-900">Welcome to Farming Shop SRC</h1>
                <p className="mt-2 text-gray-600">Connect farmers with buyers, get AI price suggestions, and manage orders.</p>
                <div className="mt-6 flex items-center justify-center gap-3">
                    <Link to="/products" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Browse Products</Link>
                    <Link to="/register" className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50">Get Started</Link>
                </div>
            </section>
        </div>
    );
}


