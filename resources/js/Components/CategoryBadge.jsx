// Un color de acento distinto por categoría, para que las tarjetas del
// catálogo se distingan de un vistazo — igual que en el mockup de
// referencia. "otros" y cualquier categoría nueva caen en el gris por
// defecto, así que agregar una categoría no rompe nada.
const CATEGORY_COLORS = {
    juguetes: 'bg-blue-100 text-blue-700',
    bebes: 'bg-pink-100 text-pink-700',
    accesorios: 'bg-purple-100 text-purple-700',
    didacticos: 'bg-amber-100 text-amber-700',
    otros: 'bg-gray-100 text-gray-700',
};

export default function CategoryBadge({ slug, name }) {
    return (
        <span
            className={`inline-block w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                CATEGORY_COLORS[slug] ?? 'bg-gray-100 text-gray-700'
            }`}
        >
            {name}
        </span>
    );
}
