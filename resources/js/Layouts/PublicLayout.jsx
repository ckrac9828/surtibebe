import { Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '../Context/CartContext';
import logo from '../../images/logo.png';

export const WHATSAPP_NUMBER = '573125905359'; // número de prueba — reemplazar por el del cliente final

export default function PublicLayout({ children }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [search, setSearch] = useState('');
    const { totalItems } = useCart();
    const [cartBump, setCartBump] = useState(false);
    const prevTotal = useRef(totalItems);

    // El ícono del carrito "rebota" cuando el total sube, como refuerzo
    // visual adicional de que el producto sí se añadió (además del cambio
    // de estado en el propio botón "Agregar al carrito").
    useEffect(() => {
        if (totalItems > prevTotal.current) {
            setCartBump(true);
            const t = setTimeout(() => setCartBump(false), 400);
            prevTotal.current = totalItems;
            return () => clearTimeout(t);
        }
        prevTotal.current = totalItems;
    }, [totalItems]);

    const navLinks = [
        { href: '/', label: 'Inicio' },
        { href: '/catalogo', label: 'Catálogo' },
        { href: '/contacto', label: 'Contacto' },
    ];

    function handleSearch(e) {
        e.preventDefault();
        if (!search.trim()) return;
        router.get('/catalogo', { buscar: search.trim() });
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Franja superior — informativa, no funcional; se oculta en móvil para no robar espacio */}
            <div className="hidden bg-brand-navy text-white sm:block">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:px-6">
                    <span className="flex items-center gap-1.5">
                        🚚 Proveedor de productos para bebés · Ventas al por mayor
                    </span>
                    <div className="flex items-center gap-5">
                        <span className="hidden items-center gap-1.5 lg:flex">🛡️ Productos de alta calidad</span>
                        <span className="hidden items-center gap-1.5 lg:flex">📦 Envíos a todo el país</span>
                        <span className="flex items-center gap-1.5">🤝 Atención personalizada</span>
                    </div>
                </div>
            </div>

            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
                    <Link href="/" className="flex flex-none items-center">
                        <img src={logo} alt="Surtibebé" className="h-16 w-auto sm:h-20" />
                    </Link>

                    <nav className="hidden items-center gap-6 lg:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="whitespace-nowrap font-medium text-brand-navy hover:text-brand-blue"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <form onSubmit={handleSearch} className="hidden flex-1 max-w-sm md:block">
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                🔍
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar productos..."
                                className="w-full rounded-full border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-brand-blue focus:outline-none"
                            />
                        </div>
                    </form>

                    <div className="hidden flex-none items-center gap-4 md:flex">
                        <Link href="/carrito" className="relative">
                            <span className={`inline-block text-2xl ${cartBump ? 'animate-cart-pop' : ''}`}>🛒</span>
                            {totalItems > 0 && (
                                <span
                                    className={`absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-red text-xs font-bold text-white ${
                                        cartBump ? 'animate-cart-pop' : ''
                                    }`}
                                >
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whitespace-nowrap rounded-full bg-brand-green px-5 py-2 font-semibold text-white hover:opacity-90"
                        >
                            Pedir por WhatsApp
                        </a>
                    </div>

                    <button
                        className="flex h-11 w-11 flex-none items-center justify-center md:hidden"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-label="Abrir menú"
                    >
                        <span className="text-2xl">☰</span>
                    </button>
                </div>

                {menuOpen && (
                    <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 md:hidden">
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar productos..."
                                className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-brand-blue focus:outline-none"
                            />
                        </form>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex min-h-[44px] items-center font-medium text-brand-navy"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link href="/carrito" className="flex min-h-[44px] items-center font-medium text-brand-navy">
                            Carrito {totalItems > 0 && `(${totalItems})`}
                        </Link>
                        <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex min-h-[44px] items-center justify-center rounded-full bg-brand-green px-5 text-center font-semibold text-white"
                        >
                            Pedir por WhatsApp
                        </a>
                    </div>
                )}
            </header>

            <main>{children}</main>
        </div>
    );
}
