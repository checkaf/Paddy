import { Link } from 'react-router-dom';

export default function ProductCard({ product, onOrder }) {
    const { id, name, category, imageUrl, quantity, price, aiPrice } = product;
    return (
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
            {imageUrl ? (
                <img src={imageUrl} alt={name} className="h-40 w-full object-cover" />
            ) : (
                <div className="h-40 w-full bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
            )}
            <div className="p-4 space-y-1">
                <h3 className="font-semibold text-gray-900">{name}</h3>
                <p className="text-sm text-gray-600">{category} • Qty: {quantity}</p>
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-800 font-medium">Price: LKR {price}</span>
                    {aiPrice && (
                        <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded">AI: LKR {aiPrice}</span>
                    )}
                </div>
                <div className="pt-2 flex items-center gap-2">
                    <Link to={`/products/${id}`} className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50">Details</Link>
                    {onOrder && (
                        <button onClick={() => onOrder(product)} className="text-sm px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700">Order</button>
                    )}
                </div>
            </div>
        </div>
    );
}


