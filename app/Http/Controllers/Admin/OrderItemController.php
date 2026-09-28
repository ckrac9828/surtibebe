<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class OrderItemController extends Controller
{
    // Igual que el descuento de stock (Admin\OrderController): solo se
    // puede tocar la lista de productos de un pedido antes de que su stock
    // ya se haya descontado de verdad, para no tener que deshacer/rehacer
    // ese descuento al editar.
    private const EDITABLE_STATUSES = ['pending', 'processing'];

    public function store(Request $request, Order $pedido)
    {
        $this->ensureEditable($pedido);

        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'color' => ['nullable', 'string', 'max:100'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $pedido->items()->create(
            $this->resolveLine($validated['product_id'], $validated['color'] ?? null, $validated['quantity'])
        );

        $this->recalculateTotals($pedido);

        return back()->with('success', 'Producto agregado al pedido.');
    }

    public function update(Request $request, Order $pedido, OrderItem $item)
    {
        $this->ensureEditable($pedido);
        $this->ensureBelongsToOrder($pedido, $item);

        $validated = $request->validate([
            'color' => ['nullable', 'string', 'max:100'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        // El producto de la línea no se cambia al editar — para eso se
        // elimina esta línea y se agrega una nueva con el producto correcto.
        if (! $item->product_id) {
            throw ValidationException::withMessages([
                'color' => 'El producto original de esta línea ya no existe, no se puede editar — elimínala y agrega el producto correcto.',
            ]);
        }

        $item->update(
            $this->resolveLine($item->product_id, $validated['color'] ?? null, $validated['quantity'])
        );

        $this->recalculateTotals($pedido);

        return back()->with('success', 'Línea del pedido actualizada.');
    }

    public function destroy(Order $pedido, OrderItem $item)
    {
        $this->ensureEditable($pedido);
        $this->ensureBelongsToOrder($pedido, $item);

        if ($pedido->items()->count() <= 1) {
            throw ValidationException::withMessages([
                'item' => 'No puedes quitar el último producto del pedido — si ya no aplica, cancela el pedido completo.',
            ]);
        }

        $item->delete();

        $this->recalculateTotals($pedido);

        return back()->with('success', 'Producto quitado del pedido.');
    }

    private function ensureEditable(Order $order): void
    {
        if (! in_array($order->status, self::EDITABLE_STATUSES, true)) {
            throw ValidationException::withMessages([
                'status' => 'Este pedido ya no se puede editar porque su stock ya fue descontado.',
            ]);
        }
    }

    private function ensureBelongsToOrder(Order $order, OrderItem $item): void
    {
        abort_if($item->order_id !== $order->id, 404);
    }

    // Misma validación que el checkout público (OrderController@store):
    // el color debe existir para ese producto y la cantidad debe respetar
    // la compra mínima y el stock disponible de ese color (o del producto,
    // si no maneja colores).
    private function resolveLine(int $productId, ?string $colorName, int $quantity): array
    {
        $product = Product::with('colors')->findOrFail($productId);

        $color = null;
        $availableStock = $product->stock;

        if ($product->colors->isNotEmpty()) {
            $productColor = $colorName ? $product->colors->firstWhere('name', $colorName) : null;

            if (! $productColor) {
                throw ValidationException::withMessages([
                    'color' => "Selecciona un color válido para \"{$product->name}\".",
                ]);
            }

            $color = $productColor->name;
            $availableStock = $productColor->stock;
        }

        if ($quantity < $product->min_purchase || $quantity > $availableStock) {
            throw ValidationException::withMessages([
                'quantity' => "Cantidad no válida para \"{$product->name}\" (mínimo {$product->min_purchase}, disponible {$availableStock}).",
            ]);
        }

        return [
            'product_id' => $product->id,
            'product_name' => $product->name,
            'color' => $color,
            'price' => $product->price,
            'quantity' => $quantity,
            'subtotal' => $product->price * $quantity,
        ];
    }

    private function recalculateTotals(Order $order): void
    {
        $subtotal = $order->items()->sum('subtotal');
        $order->update(['subtotal' => $subtotal, 'total' => $subtotal]);
    }
}
