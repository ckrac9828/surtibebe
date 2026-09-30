import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import ProductCard from '../../Components/ProductCard';
import CategoryIcon from '../../Components/CategoryIcon';

const SORT_OPTIONS = [
    { value: 'recientes', label: 'Más recientes' },
    { value: 'precio_asc', label: 'Precio: menor a mayor' },
    { value: 'precio_desc', label: 'Precio: mayor a menor' },
    { value: 'nombre', label: 'Nombre A-Z' },
];

export default function Index({ categories, products, newProducts, selectedCategory, search, sort }) {
    const [searchTerm, setSearchTerm] = useState(search ?? '');

    function goTo(overrides = {}) {
        router.get(
            '/catalogo',
            {
                categoria: selectedCategory || undefined,
                buscar: searchTerm || undefined,
                orden: sort !== 'recientes' ? sort : undefined,
                ...overrides,
            },
            { preserveState: true, replace: true }
        );
    }

    function handleSearch(e) {
        e.preventDefault();
        goTo({ buscar: searchTerm || undefined });
    }

    return (
        <PublicLayout>
            <Head title="Catálogo" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                <h1 className="text-3xl font-bold text-brand-navy">Catálogo de productos</h1>
                <p className="mt-1 text-gray-600">Encuentra todo lo que necesitas para tu negocio.</p>

                {newProducts && newProducts.length > 0 && (
                    <section className="mt-8 rounded-2xl bg-brand-soft p-4 sm:p-6">
                        <h2 className="text-lg font-bold text-brand-navy">✨ Nuevos productos</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Recién llegados — disponibles por tiempo limitado en esta sección.
                        </p>
                        {/* En móvil cada tarjeta ocupa la mayor parte del ancho visible
                            (una a la vista + un poco de la siguiente asomando, como un
                            carrusel para deslizar); en pantallas más grandes vuelve al
                            ancho compacto de siempre, porque ahí ya se ven varias a la vez. */}
                        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
                            {newProducts.map((product) => (
                                <div key={product.id} className="w-[78%] flex-none sm:w-56">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
                    <aside>
                        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                            Categorías
                        </h2>
                        <nav className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
                            <button
                                onClick={() => goTo({ categoria: undefined })}
                                className={`flex flex-none items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-left font-medium md:flex-auto ${
                                    !selectedCategory
                                        ? 'bg-brand-soft text-brand-navy'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <CategoryIcon slug="todos" size="sm" /> Todos
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => goTo({ categoria: category.slug })}
                                    className={`flex flex-none items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-left font-medium md:flex-auto ${
                                        selectedCategory === category.slug
                                            ? 'bg-brand-soft text-brand-navy'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <CategoryIcon slug={category.slug} size="sm" />
                                    {category.name}
                                </button>
                            ))}
                        </nav>

                        <div className="mt-6 hidden rounded-2xl bg-brand-soft p-5 md:block">
                            <p className="text-2xl">🚚</p>
                            <p className="mt-2 font-semibold text-brand-navy">Compra fácil, rápida y segura</p>
                            <p className="mt-1 text-sm text-gray-600">Productos para tu negocio.</p>
                        </div>
                    </aside>

                    <div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar productos..."
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-blue focus:outline-none"
                                />
                                <button type="submit" className="min-h-[44px] flex-none rounded-lg bg-brand-skyDeep px-4 text-white">
                                    🔍
                                </button>
                            </form>

                            <select
                                value={sort}
                                onChange={(e) => goTo({ orden: e.target.value })}
                                className="flex-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-brand-blue focus:outline-none"
                            >
                                {SORT_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        Ordenar por: {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {products.data.length === 0 ? (
                            <p className="mt-10 text-center text-gray-500">
                                No encontramos productos con esos filtros.
                            </p>
                        ) : (
                            <>
                                <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                                    {products.data.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                                <p className="mt-4 text-sm text-gray-500">
                                    Mostrando {products.from}-{products.to} de {products.total} productos
                                </p>
                            </>
                        )}

                        {products.links.length > 3 && (
                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                {products.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        preserveState
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
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
