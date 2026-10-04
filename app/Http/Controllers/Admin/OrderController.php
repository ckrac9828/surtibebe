<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductColor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class OrderController extends Controller
{
    // Estados en los que el stock de los productos ya quedó descontado.
    // Se usa tanto para decidir si hay que descontar (al entrar) como
    // si hay que devolver (al salir, por ejemplo al cancelar).
    private const STOCK_DEDUCTED_STATUSES = ['shipped', 'completed'];

    public function index(Request $request)
    {
        $orders = Order::query()
            ->when($request->query('estado'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->query('fecha'), fn ($q, $date) => $q->whereDate('created_at', $date))
            // Busca por nombre de la empresa/cliente, por número de pedido
            // (#00123 o solo 123) o por el id interno, para que el admin
            // pueda encontrar un pedido sin importar cuál de los tres tenga
            // a mano.
            ->when($request->query('buscar'), function ($q, $search) {
                $q->where(function ($q2) use ($search) {
                    $q2->where('company_name', 'like', "%{$search}%")
                        ->orWhere('order_number', 'like', "%{$search}%");

                    $numeric = ltrim($search, '#');
                    if (is_numeric($numeric)) {
                        $q2->orWhere('id', (int) $numeric);
                    }
                });
            })
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['estado', 'fecha', 'buscar']),
        ]);
    }

    public function show(Order $pedido)
    {
        $pedido->load('items.product.colors');

        return Inertia::render('Admin/Orders/Show', [
            'order' => $pedido,
            // Para el selector de "agregar producto" al pedido — solo
            // mientras el pedido siga editable (ver OrderItemController).
            'products' => Product::with('colors')
                ->where('status', 'active')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function updateStatus(Request $request, Order $pedido)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'processing', 'shipped', 'completed', 'cancelled'])],
        ]);

        $wasDeducted = in_array($pedido->status, self::STOCK_DEDUCTED_STATUSES, true);
        $willBeDeducted = in_array($validated['status'], self::STOCK_DEDUCTED_STATUSES, true);

        if (! $wasDeducted && $willBeDeducted) {
            $this->ensureStockAvailable($pedido);
        }

        DB::transaction(function () use ($pedido, $validated, $wasDeducted, $willBeDeducted) {
            if (! $wasDeducted && $willBeDeducted) {
                $this->adjustStock($pedido, -1);
            } elseif ($wasDeducted && ! $willBeDeducted) {
                // Por ejemplo, un pedido "enviado" que se cancela: el stock
                // que ya se había descontado se devuelve automáticamente.
                $this->adjustStock($pedido, 1);
            }

            $pedido->update(['status' => $validated['status']]);
        });

        return back()->with('success', 'Estado del pedido actualizado.');
    }

    // Antes de descontar stock de verdad, se revisa que cada línea tenga
    // suficiente — así el admin ve exactamente qué producto/color falta,
    // en vez de un error crudo de base de datos (las columnas de stock son
    // sin signo y no aceptan quedar en negativo).
    private function ensureStockAvailable(Order $order): void
    {
        $shortages = [];

        foreach ($order->items as $item) {
            if ($item->product_id === null) {
                continue;
            }

            if ($item->color) {
                $productColor = ProductColor::where('product_id', $item->product_id)
                    ->where('name', $item->color)
                    ->first();

                $available = $productColor?->stock ?? 0;
                $label = "{$item->product_name} ({$item->color})";
            } else {
                $available = $item->product?->stock ?? 0;
                $label = $item->product_name;
            }

            if ($item->quantity > $available) {
                $shortages[] = "{$label}: disponible {$available}, necesitas {$item->quantity}.";
            }
        }

        if (! empty($shortages)) {
            // Inertia solo manda al frontend el PRIMER mensaje de cada campo
            // de error (ver inertiajs/inertia-laravel Middleware::$withAllErrors,
            // false por defecto) — así que las varias líneas faltantes van
            // como un solo mensaje separado por saltos de línea, y el
            // frontend los separa de nuevo para listarlos en el modal.
            throw ValidationException::withMessages(['stock' => implode("\n", $shortages)]);
        }
    }

    private function adjustStock(Order $order, int $direction): void
    {
        foreach ($order->items as $item) {
            // Si el producto ya fue eliminado, product_id quedó en null
            // (nullOnDelete) — no hay nada que ajustar.
            if ($item->product_id === null) {
                continue;
            }

            if ($item->color) {
                // El color se guardó congelado como texto en el pedido —
                // si ya no existe (se renombró/borró editando el producto),
                // no hay a qué color descontarle stock, se omite igual que
                // arriba con el producto eliminado.
                $productColor = ProductColor::where('product_id', $item->product_id)
                    ->where('name', $item->color)
                    ->first();

                $productColor?->increment('stock', $direction * $item->quantity);

                continue;
            }

            $item->product()->increment('stock', $direction * $item->quantity);
        }
    }
}
