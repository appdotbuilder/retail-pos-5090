<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display sales summary report.
     */
    public function index(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', now()->toDateString());

        // Daily sales data for chart
        $dailySales = Sale::where('status', 'completed')
            ->whereBetween(DB::raw('DATE(created_at)'), [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, SUM(total_amount) as total, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Payment method breakdown
        $paymentMethods = Sale::where('status', 'completed')
            ->whereBetween(DB::raw('DATE(created_at)'), [$startDate, $endDate])
            ->selectRaw('payment_method, SUM(total_amount) as total, COUNT(*) as count')
            ->groupBy('payment_method')
            ->get();

        // Top selling products
        $topProducts = SaleItem::whereHas('sale', function ($query) use ($startDate, $endDate) {
                $query->where('status', 'completed')
                      ->whereBetween(DB::raw('DATE(created_at)'), [$startDate, $endDate]);
            })
            ->with('product.category')
            ->selectRaw('product_id, product_name, SUM(quantity) as total_sold, SUM(total_price) as revenue')
            ->groupBy('product_id', 'product_name')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get();

        // Summary totals
        $totalSales = Sale::where('status', 'completed')
            ->whereBetween(DB::raw('DATE(created_at)'), [$startDate, $endDate])
            ->sum('total_amount');

        $totalTransactions = Sale::where('status', 'completed')
            ->whereBetween(DB::raw('DATE(created_at)'), [$startDate, $endDate])
            ->count();

        $averageTransactionValue = $totalTransactions > 0 ? $totalSales / $totalTransactions : 0;

        return Inertia::render('reports/index', [
            'dailySales' => $dailySales,
            'paymentMethods' => $paymentMethods,
            'topProducts' => $topProducts,
            'summary' => [
                'totalSales' => $totalSales,
                'totalTransactions' => $totalTransactions,
                'averageTransactionValue' => $averageTransactionValue,
            ],
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}