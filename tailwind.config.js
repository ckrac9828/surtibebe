import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
    extend: {
        fontFamily: {
            sans: ['Figtree', ...defaultTheme.fontFamily.sans],
        },
        colors: {
            brand: {
                navy: '#16324F',
                blue: '#2D6FA3',
                orange: '#F2793A',
                green: '#25C16F',
                amber: '#F5A623',
                red: '#E5484D',
                soft: '#EAF3FB',
                // Colores extraídos directamente del logo (Logo sin fondo.png)
                // con un sampler de píxeles, para que las piezas grandes de
                // diseño (como el hero de Inicio) usen el mismo azul vívido
                // y el mismo rosa del semicírculo/texto del logo, en vez del
                // azul apagado de "blue" (pensado para texto/bordes, no para
                // fondos grandes).
                sky: '#2BB6FE',
                skyDeep: '#009CF7',
                pink: '#FC3B8F',
            },
        },
        keyframes: {
            'cart-pop': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.35)' },
            },
        },
        animation: {
            'cart-pop': 'cart-pop 0.4s ease-in-out',
        },
    },
},
   
};
