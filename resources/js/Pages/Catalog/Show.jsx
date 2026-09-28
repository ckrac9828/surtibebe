import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import PublicLayout, { WHATSAPP_NUMBER } from '../../Layouts/PublicLayout';
import ColorPicker from '../../Components/ColorPicker';
import CategoryBadge from '../../Components/CategoryBadge';
import { useCart } from '../../Context/CartContext';
import { formatPrice } from '../../utils/formatPrice';

export default function Show({ product }) {
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(product.min_purchase);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(null);

    const images = product.images ?? [];
    const hasImages = images.length > 0;
    const colors = product.colors ?? [];
    // Con colores, el stock disponible es el de ESE color, no el general
    // del producto — cada color se controla por separado.
    const selectedColorObj = colors.find((c) => c.name === selectedColor);
    const availableStock = colors.length > 0 ? (selectedColorObj?.stock ?? 0) : product.stock;
    const canAdd = (colors.length === 0 || selectedColor !== null) && availableStock >= product.min_purchase;

    // Si el cliente cambia de color, la cantidad ya elegida puede quedar
    // por encima de lo que hay de ese color nuevo — se ajusta para abajo.
    useEffect(() => {
        if (colors.length === 0) return;
        setQuantity((q) => Math.min(q, Math.max(availableStock, product.min_purchase)));
    }, [selectedColor]);

    const quoteMessage = encodeURIComponent(
        `Hola, quiero cotizar una cantidad mayor de "${product.name}".`
    );

    function decrease() {
        setQuantity((q) => Math.max(product.min_purchase, q - 1));
    }

    function increase() {
        setQuantity((q) => Math.min(availableStock, q + 1));
    }

    function handleAdd() {
        if (!canAdd) return;
        addItem(product, quantity, selectedColor);
    }

    return (
        <PublicLayout>
            <Head title={product.name} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <Link href="/" className="hover:text-brand-blue">🏠</Link>
                    <span>/</span>
                    <Link href="/catalogo" className="hover:text-brand-blue">Catálogo</Link>
                    <span>/</span>
                    <Link href={`/catalogo?categoria=${product.category.slug}`} className="hover:text-brand-blue">
                        {product.category.name}
                    </Link>
                    <span>/</span>
                    <span className="font-medium text-brand-navy">{product.name}</span>
                </nav>

                <div className="grid gap-10 md:grid-cols-2">
                    <div>
                        <div className="flex aspect-square items-center justify-center rounded-2xl bg-brand-soft text-8xl">
                            {hasImages ? (
                                <img
                                    src={`/storage/${images[activeImage].path}`}
                                    alt={product.name}
                                    className="h-full w-full rounded-2xl object-cover"
                                />
                            ) : (
                                '🧸'
                            )}
                        </div>

                        {hasImages && images.length > 1 && (
                            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                                {images.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setActiveImage(index)}
                                        className={`h-20 w-20 flex-none overflow-hidden rounded-xl border-2 ${
                                            index === activeImage ? 'border-brand-blue' : 'border-transparent'
                                        }`}
                                    >
                                        <img
                                            src={`/storage/${image.path}`}
                                            alt={`${product.name} ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <CategoryBadge slug={product.category.slug} name={product.category.name} />
                        <h1 className="mt-2 text-3xl font-bold text-brand-navy">{product.name}</h1>

                        {product.description && (
                            <p className="mt-3 text-gray-600">{product.description}</p>
                        )}

                        <p className="mt-5 text-3xl font-bold text-brand-orange">{formatPrice(product.price)}</p>
                        <p className="text-sm text-gray-500">Precio por unidad</p>

                        <dl className="mt-4 space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <span>📦</span>
                                <span>
                                    {colors.length > 0 && !selectedColor
                                        ? 'Elige un color para ver el stock disponible'
                                        : `Stock disponible: ${availableStock} unidades`}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>🔢</span>
                                <span>Compra mínima: {product.min_purchase} unidades</span>
                            </div>
                        </dl>

                        {colors.length > 0 && (
                            <div className="mt-6">
                                <p className="mb-2 text-sm font-medium text-gray-700">Color</p>
                                <ColorPicker colors={colors} selected={selectedColor} onSelect={setSelectedColor} />
                            </div>
                        )}

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="flex w-fit items-center gap-1 rounded-full border border-gray-300 px-1">
                                <button
                                    onClick={decrease}
                                    disabled={quantity <= product.min_purchase}
                                    className="flex h-11 w-11 flex-none items-center justify-center text-xl font-bold text-brand-navy disabled:opacity-30"
                                >
                                    −
                                </button>
                                <span className="w-8 text-center font-semibold">{quantity}</span>
                                <button
                                    onClick={increase}
                                    disabled={quantity >= availableStock}
                                    className="flex h-11 w-11 flex-none items-center justify-center text-xl font-bold text-brand-navy disabled:opacity-30"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={handleAdd}
                                disabled={!canAdd}
                                className="min-h-[44px] flex-1 rounded-full bg-brand-orange py-3 font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                🛒 Agregar al carrito
                            </button>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-3 border-t border-gray-200 pt-6 sm:grid-cols-4">
                            <FeatureTile icon="🚚" text="Envíos a todo el país" />
                            <FeatureTile icon="🛡️" text="Productos de alta calidad" />
                            <FeatureTile icon="📦" text="Compra mínima por mayor" />
                            <FeatureTile icon="🎧" text="Soporte personalizado" />
                        </div>

                        <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl bg-brand-soft p-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🤝</span>
                                <div>
                                    <p className="font-semibold text-brand-navy">¿Necesitas una mayor cantidad?</p>
                                    <p className="text-sm text-gray-600">
                                        Contáctanos para obtener mejores precios y condiciones especiales.
                                    </p>
                                </div>
                            </div>
                            <a
                                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${quoteMessage}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex min-h-[44px] flex-none items-center justify-center whitespace-nowrap rounded-full border-2 border-brand-blue px-5 text-center font-semibold text-brand-blue hover:bg-white"
                            >
                                Solicitar cotización
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

function FeatureTile({ icon, text }) {
    return (
        <div className="flex flex-col items-center gap-1 rounded-xl border border-gray-200 px-2 py-3 text-center">
            <span className="text-xl">{icon}</span>
            <span className="text-xs font-medium text-gray-600">{text}</span>
        </div>
    );
}
