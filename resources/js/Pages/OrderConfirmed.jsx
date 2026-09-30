import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';
import { formatPrice } from '../utils/formatPrice';

export default function OrderConfirmed({ order }) {
    return (
        <PublicLayout>
            <Head title="Pedido confirmado" />
            <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
                <p className="text-6xl">✅</p>
                <h1 className="mt-4 text-2xl font-bold text-brand-navy">¡Pedido recibido!</h1>
                <p className="mt-2 text-gray-600">
                    Tu pedido <span className="font-semibold text-brand-navy">{order.order_number}</span> por{' '}
                    <span className="font-semibold text-brand-navy">{formatPrice(order.total)}</span> fue
                    registrado. Muy pronto nos pondremos en contacto contigo.
                </p>
                <Link
                    href="/catalogo"
                    className="mt-8 inline-block rounded-full bg-brand-skyDeep px-6 py-3 font-semibold text-white hover:opacity-90"
                >
                    Seguir comprando
                </Link>
            </div>
        </PublicLayout>
    );
}
