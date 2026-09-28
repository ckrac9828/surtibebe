<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Notifications\NewOrderNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'nit' => ['required', 'string', 'max:50'],
            'address' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'observations' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.color' => ['nullable', 'string', 'max:100'],
        ]);

        $order = DB::transaction(function () use ($validated) {
            $subtotal = 0;
            $lines = [];

            foreach ($validated['items'] as $item) {
                $product = Product::with('colors')->findOrFail($item['product_id']);

                // Si el producto tiene colores configurados, el pedido debe
                // traer uno de esos colores exactos — igual que la cantidad,
                // no confiamos en lo que ya validó React en el navegador.
                // El stock disponible también pasa a ser el de ESE color
                // (cada color tiene su propio stock), no el del producto.
                $color = $item['color'] ?? null;
                $availableStock = $product->stock;

                if ($product->colors->isNotEmpty()) {
                    $productColor = $color ? $product->colors->firstWhere('name', $color) : null;

                    if (! $productColor) {
                        throw ValidationException::withMessages([
                            'items' => "Selecciona un color válido para \"{$product->name}\".",
                        ]);
                    }

                    $color = $productColor->name;
                    $availableStock = $productColor->stock;
                } else {
                    $color = null;
                }

                if ($item['quantity'] < $product->min_purchase || $item['quantity'] > $availableStock) {
                    throw ValidationException::withMessages([
                        'items' => "La cantidad de \"{$product->name}\" no es válida (mínimo {$product->min_purchase}, disponible {$availableStock}).",
                    ]);
                }

                $lineSubtotal = $product->price * $item['quantity'];
                $subtotal += $lineSubtotal;

                $lines[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'color' => $color,
                    'price' => $product->price,
                    'quantity' => $item['quantity'],
                    'subtotal' => $lineSubtotal,
                ];
            }

            $order = Order::create([
                'order_number' => 'TEMP',
                'company_name' => $validated['company_name'],
                'nit' => $validated['nit'],
                'address' => $validated['address'],
                'phone' => $validated['phone'],
                'observations' => $validated['observations'] ?? null,
                'subtotal' => $subtotal,
                'total' => $subtotal,
                'status' => 'pending',
            ]);

            // El consecutivo se arma DESPUÉS de crear el pedido, a partir de su
            // propio id autoincremental — así nunca se repite, ni aunque lleguen
            // dos pedidos al mismo tiempo (a diferencia de calcular "el último + 1"
            // antes de guardar, que sí puede chocar bajo concurrencia).
            $order->update([
                'order_number' => '#'.str_pad($order->id, 5, '0', STR_PAD_LEFT),
            ]);

            $order->items()->createMany($lines);

            return $order;
        });

        // Se busca por el correo configurado en ADMIN_EMAIL; si por algún
        // motivo no existe todavía un usuario con ese correo, se cae al
        // primero de la tabla para no perder la notificación en silencio.
        // Cuando el proyecto tenga varios admins, aquí se filtraría por rol.
        $admin = User::where('email', config('app.admin_email'))->first() ?? User::first();

        if ($admin) {
            $admin->notify(new NewOrderNotification($order));
        }

        return redirect()->route('orders.confirmed')->with('order', [
            'order_number' => $order->order_number,
            'total' => $order->total,
        ]);
    }

    public function confirmed()
    {
        if (! session()->has('order')) {
            return redirect()->route('catalog');
        }

        return Inertia::render('OrderConfirmed', [
            'order' => session('order'),
        ]);
    }
}
