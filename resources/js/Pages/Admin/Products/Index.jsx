import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { PencilIcon, TrashIcon } from '../../../Components/AdminIcons';
import ConfirmDeleteModal from '../../../Components/ConfirmDeleteModal';
import { formatPrice } from '../../../utils/formatPrice';

export default function Index({ products, categories, filters }) {
    const [search, setSearch] = useState(filters.buscar ?? '');
    const [productToDelete, setProductToDelete] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(false);

    function applyFilters(overrides = {}) {
        router.get(
            '/admin/productos',
            {
                buscar: search || undefined,
                categoria: filters.categoria || undefined,
                estado: filters.estado || undefined,
                ...overrides,
            },
            { preserveState: true, replace: true }
        );
    }

    function handleSearch(e) {
        e.preventDefault();
        applyFilters({ buscar: search || undefined });
    }

    function toggleStatus(product) {
        router.patch(`/admin/productos/${product.id}/estado`, {}, { preserveScroll: true });
    }

    function confirmDestroyProduct() {
        if (!productToDelete) return;

        setDeletingProduct(true);
        router.delete(`/admin/productos/${productToDelete.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setDeletingProduct(false);
                setProductToDelete(null);
            },
        });
    }

    return (
        <AdminLayout>
            <Head title="Productos" />

            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-brand-navy">Productos</h1>
                <Link
                    href="/admin/productos/create"
                    className="rounded-full bg-brand-skyDeep px-5 py-2 font-semibold text-white hover:opacity-90"
                >
                    + Nuevo producto
                </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                <form onSubmit={handleSearch} className="flex-1 min-w-[220px]">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar producto..."
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-blue focus:outline-none"
                    />
                </form>

                <select
                    value={filters.categoria ?? ''}
                    onChange={(e) => applyFilters({ categoria: e.target.value || undefined })}
                    className="rounded-lg border border-gray-300 px-3 py-2"
                >
                    <option value="">Todas las categorías</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                </select>

                <select
                    value={filters.estado ?? ''}
                    onChange={(e) => applyFilters({ estado: e.target.value || undefined })}
                    className="rounded-lg border border-gray-300 px-3 py-2"
                >
                    <option value="">Todos los estados</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                </select>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
                <table className="w-full min-w-[720px] border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
                            <th className="px-5 py-3">Imagen</th>
                            <th className="px-5 py-3">Nombre</th>
                            <th className="px-5 py-3">Categoría</th>
                            <th className="px-5 py-3">Precio</th>
                            <th className="px-5 py-3">Stock</th>
                            <th className="px-5 py-3">Estado</th>
                            <th className="px-5 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.data.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-5 py-8 text-center text-gray-500">
                                    No hay productos con esos filtros.
                                </td>
                            </tr>
                        ) : (
                            products.data.map((product) => (
                                <tr key={product.id} className="border-b border-gray-50 last:border-0">
                                    <td className="px-5 py-3">
                                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-brand-soft text-2xl">
                                            {product.images?.[0] ? (
                                                <img
                                                    src={`/storage/${product.images[0].path}`}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                '🧸'
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 font-medium text-brand-navy">{product.name}</td>
                                    <td className="px-5 py-3 text-gray-600">{product.category.name}</td>
                                    <td className="px-5 py-3 text-gray-600">{formatPrice(product.price)}</td>
                                    <td className="px-5 py-3 text-gray-600">{product.total_stock}</td>
                                    <td className="px-5 py-3">
                                        <button
                                            onClick={() => toggleStatus(product)}
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                product.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-200 text-gray-600'
                                            }`}
                                            title="Clic para cambiar el estado"
                                        >
                                            {product.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </button>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex justify-end gap-3">
                                            <Link
                                                href={`/admin/productos/${product.id}/edit`}
                                                className="text-brand-blue hover:opacity-70"
                                                title="Editar producto"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </Link>
                                            <button
                                                onClick={() => setProductToDelete(product)}
                                                className="text-brand-red hover:opacity-70"
                                                title="Eliminar definitivamente"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {products.links.length > 3 && (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {products.links.map((link, i) => (
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

            <ConfirmDeleteModal
                show={!!productToDelete}
                title="¿Eliminar este producto?"
                description={
                    productToDelete
                        ? `Vas a eliminar "${productToDelete.name}" definitivamente. Esta acción no se puede deshacer.`
                        : ''
                }
                confirmLabel="Eliminar"
                processing={deletingProduct}
                onCancel={() => setProductToDelete(null)}
                onConfirm={confirmDestroyProduct}
            />
        </AdminLayout>
    );
}
