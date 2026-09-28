<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    // Cuántos días se considera "nuevo" un producto desde su creación —
    // pasado ese tiempo, is_new pasa a false solo (nada que actualizar).
    const NEW_PRODUCT_DAYS = 14;

    protected $fillable = [
        'category_id', 'name', 'slug', 'description',
        'price', 'stock', 'min_purchase', 'status',
    ];

    protected $appends = ['is_new', 'total_stock'];

    public function getIsNewAttribute(): bool
    {
        return $this->created_at?->gt(now()->subDays(self::NEW_PRODUCT_DAYS)) ?? false;
    }

    // Cuando el producto maneja colores, el stock "real" es la suma del
    // stock de cada color — la columna `stock` del producto deja de usarse
    // en ese caso (queda en 0, ver ProductController::validateProduct).
    public function getTotalStockAttribute(): int
    {
        return $this->colors->isNotEmpty() ? (int) $this->colors->sum('stock') : $this->stock;
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function colors()
    {
        return $this->hasMany(ProductColor::class)->orderBy('sort_order');
    }
}