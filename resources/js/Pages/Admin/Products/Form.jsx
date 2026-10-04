import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { CloseIcon, TrashIcon } from '../../../Components/AdminIcons';

export default function Form({ categories, product }) {
    const isEditing = !!product;

    const { data, setData, post, transform, processing, errors } = useForm({
        category_id: product?.category_id ?? '',
        name: product?.name ?? '',
        description: product?.description ?? '',
        price: product?.price ?? '',
        stock: product?.stock ?? '',
        min_purchase: product?.min_purchase ?? 1,
        status: product?.status ?? 'active',
        colors: product?.colors?.map((c) => ({ name: c.name, hex: c.hex_value ?? '#000000', stock: c.stock ?? 0 })) ?? [],
        images: [],
    });

    function handleSubmit(e) {
        e.preventDefault();

        const url = isEditing ? `/admin/productos/${product.id}` : '/admin/productos';

        // Los archivos no viajan bien en una petición PUT/PATCH real, así que
        // siempre se manda como POST — para editar, se "disfraza" agregando
        // _method: 'put' al payload, que es como Laravel reconoce que en
        // realidad es una actualización (method spoofing).
        if (isEditing) {
            transform((data) => ({ ...data, _method: 'put' }));
        }

        post(url, { forceFormData: true });
    }

    function addColor() {
        setData('colors', [...data.colors, { name: '', hex: '#000000', stock: 0 }]);
    }

    function updateColor(index, field, value) {
        const next = [...data.colors];
        next[index] = { ...next[index], [field]: value };
        setData('colors', next);
    }

    function removeColor(index) {
        setData('colors', data.colors.filter((_, i) => i !== index));
    }

    function removeExistingImage(image) {
        if (!confirm('¿Quitar esta imagen del producto?')) return;
        router.delete(`/admin/productos/${product.id}/imagenes/${image.id}`, { preserveScroll: true });
    }

    return (
        <AdminLayout>
            <Head title={isEditing ? 'Editar producto' : 'Nuevo producto'} />

            <h1 className="text-2xl font-bold text-brand-navy">
                {isEditing ? `Editar: ${product.name}` : 'Nuevo producto'}
            </h1>

            <form onSubmit={handleSubmit} className="mt-6 max-w-3xl space-y-6">
                <div className="grid gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2">
                    <Field label="Nombre" error={errors.name} className="sm:col-span-2">
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-blue focus:outline-none"
                        />
                    </Field>

                    <Field label="Categoría" error={errors.category_id}>
                        <select
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2"
                        >
                            <option value="">Selecciona una categoría</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Estado" error={errors.status}>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2"
                        >
                            <option value="active">Activo</option>
                            <option value="inactive">Inactivo</option>
                        </select>
                    </Field>

                    <Field label="Descripción" error={errors.description} className="sm:col-span-2">
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-blue focus:outline-none"
                        />
                    </Field>

                    <Field label="Precio (COP)" error={errors.price}>
                        <input
                            type="number"
                            min="0"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-blue focus:outline-none"
                        />
                    </Field>

                    {data.colors.length === 0 && (
                        <Field label="Stock" error={errors.stock}>
                            <input
                                type="number"
                                min="0"
                                value={data.stock}
                                onChange={(e) => setData('stock', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-blue focus:outline-none"
                            />
                        </Field>
                    )}

                    <Field label="Compra mínima" error={errors.min_purchase}>
                        <input
                            type="number"
                            min="1"
                            value={data.min_purchase}
                            onChange={(e) => setData('min_purchase', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-blue focus:outline-none"
                        />
                    </Field>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h2 className="font-semibold text-brand-navy">Imágenes</h2>

                    {isEditing && product.images.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-3">
                            {product.images.map((image) => (
                                <div key={image.id} className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                                    <img src={`/storage/${image.path}`} alt="" className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(image)}
                                        className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center bg-black/60 text-white"
                                    >
                                        <CloseIcon className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => setData('images', Array.from(e.target.files))}
                        className="mt-3 block text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        {isEditing ? 'Las nuevas imágenes se agregan a las que ya tiene el producto.' : 'Puedes elegir varias a la vez.'}
                    </p>
                    {errors['images.0'] && <p className="mt-1 text-sm text-brand-red">{errors['images.0']}</p>}
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-brand-navy">Colores disponibles</h2>
                        <button
                            type="button"
                            onClick={addColor}
                            className="text-sm font-semibold text-brand-blue hover:underline"
                        >
                            + Agregar color
                        </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        Déjalo vacío si este producto no maneja variantes de color. Si agregas colores,
                        el stock se controla por cada uno (el campo "Stock" general de arriba se oculta).
                    </p>

                    <div className="mt-3 space-y-2">
                        {data.colors.map((color, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={color.hex}
                                    onChange={(e) => updateColor(index, 'hex', e.target.value)}
                                    className="h-9 w-9 flex-none rounded border border-gray-300"
                                />
                                <input
                                    type="text"
                                    value={color.name}
                                    onChange={(e) => updateColor(index, 'name', e.target.value)}
                                    placeholder="Nombre del color (ej: Rosado)"
                                    className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5"
                                />
                                <input
                                    type="number"
                                    min="0"
                                    value={color.stock}
                                    onChange={(e) => updateColor(index, 'stock', e.target.value)}
                                    placeholder="Stock"
                                    title="Stock de este color"
                                    className="w-24 flex-none rounded-lg border border-gray-300 px-3 py-1.5"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeColor(index)}
                                    className="text-brand-red hover:opacity-70"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                    {errors['colors.0.stock'] && (
                        <p className="mt-2 text-sm text-brand-red">Revisa el stock de cada color.</p>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-full bg-brand-skyDeep px-6 py-2.5 font-semibold text-white hover:opacity-90 disabled:opacity-50"
                    >
                        {processing ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
                    </button>
                    <Link href="/admin/productos" className="font-semibold text-gray-500 hover:text-brand-navy">
                        Cancelar
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}

function Field({ label, error, children, className = '' }) {
    return (
        <label className={`block ${className}`}>
            <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
            {children}
            {error && <span className="mt-1 block text-sm text-brand-red">{error}</span>}
        </label>
    );
}
