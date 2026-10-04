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
        $now = now();

        $completedRevenueThisMonth = (float) Order::where('status', 'completed')
            ->whereYear('created_at', $now->year)
            ->whereMonth('created_at', $now->month)
            ->sum('total');

        $lastMonth = $now->copy()->subMonthNoOverflow();
        $completedRevenueLastMonth = (float) Order::where('status', 'completed')
            ->whereYear('created_at', $lastMonth->year)
            ->whereMonth('created_at', $lastMonth->month)
            ->sum('total');

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'products' => Product::count(),
                'newProductsThisWeek' => Product::where('created_at', '>=', $now->copy()->subDays(7))->count(),
                'ordersTotal' => Order::count(),
                'ordersProcessing' => Order::where('status', 'processing')->count(),
                'ordersCompleted' => Order::where('status', 'completed')->count(),
                'completedThisWeek' => Order::where('status', 'completed')
                    ->where('created_at', '>=', $now->copy()->subDays(7))
                    ->count(),
                'ordersPending' => Order::where('status', 'pending')->count(),
                // Suma automática de los pedidos completados del mes en curso —
                // se basa en created_at porque es la única fecha que se guarda
                // del pedido; si en el futuro se registra una fecha de
                // completado aparte, este filtro debería usar esa en su lugar.
                'completedRevenueThisMonth' => $completedRevenueThisMonth,
                // Variación porcentual vs. el mes anterior. Si el mes anterior
                // no tuvo ingresos (o no hay datos), no se calcula un % —
                // dividir por cero daría un número sin sentido.
                'revenueChangePercent' => $completedRevenueLastMonth > 0
                    ? round((($completedRevenueThisMonth - $completedRevenueLastMonth) / $completedRevenueLastMonth) * 100)
                    : null,
            ],
            'currentMonthLabel' => ucfirst($now->translatedFormat('F \d\e Y')),
            'weeklySales' => $this->weeklySales($now),
            'recentOrders' => Order::latest()
                ->take(5)
                ->get(['id', 'order_number', 'company_name', 'total', 'status', 'created_at']),
        ]);
    }

    // Total vendido (cualquier pedido que no se haya cancelado) por cada día
    // de la semana en curso (lunes a domingo), para la gráfica de barras.
    // Los días que todavía no han llegado quedan en 0 — es el estado real,
    // no un error.
    private function weeklySales($now): array
    {
        $labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        $startOfWeek = $now->copy()->startOfWeek();

        $totals = [];
        for ($i = 0; $i < 7; $i++) {
            $day = $startOfWeek->copy()->addDays($i);

            $totals[] = [
                'label' => $labels[$i],
                'total' => (float) Order::where('status', '!=', 'cancelled')
                    ->whereDate('created_at', $day->toDateString())
                    ->sum('total'),
                'isToday' => $day->isToday(),
            ];
        }

        return $totals;
    }
}
