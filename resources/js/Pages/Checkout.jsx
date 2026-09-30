import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';
import { useCart } from '../Context/CartContext';
import { formatPrice } from '../utils/formatPrice';

export default function Checkout() {
    const { items, totalPrice, clearCart } = useCart();

    const { data, setData, post, processing, errors, transform } = useForm({
        company_name: '',
        nit: '',
        address: '',
        phone: '',
        observations: '',
    });

    function handleSubmit(e) {
        e.preventDefault();

        transform((formData) => ({
            ...formData,
            items: items.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
                color: item.color,
            })),
        }));

        post('/pedidos', {
            onSuccess: () => clearCart(),
        });
    }

    if (items.length === 0) {
        return (
            <PublicLayout>
                <Head title="Checkout" />
                <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
                    <p className="text-6xl">🧾</p>
                    <h1 className="mt-4 text-2xl font-bold text-brand-navy">
                        No tienes productos en tu carrito
                    </h1>
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

    return (
        <PublicLayout>
            <Head title="Confirmar pedido" />

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
                <h1 className="text-2xl font-bold text-brand-navy">Confirmar pedido</h1>

                <form onSubmit={handleSubmit} className="mt-6 grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                        <h2 className="font-semibold text-brand-navy">Datos de contacto y entrega</h2>

                        <Field label="Nombre de la empresa" error={errors.company_name}>
                            <input
                                type="text"
                                value={data.company_name}
                                onChange={(e) => setData('company_name', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-blue focus:outline-none"
                            />
                        </Field>

                        <Field label="NIT" error={errors.nit}>
                            <input
                                type="text"
                                value={data.nit}
                                onChange={(e) => setData('nit', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-blue focus:outline-none"
                            />
                        </Field>

                        <Field label="Dirección" error={errors.address}>
                            <input
                                type="text"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-blue focus:outline-none"
                            />
                        </Field>

                        <Field label="Teléfono" error={errors.phone}>
                            <input
                                type="tel"
                                inputMode="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-blue focus:outline-none"
                            />
                        </Field>

                        <Field label="Observaciones (opcional)" error={errors.observations}>
                            <textarea
                                value={data.observations}
                                onChange={(e) => setData('observations', e.target.value)}
                                rows={3}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-blue focus:outline-none"
                            />
                        </Field>
                    </div>

                    <div>
                        <h2 className="font-semibold text-brand-navy">Resumen del pedido</h2>

                        <div className="mt-4 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white">
                            {items.map((item) => (
                                <div key={`${item.id}-${item.color ?? 'nc'}`} className="flex items-center justify-between gap-3 p-4">
                                    <div>
                                        <p className="font-medium text-brand-navy">
                                            {item.name}
                                            {item.color && <span className="text-gray-500"> — {item.color}</span>}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {item.quantity} × {formatPrice(item.price)}
                                        </p>
                                    </div>
                                    <p className="font-semibold text-brand-navy">
                                        {formatPrice(item.price * item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                            <span className="text-lg font-bold text-brand-navy">Total:</span>
                            <span className="text-lg font-bold text-brand-navy">{formatPrice(totalPrice)}</span>
                        </div>

                        {errors.items && (
                            <p className="mt-3 text-sm text-brand-red">{errors.items}</p>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-6 w-full rounded-full bg-brand-pink py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50"
                        >
                            {processing ? 'Enviando...' : 'Confirmar pedido'}
                        </button>
                    </div>
                </form>
            </div>
        </PublicLayout>
    );
}

function Field({ label, error, children }) {
    return (
        <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
            {children}
            {error && <span className="mt-1 block text-sm text-brand-red">{error}</span>}
        </label>
    );
}
