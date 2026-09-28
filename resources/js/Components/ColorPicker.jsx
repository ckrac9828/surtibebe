// Selector de color reutilizable: un círculo por color disponible, pintado
// con su hex_value. Además del color se muestra el nombre (no todo el mundo
// distingue bien los colores, y el nombre es lo que de verdad queda guardado
// en el pedido).
export default function ColorPicker({ colors, selected, onSelect, size = 'md' }) {
    const dimension = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8';

    return (
        <div>
            <div className="flex flex-wrap items-center gap-2">
                {colors.map((color) => {
                    const isSelected = selected === color.name;
                    const outOfStock = color.stock === 0;
                    return (
                        <button
                            key={color.id ?? color.name}
                            type="button"
                            disabled={outOfStock}
                            onClick={(e) => {
                                e.preventDefault();
                                onSelect(color.name);
                            }}
                            title={outOfStock ? `${color.name} (agotado)` : color.name}
                            aria-label={color.name}
                            aria-pressed={isSelected}
                            className={`${dimension} rounded-full border-2 ${
                                isSelected ? 'border-brand-navy' : 'border-gray-200'
                            } ${outOfStock ? 'cursor-not-allowed opacity-30' : ''}`}
                            style={{ backgroundColor: color.hex_value || '#e5e7eb' }}
                        />
                    );
                })}
            </div>
            <p className="mt-1 text-xs text-gray-500">
                {selected ? `Color: ${selected}` : 'Elige un color'}
            </p>
        </div>
    );
}
