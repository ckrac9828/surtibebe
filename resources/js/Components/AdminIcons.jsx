// Iconos de línea propios (SVG) para los botones del panel de administración,
// en vez de emojis — mismo criterio que CategoryIcon.jsx/Contact.jsx: se ven
// nítidos y consistentes entre navegadores/sistemas operativos (un emoji se
// renderiza distinto, y con sus propios colores fijos, según el SO), y
// heredan el color del texto/hover vía currentColor.

export function HomeIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M4 11.5 12 4l8 7.5" />
            <path d="M6 10v9a1 1 0 0 0 1 1h3v-5.5h4V20h3a1 1 0 0 0 1-1v-9" />
        </svg>
    );
}

export function BoxIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 3 3.5 7.5 12 12l8.5-4.5L12 3Z" />
            <path d="M3.5 7.5V16l8.5 4.5 8.5-4.5V7.5" />
            <path d="M12 12v8.5" />
        </svg>
    );
}

export function CartIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 8H6" />
            <circle cx="9.5" cy="20" r="1.3" />
            <circle cx="17" cy="20" r="1.3" />
        </svg>
    );
}

export function UserIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="8" r="3.5" />
            <path d="M4.5 20c1.2-3.6 4.2-5.5 7.5-5.5s6.3 1.9 7.5 5.5" />
        </svg>
    );
}

export function LogoutIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M9 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H9" />
            <path d="M15 16.5 20 12l-5-4.5" />
            <path d="M20 12H9" />
        </svg>
    );
}

export function MenuIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" />
        </svg>
    );
}

export function PencilIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M4 20h4.2L19.4 8.8a2 2 0 0 0 0-2.8l-1.4-1.4a2 2 0 0 0-2.8 0L4 15.8V20Z" />
            <path d="M13.5 6.5l4 4" />
        </svg>
    );
}

export function TrashIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M5 7h14" />
            <path d="M9.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v2" />
            <path d="M7 7l1 12.5A1.5 1.5 0 0 0 9.5 21h5a1.5 1.5 0 0 0 1.5-1.5L17 7" />
            <path d="M10.3 11v6M13.7 11v6" />
        </svg>
    );
}

export function MoneyIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="2.5" y="6" width="19" height="12" rx="2" />
            <circle cx="12" cy="12" r="3" />
            <path d="M6 9.5v0M18 14.5v0" />
        </svg>
    );
}

export function ChevronRightIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M9 5.5 15.5 12 9 18.5" />
        </svg>
    );
}

export function TrendUpIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M3.5 16 10 9.5l4 4 6.5-6.5" />
            <path d="M15 7h5.5v5.5" />
        </svg>
    );
}

export function TrendDownIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M3.5 8 10 14.5l4-4 6.5 6.5" />
            <path d="M15 17h5.5v-5.5" />
        </svg>
    );
}

export function ClipboardIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="5" y="4.5" width="14" height="16" rx="2" />
            <path d="M9 4.5V4a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 4v.5" />
            <path d="M8.5 10.5h7M8.5 14h7M8.5 17.5h4.5" />
        </svg>
    );
}

export function CheckCircleIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M8.5 12.3l2.3 2.3 4.7-5" />
        </svg>
    );
}

export function HourglassIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M6 3.5h12M6 20.5h12" />
            <path d="M7 3.5v3a5 5 0 0 0 2.2 4.15L12 12l2.8 1.85A5 5 0 0 1 17 18v2.5" />
            <path d="M17 3.5v3a5 5 0 0 1-2.2 4.15L12 12l-2.8 1.85A5 5 0 0 0 7 18v2.5" />
        </svg>
    );
}

export function SearchIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M20 20l-4.5-4.5" />
        </svg>
    );
}

export function CloseIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M5 5l14 14M19 5 5 19" />
        </svg>
    );
}
