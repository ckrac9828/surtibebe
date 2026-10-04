import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import OrderStatusBadge from '../../Components/OrderStatusBadge';
import {
    BoxIcon,
    CartIcon,
    CheckCircleIcon,
    HourglassIcon,
    MoneyIcon,
    TrendDownIcon,
    TrendUpIcon,
} from '../../Components/AdminIcons';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';

export default function Dashboard({ stats, currentMonthLabel, weeklySales, recentOrders }) {
    const { auth } = usePage().props;

    const cards = [
        {
            icon: BoxIcon,
            label: 'Productos',
            value: stats.products,
            badge: 'bg-blue-100 text-blue-600',
            trend: stats.newProductsThisWeek > 0 ? `+${stats.newProductsThisWeek} nuevos` : null,
        },
        {
            icon: CartIcon,
            label: 'Pedidos recibidos',
            value: stats.ordersTotal,
            badge: 'bg-violet-100 text-violet-600',
            trend: stats.ordersProcessing > 0 ? `+${stats.ordersProcessing} en proceso` : null,
        },
        {
            icon: CheckCircleIcon,
            label: 'Pedidos completados',
            value: stats.ordersCompleted,
            badge: 'bg-emerald-100 text-emerald-600',
            trend: stats.completedThisWeek > 0 ? `+${stats.completedThisWeek} esta semana` : null,
        },
        {
            icon: HourglassIcon,
            label: 'Pedidos pendientes',
            value: stats.ordersPending,
            badge: 'bg-amber-100 text-amber-600',
            trend: null,
        },
    ];

    return (
        <AdminLayout>
            <Head title="Panel" />

            <h1 className="text-2xl font-bold text-brand-navy">¡Hola, {auth.user.name}!</h1>
            <p className="mt-1 text-gray-500">Aquí tienes un resumen de la actividad de tu tienda.</p>

            {/* Tarjeta destacada: suma automática de lo facturado en pedidos
                completados del mes en curso, con la variación vs. el mes
                anterior cuando hay datos para compararla. */}
            <div className="mt-6 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                <span className="flex h-14 w-14 flex-none items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                    <MoneyIcon className="h-7 w-7" />
                </span>
                <div className="flex-1">
                    <p className="text-sm text-gray-500">
                        Ingresos por pedidos completados — {currentMonthLabel}
                    </p>
                    <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <p className="text-3xl font-bold text-brand-navy">
                            {formatPrice(stats.completedRevenueThisMonth)}
                        </p>
                        {stats.revenueChangePercent !== null && (
                            <TrendChip value={stats.revenueChangePercent} suffix="vs. mes anterior" />
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                    <div key={card.label} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
                        <span className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl ${card.badge}`}>
                            <card.icon className="h-6 w-6" />
                        </span>
                        <div>
                            <p className="text-2xl font-bold text-brand-navy">{card.value}</p>
                            <p className="text-sm text-gray-500">{card.label}</p>
                            {card.trend && (
                                <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-brand-green">
                                    <TrendUpIcon className="h-3.5 w-3.5" />
                                    {card.trend}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-brand-navy">Pedidos recientes</h2>
                        <Link href="/admin/pedidos" className="text-sm font-semibold text-brand-blue hover:underline">
                            Ver todos
                        </Link>
                    </div>

                    <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-sm">
                        <table className="w-full min-w-[560px] border-collapse">
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
                </div>

                <div>
                    <h2 className="text-xl font-bold text-brand-navy">Ventas de la semana</h2>
                    <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
                        <WeeklySalesChart data={weeklySales} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function TrendChip({ value, suffix }) {
    const isPositive = value >= 0;
    const Icon = isPositive ? TrendUpIcon : TrendDownIcon;

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                isPositive ? 'bg-green-100 text-brand-green' : 'bg-red-100 text-brand-red'
            }`}
        >
            <Icon className="h-3.5 w-3.5" />
            {isPositive ? '+' : ''}
            {value}% {suffix}
        </span>
    );
}

// Gráfica de barras liviana hecha a mano con SVG — sin añadir una librería
// de charts nueva al proyecto solo para esto. Las barras se escalan contra
// el día de mayor venta de la semana; si todavía no hay ninguna venta,
// se muestran todas al mínimo en vez de dividir por cero.
function WeeklySalesChart({ data }) {
    const max = Math.max(...data.map((d) => d.total), 0);
    const chartHeight = 140;

    return (
        <div>
            <div className="flex items-end justify-between gap-2" style={{ height: chartHeight }}>
                {data.map((day) => {
                    const barHeight = max > 0 ? Math.max((day.total / max) * chartHeight, day.total > 0 ? 6 : 2) : 2;

                    return (
                        <div key={day.label} className="flex flex-1 flex-col items-center justify-end gap-1.5" style={{ height: chartHeight }}>
                            <div
                                title={formatPrice(day.total)}
                                className={`w-full rounded-t-md transition-all ${day.isToday ? 'bg-brand-skyDeep' : 'bg-blue-100'}`}
                                style={{ height: barHeight }}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="mt-2 flex justify-between gap-2 border-t border-gray-100 pt-2">
                {data.map((day) => (
                    <span
                        key={day.label}
                        className={`flex-1 text-center text-xs font-medium ${day.isToday ? 'text-brand-skyDeep' : 'text-gray-400'}`}
                    >
                        {day.label}
                    </span>
                ))}
            </div>
        </div>
    );
}
