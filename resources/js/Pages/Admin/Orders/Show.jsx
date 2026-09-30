import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import OrderStatusBadge from '../../../Components/OrderStatusBadge';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDate } from '../../../utils/formatDate';

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'processing', label: 'En proceso' },
    { value: 'shipped', label: 'Enviado' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' },
];

// Mismo criterio que Admin\OrderItemController::EDITABLE_STATUSES: solo se
// puede tocar la lista de productos antes de que el stock ya se haya
// descontado de verdad.
const EDITABLE_STATUSES = ['pending', 'processing'];

export default function Show({ order, products }) {
    const editable = EDITABLE_STATUSES.includes(order.status);

    const [stockShortages, setStockShortages] = useState(null);
    const [pendingStatusLabel, setPendingStatusLabel] = useState('');

    const [editingItemId, setEditingItemId] = useState(null);
    const [editColor, setEditColor] = useState('');
    const [editQuantity, setEditQuantity] = useState(1);
    const [editErrors, setEditErrors] = useState({});

    const [addProductId, setAddProductId] = useState('');
    const [addColor, setAddColor] = useState('');
    const [addQuantity, setAddQuantity] = useState(1);
    const [addErrors, setAddErrors] = useState({});

    const addProduct = products.find((p) => p.id === Number(addProductId));

    function changeStatus(e) {
        const status = e.target.value;
        if (status === order.status) return;

        router.patch(
            `/admin/pedidos/${order.id}/estado`,
            { status },
            {
                preserveScroll: true,
                onError: (errors) => {
                    if (errors.stock) {
                        setStockShortages(errors.stock.split('\n'));
                        setPendingStatusLabel(STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status);
                    }
                },
            }
        );
    }

    function startEdit(item) {
        setEditingItemId(item.id);
        setEditColor(item.color ?? '');
        setEditQuantity(item.quantity);
        setEditErrors({});
    }

    function cancelEdit() {
        setEditingItemId(null);
        setEditErrors({});
    }

    function saveEdit(item) {
        router.patch(
            `/admin/pedidos/${order.id}/items/${item.id}`,
            { color: editColor || null, quantity: Number(editQuantity) },
            {
                preserveScroll: true,
                onSuccess: () => setEditingItemId(null),
                onError: (errors) => setEditErrors(errors),
            }
        );
    }

    function deleteItem(item) {
        if (!confirm(`¿Quitar "${item.product_name}" del pedido?`)) return;
        router.delete(`/admin/pedidos/${order.id}/items/${item.id}`, { preserveScroll: true });
    }

    function submitAdd(e) {
        e.preventDefault();
        router.post(
            `/admin/pedidos/${order.id}/items`,
            { product_id: addProductId, color: addColor || null, quantity: Number(addQuantity) },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setAddProductId('');
                    setAddColor('');
                    setAddQuantity(1);
                    setAddErrors({});
                },
                onError: (errors) => setAddErrors(errors),
            }
        );
    }

    return (
        <AdminLayout>
            <Head title={`Pedido ${order.order_number}`} />

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Link href="/admin/pedidos" className="text-sm text-brand-blue hover:underline">
                        ← Volver a pedidos
                    </Link>
                    <h1 className="mt-1 text-2xl font-bold text-brand-navy">Pedido {order.order_number}</h1>
                    <p className="text-sm text-gray-500">Recibido el {formatDate(order.created_at)}</p>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href={`/admin/pedidos/${order.id}/pdf`}
                        className="rounded-full border-2 border-brand-blue px-4 py-2 text-sm font-semibold text-brand-blue hover:bg-brand-soft"
                    >
                        Descargar PDF
                    </a>
                    <OrderStatusBadge status={order.status} />
                    <select
                        value={order.status}
                        onChange={changeStatus}
                        className="rounded-lg border border-gray-300 px-3 py-2"
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-1">
                    <h2 className="font-bold text-brand-navy">Datos del cliente</h2>
                    <dl className="mt-4 space-y-3 text-sm">
                        <div>
                            <dt className="text-gray-500">Empresa</dt>
                            <dd className="font-medium text-brand-navy">{order.company_name}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">NIT</dt>
                            <dd className="font-medium text-brand-navy">{order.nit}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Dirección</dt>
                            <dd className="font-medium text-brand-navy">{order.address}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Teléfono</dt>
                            <dd className="font-medium text-brand-navy">{order.phone}</dd>
                        </div>
                        {order.observations && (
                            <div>
                                <dt className="text-gray-500">Observaciones</dt>
                                <dd className="font-medium text-brand-navy">{order.observations}</dd>
                            </div>
                        )}
                    </dl>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
                    <h2 className="font-bold text-brand-navy">Productos pedidos</h2>
                    {!editable && (
                        <p className="mt-1 text-xs text-gray-500">
                            Este pedido ya no se puede editar porque su stock ya fue descontado.
                        </p>
                    )}

                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full min-w-[560px] border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
                                    <th className="px-3 py-2">Producto</th>
                                    <th className="px-3 py-2">Color</th>
                                    <th className="px-3 py-2">Precio</th>
                                    <th className="px-3 py-2">Cantidad</th>
                                    <th className="px-3 py-2">Subtotal</th>
                                    {editable && <th className="px-3 py-2"></th>}
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => {
                                    const isEditing = editingItemId === item.id;
                                    const itemColors = item.product?.colors ?? [];

                                    if (isEditing) {
                                        return (
                                            <tr key={item.id} className="border-b border-gray-50 bg-brand-soft/40 last:border-0">
                                                <td className="px-3 py-2 font-medium text-brand-navy">{item.product_name}</td>
                                                <td className="px-3 py-2">
                                                    {itemColors.length > 0 ? (
                                                        <select
                                                            value={editColor}
                                                            onChange={(e) => setEditColor(e.target.value)}
                                                            className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
                                                        >
                                                            <option value="">Elige un color</option>
                                                            {itemColors.map((c) => (
                                                                <option key={c.id} value={c.name}>
                                                                    {c.name} ({c.stock} disponibles)
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        '—'
                                                    )}
                                                </td>
                                                <td className="px-3 py-2 text-gray-600">{formatPrice(item.price)}</td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={editQuantity}
                                                        onChange={(e) => setEditQuantity(e.target.value)}
                                                        className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-gray-500">—</td>
                                                <td className="px-3 py-2">
                                                    <div className="flex justify-end gap-2 whitespace-nowrap">
                                                        <button
                                                            onClick={() => saveEdit(item)}
                                                            className="text-sm font-semibold text-brand-green hover:underline"
                                                        >
                                                            Guardar
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="text-sm text-gray-500 hover:underline"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                    {(editErrors.color || editErrors.quantity) && (
                                                        <p className="mt-1 text-xs text-brand-red">
                                                            {editErrors.color || editErrors.quantity}
                                                        </p>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    }

                                    return (
                                        <tr key={item.id} className="border-b border-gray-50 last:border-0">
                                            <td className="px-3 py-2 font-medium text-brand-navy">{item.product_name}</td>
                                            <td className="px-3 py-2 text-gray-600">{item.color ?? '—'}</td>
                                            <td className="px-3 py-2 text-gray-600">{formatPrice(item.price)}</td>
                                            <td className="px-3 py-2 text-gray-600">{item.quantity}</td>
                                            <td className="px-3 py-2 font-medium text-brand-navy">{formatPrice(item.subtotal)}</td>
                                            {editable && (
                                                <td className="px-3 py-2 text-right">
                                                    <div className="flex justify-end gap-3">
                                                        {item.product && (
                                                            <button
                                                                onClick={() => startEdit(item)}
                                                                className="text-brand-blue hover:underline"
                                                                title="Editar color/cantidad"
                                                            >
                                                                ✏️
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => deleteItem(item)}
                                                            className="text-brand-red hover:opacity-70"
                                                            title="Quitar del pedido"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {editable && (
                        <form onSubmit={submitAdd} className="mt-5 rounded-xl border border-dashed border-gray-300 p-4">
                            <p className="text-sm font-semibold text-brand-navy">Agregar producto al pedido</p>
                            <div className="mt-3 flex flex-wrap items-end gap-3">
                                <div>
                                    <label className="mb-1 block text-xs text-gray-500">Producto</label>
                                    <select
                                        value={addProductId}
                                        onChange={(e) => {
                                            setAddProductId(e.target.value);
                                            setAddColor('');
                                        }}
                                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                    >
                                        <option value="">Selecciona un producto</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} — {formatPrice(p.price)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {addProduct?.colors?.length > 0 && (
                                    <div>
                                        <label className="mb-1 block text-xs text-gray-500">Color</label>
                                        <select
                                            value={addColor}
                                            onChange={(e) => setAddColor(e.target.value)}
                                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                        >
                                            <option value="">Elige un color</option>
                                            {addProduct.colors.map((c) => (
                                                <option key={c.id} value={c.name}>
                                                    {c.name} ({c.stock} disponibles)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="mb-1 block text-xs text-gray-500">Cantidad</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={addQuantity}
                                        onChange={(e) => setAddQuantity(e.target.value)}
                                        className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={!addProductId}
                                    className="rounded-full bg-brand-skyDeep px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
                                >
                                    + Agregar
                                </button>
                            </div>
                            {(addErrors.product_id || addErrors.color || addErrors.quantity) && (
                                <p className="mt-2 text-sm text-brand-red">
                                    {addErrors.product_id || addErrors.color || addErrors.quantity}
                                </p>
                            )}
                        </form>
                    )}

                    <div className="mt-4 flex justify-end">
                        <div className="w-full max-w-xs space-y-1 text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold text-brand-navy">
                                <span>Total</span>
                                <span>{formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {stockShortages && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setStockShortages(null)}
                >
                    <div
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">⚠️</span>
                            <div>
                                <h3 className="font-bold text-brand-navy">Stock insuficiente</h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    No se pudo pasar este pedido a "{pendingStatusLabel}" porque falta stock de:
                                </p>
                            </div>
                        </div>

                        <ul className="mt-4 space-y-1.5 rounded-lg bg-red-50 p-3 text-sm text-brand-red">
                            {stockShortages.map((line, i) => (
                                <li key={i}>• {line}</li>
                            ))}
                        </ul>

                        <p className="mt-4 text-xs text-gray-500">
                            Puedes editar las líneas del pedido más arriba (cambiar color/cantidad o quitar el
                            producto) o contactar al cliente antes de intentar de nuevo.
                        </p>

                        <button
                            onClick={() => setStockShortages(null)}
                            className="mt-5 w-full rounded-full bg-brand-skyDeep py-2.5 font-semibold text-white hover:opacity-90"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
