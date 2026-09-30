import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';
import { useCart } from '../Context/CartContext';
import { formatPrice } from '../utils/formatPrice';

export default function Cart() {
    const { items, updateQuantity, removeItem, totalPrice } = useCart();

    if (items.length === 0) {
        return (
            <PublicLayout>
                <Head title="Mi carrito" />
                <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
                    <p className="text-6xl">🛒</p>
                    <h1 className="mt-4 text-2xl font-bold text-brand-navy">Tu carrito está vacío</h1>
                    <p className="mt-2 text-gray-600">Agrega productos desde el catálogo para armar tu pedido.</p>
                    <Link
                        href="/catalogo"
                        className="mt-6 inline-block rounded-full bg-brand-skyDeep px-6 py-3 font-semibold text-white hover:opacity-90"
                    >
                        Ir al catálogo
                    </Link>
                </div>
            </PublicLayout>
        );
    }

    function decrease(item) {
        updateQuantity(item.id, item.color, Math.max(item.minPurchase, item.quantity - 1));
    }

    function increase(item) {
        updateQuantity(item.id, item.color, item.quantity + 1);
    }

    return (
        <PublicLayout>
            <Head title="Mi carrito" />

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
                <h1 className="text-2xl font-bold text-brand-navy">Mi carrito ({items.length})</h1>

                <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-[560px] border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
                                <th className="py-3">Producto</th>
                                <th className="py-3">Precio</th>
                                <th className="py-3">Cantidad</th>
                                <th className="py-3">Subtotal</th>
                                <th className="py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={`${item.id}-${item.color ?? 'nc'}`} className="border-b border-gray-100">
                                    <td className="py-4 font-medium text-brand-navy">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-14 w-14 flex-none items-center justify-center overflow-hidden rounded-lg bg-brand-soft text-2xl">
                                                {item.image ? (
                                                    <img
                                                        src={`/storage/${item.image}`}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    '🧸'
                                                )}
                                            </div>
                                            <div>
                                                {item.name}
                                                {item.color && (
                                                    <span className="block text-xs font-normal text-gray-500">
                                                        Color: {item.color}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-gray-600">{formatPrice(item.price)}</td>
                                    <td className="py-4">
                                        <div className="flex w-fit items-center gap-1 rounded-full border border-gray-300 px-1">
                                            <button
                                                onClick={() => decrease(item)}
                                                disabled={item.quantity <= item.minPurchase}
                                                className="flex h-11 w-9 flex-none items-center justify-center font-bold text-brand-navy disabled:opacity-30"
                                            >
                                                −
                                            </button>
                                            <span className="w-6 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => increase(item)}
                                                className="flex h-11 w-9 flex-none items-center justify-center font-bold text-brand-navy"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-4 font-semibold text-brand-navy">
                                        {formatPrice(item.price * item.quantity)}
                                    </td>
                                    <td className="py-4 text-right">
                                        <button
                                            onClick={() => removeItem(item.id, item.color)}
                                            aria-label={`Quitar ${item.name}`}
                                            className="flex h-11 w-11 items-center justify-center text-xl text-brand-red hover:opacity-70"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-4 sm:flex-row sm:items-center">
                    <Link
                        href="/catalogo"
                        className="rounded-full border-2 border-brand-blue px-6 py-3 text-center font-semibold text-brand-blue hover:bg-brand-soft"
                    >
                        Seguir comprando
                    </Link>

                    <div className="flex flex-col items-end gap-3">
                        <p className="text-xl font-bold text-brand-navy">
                            Total: {formatPrice(totalPrice)}
                        </p>
                        <Link
                            href="/checkout"
                            className="rounded-full bg-brand-skyDeep px-8 py-3 text-center font-semibold text-white hover:opacity-90"
                        >
                            Continuar con el pedido
                        </Link>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
