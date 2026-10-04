import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import OrderStatusBadge from '../../../Components/OrderStatusBadge';
import { SearchIcon } from '../../../Components/AdminIcons';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDate } from '../../../utils/formatDate';

export default function Index({ orders, filters }) {
    const [search, setSearch] = useState(filters.buscar ?? '');

    function applyFilters(overrides = {}) {
        router.get(
            '/admin/pedidos',
            {
                estado: filters.estado || undefined,
                fecha: filters.fecha || undefined,
                buscar: filters.buscar || undefined,
                ...overrides,
            },
            { preserveState: true, replace: true }
        );
    }

    function handleSearch(e) {
        e.preventDefault();
        applyFilters({ buscar: search.trim() || undefined });
    }

    return (
        <AdminLayout>
            <Head title="Pedidos" />

            <h1 className="text-2xl font-bold text-brand-navy">Pedidos</h1>

            <div className="mt-6 flex flex-wrap gap-3">
                <form onSubmit={handleSearch} className="flex w-full gap-2 sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <SearchIcon className="h-4 w-4" />
                        </span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por cliente o # de pedido..."
                            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-brand-blue focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="rounded-lg bg-brand-skyDeep px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                    >
                        Buscar
                    </button>
                </form>

                <select
                    value={filters.estado ?? ''}
                    onChange={(e) => applyFilters({ estado: e.target.value || undefined })}
                    className="rounded-lg border border-gray-300 px-3 py-2"
                >
                    <option value="">Todos los estados</option>
                    <option value="pending">Pendiente</option>
                    <option value="processing">En proceso</option>
                    <option value="shipped">Enviado</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                </select>

                <input
                    type="date"
                    value={filters.fecha ?? ''}
                    onChange={(e) => applyFilters({ fecha: e.target.value || undefined })}
                    className="rounded-lg border border-gray-300 px-3 py-2"
                />

                {(filters.estado || filters.fecha || filters.buscar) && (
                    <button
                        onClick={() => {
                            setSearch('');
                            applyFilters({ estado: undefined, fecha: undefined, buscar: undefined });
                        }}
                        className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:text-brand-navy"
                    >
                        Limpiar filtros
                    </button>
                )}
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
                <table className="w-full min-w-[720px] border-collapse">
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
                        {orders.data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                                    No hay pedidos con esos filtros.
                                </td>
                            </tr>
                        ) : (
                            orders.data.map((order) => (
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

            {orders.links.length > 3 && (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {orders.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            preserveScroll
                            className={`rounded-lg px-3 py-1.5 text-sm ${
                                link.active
                                    ? 'bg-brand-navy text-white'
                                    : link.url
                                    ? 'border border-gray-300 bg-white text-brand-navy hover:bg-gray-50'
                                    : 'text-gray-300'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
