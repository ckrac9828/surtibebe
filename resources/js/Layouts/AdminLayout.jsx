import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import logo from '../../images/logo.png';

const navLinks = [
    { href: '/admin/dashboard', label: 'Panel', icon: '🏠' },
    { href: '/admin/productos', label: 'Productos', icon: '📦' },
    { href: '/admin/pedidos', label: 'Pedidos', icon: '🛒' },
];

export default function AdminLayout({ children }) {
    const { url } = usePage();
    const [menuOpen, setMenuOpen] = useState(false);

    function isActive(href) {
        return url === href || url.startsWith(`${href}/`);
    }

    return (
        <div className="min-h-screen bg-gray-50 md:flex">
            {/* Sidebar — fija en desktop, colapsable en móvil */}
            <aside className="bg-brand-navy text-white md:flex md:w-64 md:flex-none md:flex-col">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-6 md:justify-center">
                    <Link href="/admin/dashboard">
                        <img src={logo} alt="Surtibebé" className="h-24 w-auto md:h-28" />
                    </Link>
                    <button
                        className="flex h-11 w-11 flex-none items-center justify-center text-2xl md:hidden"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-label="Abrir menú"
                    >
                        ☰
                    </button>
                </div>

                <nav className={`${menuOpen ? 'flex' : 'hidden'} flex-col gap-1 px-3 pb-4 md:flex md:flex-1`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex min-h-[44px] items-center gap-3 rounded-lg px-3 font-medium ${
                                isActive(link.href)
                                    ? 'bg-white/10 text-white'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <span>{link.icon}</span>
                            {link.label}
                        </Link>
                    ))}

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="mt-auto flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-left font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                        <span>🚪</span>
                        Cerrar sesión
                    </Link>
                </nav>
            </aside>

            <main className="flex-1 p-6 sm:p-8">{children}</main>
        </div>
    );
}
