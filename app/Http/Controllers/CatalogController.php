<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function home()
    {
        // Cuenta productos activos por categoría — para mostrar "X productos"
        // real bajo cada categoría en vez de un número inventado.
        $categories = Category::withCount(['products' => fn ($q) => $q->where('status', 'active')])->get();

        return Inertia::render('Home', [
            'categories' => $categories,
            'featuredProducts' => Product::with(['category', 'images', 'colors'])
                ->where('status', 'active')
                ->latest()
                ->take(8)
                ->get(),
            'stats' => [
                'products' => Product::where('status', 'active')->count(),
                'categories' => $categories->count(),
            ],
        ]);
    }

    public function index(Request $request)
    {
        $categories = Category::all();
        $search = $request->query('buscar');
        $categoria = $request->query('categoria');
        $orden = $request->query('orden', 'recientes');

        $products = Product::with(['category', 'images', 'colors'])
            ->where('status', 'active')
            ->when($categoria, function ($query, $slug) {
                $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
            })
            ->when($search, function ($query, $term) {
                $query->where('name', 'like', "%{$term}%");
            })
            ->when($orden === 'precio_asc', fn ($query) => $query->orderBy('price'))
            ->when($orden === 'precio_desc', fn ($query) => $query->orderByDesc('price'))
            ->when($orden === 'nombre', fn ($query) => $query->orderBy('name'))
            ->when($orden === 'recientes', fn ($query) => $query->orderByDesc('created_at'))
            ->paginate(12)
            ->withQueryString();

        // La sección de "nuevos" solo tiene sentido en la vista general del
        // catálogo — si el cliente ya está filtrando por categoría o
        // buscando algo puntual, no tiene caso mostrarla encima.
        $newProducts = (! $categoria && ! $search)
            ? Product::with(['category', 'images', 'colors'])
                ->where('status', 'active')
                ->where('created_at', '>=', now()->subDays(Product::NEW_PRODUCT_DAYS))
                ->orderByDesc('created_at')
                ->get()
            : collect();

        return Inertia::render('Catalog/Index', [
            'categories' => $categories,
            'products' => $products,
            'newProducts' => $newProducts,
            'selectedCategory' => $categoria,
            'search' => $search,
            'sort' => $orden,
        ]);
    }

    public function show(Product $product)
    {
        $product->load(['category', 'images', 'colors']);

        return Inertia::render('Catalog/Show', [
            'product' => $product,
        ]);
    }
}