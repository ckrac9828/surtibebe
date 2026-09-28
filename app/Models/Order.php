<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number', 'company_name', 'nit', 'address',
        'phone', 'observations', 'subtotal', 'total', 'status',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}