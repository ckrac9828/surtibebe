import { Head, Link } from '@inertiajs/react';
import PublicLayout, { WHATSAPP_NUMBER } from '../Layouts/PublicLayout';
import CategoryIcon from '../Components/CategoryIcon';
import ProductCard from '../Components/ProductCard';
import heroImage from '../../images/hero-banner.png';

// Iconos de línea propios (SVG), mismo criterio que CategoryIcon.jsx y
// Contact.jsx: nítidos y consistentes en vez de emojis.
function BoxIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 3 3.5 7.5 12 12l8.5-4.5L12 3Z" />
            <path d="M3.5 7.5V16l8.5 4.5 8.5-4.5V7.5" />
            <path d="M12 12v8.5" />
        </svg>
    );
}

function TagIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M11.5 3.5H5A1.5 1.5 0 0 0 3.5 5v6.5a1.5 1.5 0 0 0 .44 1.06l8 8a1.5 1.5 0 0 0 2.12 0l6.5-6.5a1.5 1.5 0 0 0 0-2.12l-8-8a1.5 1.5 0 0 0-1.06-.44Z" />
            <circle cx="8" cy="8" r="1.25" />
        </svg>
    );
}

function TruckIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="2.5" y="7" width="11.5" height="9.5" rx="1.2" />
            <path d="M14 10.5h4l3 3v3h-7Z" />
            <circle cx="7" cy="18" r="1.8" />
            <circle cx="17" cy="18" r="1.8" />
        </svg>
    );
}

function ChatIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H9l-4 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8Z" />
            <path d="M8 8.5h8M8 11.5h5" />
        </svg>
    );
}

function SearchIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M20 20l-4.5-4.5" />
        </svg>
    );
}

function CartIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 8H6" />
            <circle cx="9.5" cy="20" r="1.3" />
            <circle cx="17" cy="20" r="1.3" />
        </svg>
    );
}

function ShieldIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 3.5 5 6v5.5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6Z" />
            <path d="M9 12l2 2 4-4.5" />
        </svg>
    );
}

function HeartIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 20s-7-4.4-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5c-2.5 4.6-9.5 9-9.5 9Z" />
        </svg>
    );
}

function GridIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
            <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
            <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
            <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
        </svg>
    );
}

