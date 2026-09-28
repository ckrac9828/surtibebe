<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with(['category', 'images', 'colors'])
            ->when($request->query('buscar'), fn ($q, $term) => $q->where('name', 'like', "%{$term}%"))
            ->when($request->query('categoria'), fn ($q, $slug) => $q->whereHas('category', fn ($c) => $c->where('slug', $slug)))
            ->when($request->query('estado'), fn ($q, $status) => $q->where('status', $status))
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => Category::all(),
            'filters' => $request->only(['buscar', 'categoria', 'estado']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Form', [
            'categories' => Category::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateProduct($request);

        $product = Product::create([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'slug' => $this->uniqueSlug($validated['name']),
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'stock' => $this->productLevelStock($validated),
            'min_purchase' => $validated['min_purchase'],
            'status' => $validated['status'],
        ]);

        $this->syncColors($product, $validated['colors'] ?? []);
        $this->storeImages($product, $request->file('images', []));

        return redirect()->route('productos.index')->with('success', 'Producto creado.');
    }

    public function edit(Product $producto)
    {
        $producto->load(['images', 'colors']);

        return Inertia::render('Admin/Products/Form', [
            'categories' => Category::all(),
            'product' => $producto,
        ]);
    }

    public function update(Request $request, Product $producto)
    {
        $validated = $this->validateProduct($request);

        // El slug no se regenera al editar — cambiar el nombre no debe
        // romper la URL pública del producto que ya pudo estar compartida.
        $producto->update([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'stock' => $this->productLevelStock($validated),
            'min_purchase' => $validated['min_purchase'],
            'status' => $validated['status'],
        ]);

        $this->syncColors($producto, $validated['colors'] ?? []);
        $this->storeImages($producto, $request->file('images', []));

        return redirect()->route('productos.index')->with('success', 'Producto actualizado.');
    }

    public function destroy(Product $producto)
    {
        foreach ($producto->images as $image) {
            Storage::disk('public')->delete($image->path);
        }

        // Los pedidos que ya incluían este producto no se rompen: order_items
        // guarda su propia copia congelada de nombre/precio/color, y su
        // product_id se pone en null solo (nullOnDelete en la migración).
        $producto->delete();

        return redirect()->route('productos.index')->with('success', 'Producto eliminado.');
    }

    public function toggleStatus(Product $producto)
    {
        $producto->update([
            'status' => $producto->status === 'active' ? 'inactive' : 'active',
        ]);

        return back()->with('success', $producto->status === 'active' ? 'Producto activado.' : 'Producto desactivado.');
    }

    public function destroyImage(Product $producto, ProductImage $imagen)
    {
        Storage::disk('public')->delete($imagen->path);
        $imagen->delete();

        return back()->with('success', 'Imagen eliminada.');
    }

    private function validateProduct(Request $request): array
    {
        return $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'integer', 'min:0'],
            // Solo es obligatorio cuando el producto NO maneja colores —
            // si maneja colores, el stock se captura por color más abajo
            // y este campo del formulario queda oculto/ignorado.
            'stock' => ['nullable', 'integer', 'min:0'],
            'min_purchase' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'in:active,inactive'],
            'images' => ['array'],
            // 'image' por sí solo no reconoce .avif (formato moderno, más
            // liviano, que exportan varias herramientas/IA hoy en día) —
            // se agrega explícito a la lista de formatos aceptados. No hay
            // procesamiento de la imagen al guardarla (ver storeImages), así
            // que cualquier formato que el navegador sepa mostrar funciona.
            // Límite en 15MB (PHP ya permite hasta 40MB, ver php.ini) para
            // dejar espacio de sobra a GIFs animados, que pesan bastante más
            // que una foto normal.
            'images.*' => ['mimes:jpg,jpeg,png,gif,bmp,webp,avif', 'max:15360'],
            'colors' => ['array'],
            'colors.*.name' => ['required', 'string', 'max:50'],
            'colors.*.hex' => ['nullable', 'string', 'max:7'],
            'colors.*.stock' => ['required', 'integer', 'min:0'],
        ]);
    }

    // El stock del producto solo tiene sentido cuando no maneja colores —
    // cuando sí maneja, queda en 0 y el stock real vive en cada color
    // (Product::getTotalStockAttribute lo suma para mostrarlo en listados).
    private function productLevelStock(array $validated): int
    {
        if (! empty($validated['colors'])) {
            return 0;
        }

        return $validated['stock'] ?? 0;
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 1;

        while (Product::where('slug', $slug)->exists()) {
            $slug = "{$base}-".++$i;
        }

        return $slug;
    }

    private function syncColors(Product $product, array $colors): void
    {
        $product->colors()->delete();

        foreach ($colors as $sortOrder => $color) {
            $product->colors()->create([
                'name' => $color['name'],
                'hex_value' => $color['hex'] ?? null,
                'stock' => $color['stock'] ?? 0,
                'sort_order' => $sortOrder,
            ]);
        }
    }

    private function storeImages(Product $product, array $files): void
    {
        $nextOrder = $product->images()->max('sort_order') + 1;

        foreach ($files as $file) {
            $product->images()->create([
                'path' => $file->store('products', 'public'),
                'sort_order' => $nextOrder++,
            ]);
        }
    }
}
