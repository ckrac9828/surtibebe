const STATUS_STYLES = {
    pending: { label: 'Pendiente', className: 'bg-amber-100 text-amber-700' },
    processing: { label: 'En proceso', className: 'bg-blue-100 text-blue-700' },
    shipped: { label: 'Enviado', className: 'bg-emerald-100 text-emerald-700' },
    completed: { label: 'Completado', className: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-700' },
};

export default function OrderStatusBadge({ status }) {
    const style = STATUS_STYLES[status] ?? { label: status, className: 'bg-gray-100 text-gray-700' };

    return (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style.className}`}>
            {style.label}
        </span>
    );
}
