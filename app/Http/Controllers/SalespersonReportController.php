<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SalespersonReportController extends Controller
{
    /**
     * Display sales by salesperson report.
     */
    public function index(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', now()->toDateString());

        $salesByUser = Sale::with('user')
            ->where('status', 'completed')
            ->whereBetween(DB::raw('DATE(created_at)'), [$startDate, $endDate])
            ->selectRaw('user_id, COUNT(*) as transaction_count, SUM(total_amount) as total_sales, AVG(total_amount) as avg_transaction')
            ->groupBy('user_id')
            ->orderByDesc('total_sales')
            ->get();

        return Inertia::render('reports/salesperson', [
            'salesByUser' => $salesByUser,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}