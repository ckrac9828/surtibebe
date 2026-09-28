import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import OrderStatusBadge from '../../Components/OrderStatusBadge';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';

export default function Dashboard({ stats, recentOrders }) {
    const cards = [
        { icon: '📦', label: 'Total productos', value: stats.products, color: 'bg-brand-orange' },
        { icon: '🛒', label: 'Pedidos recibidos', value: stats.ordersTotal, color: 'bg-brand-blue' },
        { icon: '✅', label: 'Pedidos completados', value: stats.ordersCompleted, color: 'bg-brand-green' },
        { icon: '⏳', label: 'Pedidos pendientes', value: stats.ordersPending, color: 'bg-brand-amber' },
    ];

    return (
        <AdminLayout>
            <Head title="Panel" />

            <h1 className="text-2xl font-bold text-brand-navy">Resumen general</h1>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                    <div key={card.label} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
                        <span className={`flex h-12 w-12 flex-none items-center justify-center rounded-full text-2xl text-white ${card.color}`}>
                            {card.icon}
                        </span>
                        <div>
                            <p className="text-2xl font-bold text-brand-navy">{card.value}</p>
                            <p className="text-sm text-gray-500">{card.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="mt-10 text-xl font-bold text-brand-navy">Pedidos recientes</h2>

            <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-sm">
                <table className="w-full min-w-[640px] border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
                            <th className="px-5 py-3"># Pedido</th>
                            <th className="px-5 py-3">Cliente</th>
                            <th className="px-5 py-3">Fecha</th>
                            <th className="px-5 py-3">Total</th>
                            <th className="px-5 py-3">Estado</th>
                            <th className="px-5 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                                    Todavía no ha llegado ningún pedido.
                                </td>
                            </tr>
                        ) : (
                            recentOrders.map((order) => (
                                <tr key={order.id} className="border-b border-gray-50 last:border-0">
                                    <td className="px-5 py-3 font-medium text-brand-navy">{order.order_number}</td>
                                    <td className="px-5 py-3">{order.company_name}</td>
                                    <td className="px-5 py-3 text-gray-500">{formatDate(order.created_at)}</td>
                                    <td className="px-5 py-3 font-medium text-brand-navy">{formatPrice(order.total)}</td>
                                    <td className="px-5 py-3">
                                        <OrderStatusBadge status={order.status} />
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <Link href={`/admin/pedidos/${order.id}`} className="text-brand-blue hover:underline">
                                            Ver
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
