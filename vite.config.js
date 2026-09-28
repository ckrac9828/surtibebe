import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        // Se fuerza IPv4 explícito — en este equipo, Vite escuchando solo en
        // el loopback IPv6 ([::1]) queda "arriba" (el puerto aparece
        // escuchando) pero las peticiones nunca responden, probablemente por
        // el antivirus/EDR corporativo interceptando ese tráfico. 127.0.0.1
        // no ha dado ese problema.
        host: '127.0.0.1',
        hmr: {
            host: '127.0.0.1',
        },
    },
});
