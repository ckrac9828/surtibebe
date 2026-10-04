import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import logo from '../../images/logo.png';
import { BoxIcon, CartIcon, ChevronRightIcon, HomeIcon, LogoutIcon, MenuIcon, UserIcon } from '../Components/AdminIcons';

const navLinks = [
    { href: '/admin/dashboard', label: 'Panel', icon: HomeIcon },
    { href: '/admin/productos', label: 'Productos', icon: BoxIcon },
    { href: '/admin/pedidos', label: 'Pedidos', icon: CartIcon },
    { href: '/admin/cuenta', label: 'Gestionar cuenta', icon: UserIcon },
];

export default function AdminLayout({ children }) {
    const { url } = usePage();
    const [menuOpen, setMenuOpen] = useState(false);

    function isActive(href) {
        return url === href || url.startsWith(`${href}/`);
    }

    return (
        <div className="min-h-screen bg-gray-50 md:flex">
            {/* Sidebar — fija en desktop, colapsable en móvil. md:sticky +
                md:h-screen hace que ocupe exactamente el alto de la pantalla
                y se quede ahí al hacer scroll del contenido: antes se
                estiraba hasta el alto del contenido de la página (que suele
                ser más largo que la pantalla), empujando "Cerrar sesión"
                (que usa mt-auto para ir al fondo) muy por debajo de lo
                visible. */}
            <aside className="bg-brand-navy text-white md:sticky md:top-0 md:flex md:h-screen md:w-64 md:flex-none md:flex-col">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-6 md:justify-center">
                    <Link href="/admin/dashboard">
                        <img src={logo} alt="Surtibebé" className="h-24 w-auto md:h-28" />
                    </Link>
                    <button
                        className="flex h-11 w-11 flex-none items-center justify-center md:hidden"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-label="Abrir menú"
                    >
                        <MenuIcon className="h-6 w-6" />
                    </button>
                </div>

                <nav className={`${menuOpen ? 'flex' : 'hidden'} flex-col gap-1 px-3 pb-4 md:flex md:flex-1 md:overflow-y-auto`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex min-h-[44px] items-center gap-3 rounded-xl px-3 font-medium transition-colors ${
                                isActive(link.href)
                                    ? 'bg-brand-skyDeep text-white shadow-sm'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <link.icon className="h-5 w-5 flex-none" />
                            <span className="flex-1">{link.label}</span>
                            <ChevronRightIcon className={`h-4 w-4 flex-none ${isActive(link.href) ? 'opacity-80' : 'opacity-30'}`} />
                        </Link>
                    ))}

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="mt-auto flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-left font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                        <LogoutIcon className="h-5 w-5 flex-none" />
                        Cerrar sesión
                    </Link>
                </nav>
            </aside>

            <main className="flex-1 p-6 sm:p-8">{children}</main>
        </div>
    );
}
