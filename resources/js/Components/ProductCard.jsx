import { Link } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { useCart } from '../Context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import ColorPicker from './ColorPicker';
import CategoryBadge from './CategoryBadge';

export default function ProductCard({ product }) {
    const { addItem } = useCart();
    const image = product.images?.[0]?.path;
    const colors = product.colors ?? [];
    const [selectedColor, setSelectedColor] = useState(null);
    const [justAdded, setJustAdded] = useState(false);
    const addedTimeout = useRef(null);
    const selectedColorObj = colors.find((c) => c.name === selectedColor);

    // Si el producto no maneja colores, se puede agregar directo. Si sí
    // maneja, hay que elegir uno antes de habilitar el botón — y ese color
    // debe tener stock suficiente para al menos la compra mínima.
    const canAdd = colors.length === 0
        ? product.total_stock >= product.min_purchase
        : selectedColor !== null && (selectedColorObj?.stock ?? 0) >= product.min_purchase;

    function handleAdd() {
        if (!canAdd) return;
        addItem(product, product.min_purchase, selectedColor);
        // Feedback visual temporal: el botón pasa a verde con un check
        // por 1.5s — sin esto el cliente no notaba que el producto se
        // había añadido y pensaba que el botón no hacía nada.
        setJustAdded(true);
        clearTimeout(addedTimeout.current);
        addedTimeout.current = setTimeout(() => setJustAdded(false), 1500);
    }

    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md">
            <Link href={`/productos/${product.slug}`} className="relative flex flex-1 flex-col">
                {product.is_new && (
                    <span className="absolute left-2 top-2 z-10 rounded-full bg-brand-green px-2.5 py-1 text-xs font-semibold text-white">
                        Nuevo
                    </span>
                )}
                <div className="flex aspect-square items-center justify-center bg-brand-soft text-6xl">
                    {image ? (
                        <img
                            src={`/storage/${image}`}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        '🧸'
                    )}
                </div>
                <div className="flex flex-1 flex-col gap-1 p-4">
                    {product.category && <CategoryBadge slug={product.category.slug} name={product.category.name} />}
                    <h3 className="font-semibold text-brand-navy">{product.name}</h3>
                    <p className="text-lg font-bold text-brand-navy">{formatPrice(product.price)}</p>
                    <p className="text-xs text-gray-500">Mínimo {product.min_purchase} unidades</p>
                </div>
            </Link>
            <div className="flex flex-col gap-2 p-4 pt-0">
                {colors.length > 0 && (
                    <ColorPicker
                        colors={colors}
                        selected={selectedColor}
                        onSelect={setSelectedColor}
                        size="sm"
                    />
                )}
                {/* Apilados (cada uno a todo el ancho) en tarjetas angostas —
                    dos botones lado a lado en una tarjeta de 2 columnas en
                    móvil quedaban tan apretados que el texto se envolvía y
                    el rounded-full los deformaba en círculos. Lado a lado
                    solo desde lg: (1024px), donde ya hay ancho de sobra. */}
                <div className="flex flex-col gap-2 lg:flex-row">
                    <Link
                        href={`/productos/${product.slug}`}
                        className="flex min-h-[44px] items-center justify-center rounded-full border-2 border-brand-blue px-2 text-center text-sm font-semibold text-brand-blue hover:bg-brand-soft lg:flex-1"
                    >
                        Ver detalle
                    </Link>
                    <button
                        onClick={handleAdd}
                        disabled={!canAdd}
                        className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-full px-2 text-center text-sm font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 lg:flex-[1.4] ${
                            justAdded
                                ? 'scale-105 bg-brand-green'
                                : 'bg-brand-skyDeep hover:opacity-90'
                        }`}
                    >
                        {justAdded ? (
                            <>
                                <span>✓</span> ¡Agregado!
                            </>
                        ) : (
                            'Agregar al carrito'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
