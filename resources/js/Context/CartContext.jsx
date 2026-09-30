import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'surtibebe_cart';

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setItems(JSON.parse(saved));
        } catch (e) {
            // localStorage puede fallar (modo privado, etc.) — el carrito
            // simplemente arranca vacío, no rompemos la página por esto.
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (e) {}
    }, [items]);

    // Dos líneas del mismo producto con colores distintos son renglones
    // distintos del carrito (p. ej. 6 Peluche Oso Café + 6 Peluche Oso Rosado),
    // así que identificamos cada línea por la combinación id + color, no solo
    // por id.
    function addItem(product, quantity, color = null) {
        setItems((current) => {
            const existing = current.find((i) => i.id === product.id && i.color === color);
            if (existing) {
                return current.map((i) =>
                    i === existing ? { ...i, quantity: i.quantity + quantity } : i
                );
            }
            return [
                ...current,
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    minPurchase: product.min_purchase,
                    image: product.images?.[0]?.path ?? null,
                    color,
                    quantity,
                },
            ];
        });
    }

    function updateQuantity(productId, color, quantity) {
        setItems((current) =>
            current.map((i) =>
                i.id === productId && i.color === color ? { ...i, quantity } : i
            )
        );
    }

    function removeItem(productId, color) {
        setItems((current) =>
            current.filter((i) => !(i.id === productId && i.color === color))
        );
    }

    function clearCart() {
        setItems([]);
    }

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

    return (
        <CartContext.Provider
            value={{ items, addItem, updateQuantity, removeItem, clearCart, totalItems, totalPrice }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de un <CartProvider>');
    }
    return context;
}