export default function Home({ categories, featuredProducts, stats }) {
    return (
        <PublicLayout>
            <Head title="Inicio" />

            {/* La imagen va en flujo normal (w-full h-auto): su alto lo define
                su propio ancho/alto reales, así se ve completa siempre, sin
                recortar nada. El texto se superpone encima con capas
                absolutas que ocupan ese mismo alto ya calculado. */}
            <section className="relative w-full overflow-hidden bg-brand-soft">
                <img
                    src={heroImage}
                    alt=""
                    aria-hidden="true"
                    className="block w-full h-auto"
                />
                {/* Degradado para que el texto quede legible sobre la foto —
                    sólido donde vive el texto, se apaga antes de llegar al
                    lema/oveja que ya trae la imagen (empieza cerca del 55%
                    del ancho), para no taparlos con velo. */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-soft from-0% via-brand-soft/90 via-30% to-transparent to-55%" />

                <div className="absolute inset-0 flex items-center">
                    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
                        <div className="max-w-[150px] sm:max-w-sm lg:max-w-lg">
                            <span className="inline-flex items-center gap-1 rounded-full bg-brand-navy px-2 py-0.5 text-[9px] font-semibold text-white sm:gap-1.5 sm:px-4 sm:py-1.5 sm:text-xs">
                                🚚 Proveedor de productos para bebés
                            </span>

                            <h1 className="mt-1.5 text-base font-bold leading-tight text-brand-navy sm:mt-3 sm:text-3xl lg:mt-4 lg:text-5xl">
                                Juguetes, accesorios{' '}
                                <br className="hidden sm:block" />
                                y más <span className="text-brand-orange">por mayor</span>
                            </h1>
                            <p className="mt-1 hidden max-w-md text-gray-600 sm:block sm:text-base lg:mt-4 lg:text-lg">
                                Calidad, variedad y los mejores precios para tu negocio.
                            </p>

                            <div className="mt-2 hidden flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-brand-navy lg:flex">
                                <span className="flex items-center gap-2">🚚 Envíos a nivel nacional</span>
                                <span className="flex items-center gap-2">🛡️ Productos de alta calidad</span>
                                <span className="flex items-center gap-2">🏬 Ideal para tiendas y centros comerciales</span>
                            </div>

                            <div className="mt-2 flex flex-col gap-1.5 sm:mt-6 sm:flex-row sm:gap-4">
                                <a
                                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex min-h-[44px] items-center justify-center rounded-full bg-brand-green px-4 text-center text-xs font-semibold text-white hover:opacity-90 sm:px-6 sm:py-3 sm:text-base"
                                >
                                    Hacer pedido por WhatsApp →
                                </a>
                                <Link
                                    href="/contacto"
                                    className="hidden rounded-full border-2 border-brand-blue px-6 py-3 text-center font-semibold text-brand-blue hover:bg-white sm:block"
                                >
                                    Escribir al administrador
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Barra de cifras reales — nada inventado: sale de contar
                productos activos y categorías en la base de datos. */}
            <section className="border-b border-gray-100 bg-white">
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:px-6">
                    <StatItem icon={<BoxIcon className="h-5 w-5" />} value={`${stats.products}+`} label="Productos disponibles" />
                    <StatItem icon={<TagIcon className="h-5 w-5" />} value={stats.categories} label="Categorías" />
                    <StatItem icon={<TruckIcon className="h-5 w-5" />} value="Nacional" label="Cobertura de envíos" />
                    <StatItem icon={<ChatIcon className="h-5 w-5" />} value="Directo" label="Pedido por WhatsApp" />
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-navy">Categorías destacadas</h2>
                        <p className="mt-1 text-sm text-gray-500">Explora nuestra variedad organizada por categoría.</p>
                    </div>
                    <Link href="/catalogo" className="hidden text-sm font-semibold text-brand-blue hover:underline sm:block">
                        Ver todo el catálogo →
                    </Link>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/catalogo?categoria=${category.slug}`}
                            className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <CategoryIcon slug={category.slug} />
                            <div>
                                <span className="block font-semibold text-brand-navy">{category.name}</span>
                                <span className="block text-xs text-gray-500">{category.products_count} productos</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Muestra productos reales del catálogo — la mejor forma de
                transmitir variedad es enseñarla, no solo decirla. */}
            {featuredProducts.length > 0 && (
                <section className="border-t border-gray-100 bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-brand-navy">Productos destacados</h2>
                                <p className="mt-1 text-sm text-gray-500">Una muestra de lo último que agregamos al catálogo.</p>
                            </div>
                            <Link href="/catalogo" className="hidden text-sm font-semibold text-brand-blue hover:underline sm:block">
                                Ver todo →
                            </Link>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        <div className="mt-8 text-center sm:hidden">
                            <Link
                                href="/catalogo"
                                className="inline-block rounded-full border-2 border-brand-blue px-6 py-2.5 font-semibold text-brand-blue"
                            >
                                Ver todo el catálogo →
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Proceso de compra — le da confianza a un cliente nuevo que
                todavía no sabe cómo funciona pedir al por mayor aquí. */}
            <section className="border-t border-gray-100 bg-brand-soft">
                <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
                    <h2 className="text-center text-2xl font-bold text-brand-navy">¿Cómo funciona?</h2>
                    <p className="mx-auto mt-2 max-w-md text-center text-gray-600">
                        Comprar al por mayor en Surtibebé es simple, directo y sin complicaciones.
                    </p>

                    <div className="mt-10 grid gap-8 sm:grid-cols-3">
                        <Step number="1" icon={<SearchIcon className="h-6 w-6" />} title="Explora el catálogo" text="Encuentra juguetes, accesorios y más, organizados por categoría y color." />
                        <Step number="2" icon={<CartIcon className="h-6 w-6" />} title="Arma tu pedido" text="Elige las cantidades y colores que necesites para tu negocio." />
                        <Step number="3" icon={<ChatIcon className="h-6 w-6" />} title="Confirma por WhatsApp" text="Revisamos tu pedido y coordinamos contigo el envío a todo el país." />
                    </div>
                </div>
            </section>

            <section className="border-t border-gray-100 bg-white">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
                    <Feature icon={<ShieldIcon className="h-6 w-6" />} title="Productos de calidad" subtitle="y excelente presentación" />
                    <Feature icon={<TruckIcon className="h-6 w-6" />} title="Despachos rápidos" subtitle="y seguros a todo el país" />
                    <Feature icon={<HeartIcon className="h-6 w-6" />} title="Atención personalizada" subtitle="para tu negocio" />
                    <Feature icon={<GridIcon className="h-6 w-6" />} title="Gran variedad" subtitle={`${stats.products}+ referencias disponibles`} />
                </div>
            </section>

            {/* Cierre con llamado a la acción — mismo tono que el banner de
                la pantalla de Contacto. */}
            <section className="bg-brand-navy">
                <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-14 text-center sm:px-6">
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">¿Listo para surtir tu negocio?</h2>
                    <p className="max-w-lg text-gray-300">
                        Escríbenos por WhatsApp y arma tu pedido al por mayor en minutos.
                    </p>
                    <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 rounded-full bg-brand-green px-8 py-3 font-semibold text-white hover:opacity-90"
                    >
                        Hacer pedido por WhatsApp →
                    </a>
                </div>
            </section>
        </PublicLayout>
    );
}

function StatItem({ icon, value, label }) {
    return (
        <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-soft text-brand-blue">
                {icon}
            </span>
            <div className="min-w-0">
                <p className="truncate text-lg font-bold leading-tight text-brand-navy">{value}</p>
                <p className="truncate text-xs text-gray-500">{label}</p>
            </div>
        </div>
    );
}

function Step({ number, icon, title, text }) {
    return (
        <div className="relative rounded-2xl bg-white p-6 shadow-sm">
            <span className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange text-sm font-bold text-white shadow-sm">
                {number}
            </span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand-blue">
                {icon}
            </span>
            <h3 className="mt-4 font-bold text-brand-navy">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{text}</p>
        </div>
    );
}

function Feature({ icon, title, subtitle }) {
    return (
        <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-brand-soft text-brand-blue shadow-sm">
                {icon}
            </span>
            <p className="font-medium leading-tight text-brand-navy">
                {title}
                <span className="block font-normal text-gray-500">{subtitle}</span>
            </p>
        </div>
    );
}
