<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DailyClosure;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DayCloseController extends Controller
{
    /**
     * Store a new day closure.
     */
    public function store()
    {
        $today = now()->toDateString();
        
        // Check if day is already closed
        $existingClosure = DailyClosure::whereDate('closure_date', $today)->first();
        
        if ($existingClosure) {
            return back()->withErrors(['error' => 'Day has already been closed.']);
        }

        // Get today's sales data
        $todaySales = Sale::where('status', 'completed')
            ->whereDate('created_at', now()->toDateString())
            ->get();
        
        if ($todaySales->isEmpty()) {
            return back()->withErrors(['error' => 'No sales to close for today.']);
        }

        // Calculate totals by payment method
        $cashSales = $todaySales->where('payment_method', 'cash')->sum('total_amount');
        $cardSales = $todaySales->where('payment_method', 'card')->sum('total_amount');
        $qrCodeSales = $todaySales->where('payment_method', 'qr_code')->sum('total_amount');
        $totalSales = $todaySales->sum('total_amount');

        // Sales by user
        $salesByUser = $todaySales->groupBy('user_id')->map(function ($sales) {
            return [
                'user_name' => $sales->first()->user->name,
                'transaction_count' => $sales->count(),
                'total_sales' => $sales->sum('total_amount'),
            ];
        })->toArray();

        // Top products
        $topProducts = SaleItem::whereIn('sale_id', $todaySales->pluck('id'))
            ->selectRaw('product_name, SUM(quantity) as total_sold, SUM(total_price) as revenue')
            ->groupBy('product_name')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get()
            ->toArray();

        // Create closure record
        $closure = DailyClosure::create([
            'closure_date' => $today,
            'closed_by' => Auth::id(),
            'total_sales' => $totalSales,
            'cash_sales' => $cashSales,
            'card_sales' => $cardSales,
            'qr_code_sales' => $qrCodeSales,
            'transaction_count' => $todaySales->count(),
            'sales_by_user' => $salesByUser,
            'top_products' => $topProducts,
        ]);

        return redirect()->route('day-close.show', ['day_close' => $closure->id])
            ->with('success', 'Day closed successfully.');
    }

    /**
     * Display the specified day closure report.
     */
    public function show(DailyClosure $dayClose)
    {
        $dayClose->load('closedBy');

        return Inertia::render('reports/closure', [
            'closure' => $dayClose,
        ]);
    }
}