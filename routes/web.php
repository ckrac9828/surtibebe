<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [CatalogController::class, 'home'])->name('home');
Route::get('/catalogo', [CatalogController::class, 'index'])->name('catalog');
Route::get('/productos/{product:slug}', [CatalogController::class, 'show'])->name('product.show');
Route::get('/carrito', fn () => Inertia::render('Cart'))->name('cart');
Route::get('/contacto', fn () => Inertia::render('Contact'))->name('contact');
Route::get('/checkout', fn () => Inertia::render('Checkout'))->name('checkout');
Route::post('/pedidos', [OrderController::class, 'store'])->name('orders.store');
Route::get('/pedido-confirmado', [OrderController::class, 'confirmed'])->name('orders.confirmed');

Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    // El nombre de la ruta se deja como 'dashboard' (sin prefijo "admin.")
    // a propósito: así el redirect que ya trae Breeze después de
    // login/registro (route('dashboard')) sigue funcionando sin tocar
    // esos controladores — solo cambia a dónde apunta la URL.
    Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');

    Route::resource('productos', Admin\ProductController::class)->except(['show']);
    Route::patch('/productos/{producto}/estado', [Admin\ProductController::class, 'toggleStatus'])->name('productos.toggle-status');
    Route::delete('/productos/{producto}/imagenes/{imagen}', [Admin\ProductController::class, 'destroyImage'])->name('productos.images.destroy');

    Route::get('/pedidos', [Admin\OrderController::class, 'index'])->name('pedidos.index');
    Route::get('/pedidos/{pedido}', [Admin\OrderController::class, 'show'])->name('pedidos.show');
    Route::patch('/pedidos/{pedido}/estado', [Admin\OrderController::class, 'updateStatus'])->name('pedidos.update-status');
    Route::get('/pedidos/{pedido}/pdf', [Admin\OrderPdfController::class, 'download'])->name('pedidos.pdf');
    Route::post('/pedidos/{pedido}/items', [Admin\OrderItemController::class, 'store'])->name('pedidos.items.store');
    Route::patch('/pedidos/{pedido}/items/{item}', [Admin\OrderItemController::class, 'update'])->name('pedidos.items.update');
    Route::delete('/pedidos/{pedido}/items/{item}', [Admin\OrderItemController::class, 'destroy'])->name('pedidos.items.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';