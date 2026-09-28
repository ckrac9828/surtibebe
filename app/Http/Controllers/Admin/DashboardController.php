<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'products' => Product::count(),
                'ordersTotal' => Order::count(),
                'ordersCompleted' => Order::where('status', 'completed')->count(),
                'ordersPending' => Order::where('status', 'pending')->count(),
            ],
            'recentOrders' => Order::latest()
                ->take(5)
                ->get(['id', 'order_number', 'company_name', 'total', 'status', 'created_at']),
        ]);
    }
}
