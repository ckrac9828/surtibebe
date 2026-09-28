// Iconos de línea propios (SVG) para cada categoría, en vez de emojis —
// los emojis se ven distinto en cada sistema operativo/navegador y no
// transmiten la misma calidad visual que un set de iconos consistente.
// Reutiliza los mismos colores por categoría que CategoryBadge.jsx.
const CATEGORY_STYLES = {
    todos: { bg: 'bg-brand-soft', fg: 'text-brand-blue' },
    juguetes: { bg: 'bg-blue-100', fg: 'text-blue-600' },
    bebes: { bg: 'bg-pink-100', fg: 'text-pink-600' },
    accesorios: { bg: 'bg-purple-100', fg: 'text-purple-600' },
    didacticos: { bg: 'bg-amber-100', fg: 'text-amber-600' },
    otros: { bg: 'bg-gray-100', fg: 'text-gray-600' },
};

function ToysIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="3" y="13" width="7" height="7" rx="1" />
            <rect x="14" y="13" width="7" height="7" rx="1" />
            <rect x="8.5" y="4" width="7" height="7" rx="1" />
        </svg>
    );
}

function BabyIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="9" y="9" width="6" height="12" rx="2" />
            <rect x="10" y="5" width="4" height="4" rx="1" />
            <path d="M10.3 3.5h3.4" />
            <path d="M9 13.5h6M9 16.5h6" />
        </svg>
    );
}

function BagIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="4" y="8" width="16" height="12" rx="2" />
            <path d="M8 8V6a4 4 0 0 1 8 0v2" />
            <path d="M4 12.5h16" />
        </svg>
    );
}

function BookIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 6.5c-1.7-1.5-3.8-2.3-6.5-2.3v13c2.7 0 4.8.8 6.5 2.3" />
            <path d="M12 6.5c1.7-1.5 3.8-2.3 6.5-2.3v13c-2.7 0-4.8.8-6.5 2.3" />
            <path d="M12 6.5v13" />
        </svg>
    );
}

function BoxIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 3 3.5 7.5 12 12l8.5-4.5L12 3Z" />
            <path d="M3.5 7.5V16l8.5 4.5 8.5-4.5V7.5" />
            <path d="M12 12v8.5" />
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

const ICONS = {
    todos: GridIcon,
    juguetes: ToysIcon,
    bebes: BabyIcon,
    accesorios: BagIcon,
    didacticos: BookIcon,
    otros: BoxIcon,
};

export default function CategoryIcon({ slug, size = 'md', className = '' }) {
    const Icon = ICONS[slug] ?? ICONS.otros;
    const style = CATEGORY_STYLES[slug] ?? CATEGORY_STYLES.otros;
    const dimensions = size === 'sm' ? 'h-9 w-9 p-2' : 'h-16 w-16 p-4';

    return (
        <span className={`inline-flex flex-none items-center justify-center rounded-full ${style.bg} ${style.fg} ${dimensions} ${className}`}>
            <Icon className="h-full w-full" />
        </span>
    );
}
