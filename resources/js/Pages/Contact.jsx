import { Head } from '@inertiajs/react';
import PublicLayout, { WHATSAPP_NUMBER } from '../Layouts/PublicLayout';

const ADMIN_EMAIL = 'surtibebecol@gmail.com';

// Iconos de línea propios (SVG), en vez de emojis — mismo criterio que
// CategoryIcon.jsx: más nítidos, consistentes entre navegadores/sistemas,
// y con el mismo tratamiento visual de "círculo de color + trazo".
function ChatIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H9l-4 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8Z" />
            <path d="M8 8.5h8M8 11.5h5" />
        </svg>
    );
}

function EnvelopeIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
            <path d="M4 7l8 6 8-6" />
        </svg>
    );
}

function HeadsetIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
            <rect x="3" y="13" width="4" height="6" rx="1.5" />
            <rect x="17" y="13" width="4" height="6" rx="1.5" />
            <path d="M19 19v1a3 3 0 0 1-3 3h-3" />
        </svg>
    );
}

export default function Contact() {
    return (
        <PublicLayout>
            <Head title="Contacto" />

            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
                <h1 className="text-center text-3xl font-bold text-brand-navy">
                    Contacto
                </h1>
                <p className="mx-auto mt-2 max-w-md text-center text-gray-600">
                    Escoge la forma más rápida de comunicarte con nosotros.
                </p>

                <div className="mt-10 grid gap-6 sm:grid-cols-2">
                    <div className="flex flex-col items-center rounded-2xl bg-green-50 p-8 text-center">
                        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-brand-green">
                            <ChatIcon className="h-8 w-8" />
                        </span>
                        <h2 className="mt-4 text-xl font-bold text-brand-navy">
                            Haz tu pedido por WhatsApp
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Escríbenos y uno de nuestros asesores te ayudará con tu compra.
                        </p>
                        <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 w-full rounded-full bg-brand-green py-3 font-semibold text-white hover:opacity-90"
                        >
                            Contactar por WhatsApp
                        </a>
                    </div>

                    <div className="flex flex-col items-center rounded-2xl bg-brand-soft p-8 text-center">
                        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-brand-navy">
                            <EnvelopeIcon className="h-8 w-8" />
                        </span>
                        <h2 className="mt-4 text-xl font-bold text-brand-navy">
                            Escribir al administrador
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            ¿Tienes alguna duda o necesitas más información?
                        </p>
                        <a
                            href={`mailto:${ADMIN_EMAIL}`}
                            className="mt-6 w-full rounded-full bg-brand-navy py-3 font-semibold text-white hover:opacity-90"
                        >
                            Enviar mensaje
                        </a>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-4 rounded-2xl bg-brand-navy px-6 py-6 text-white sm:px-10">
                    <span className="inline-flex h-14 w-14 flex-none items-center justify-center rounded-full bg-white/10 text-white">
                        <HeadsetIcon className="h-7 w-7" />
                    </span>
                    <div>
                        <p className="text-lg font-bold">¡Estamos para ayudarte!</p>
                        <p className="text-sm text-gray-200">Tu pedido, en las mejores manos.</p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
