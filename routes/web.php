<?php

use App\Http\Controllers\PosController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductSearchController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SalespersonReportController;
use App\Http\Controllers\DayCloseController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page - Main POS Interface
Route::get('/', [PosController::class, 'index'])->name('home');

// POS Routes
Route::post('/pos', [PosController::class, 'store'])->name('pos.store');

// Product search
Route::get('/product-search', [ProductSearchController::class, 'index'])->name('product-search.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Product management routes
    Route::resource('products', ProductController::class);

    // Report routes
    Route::resource('reports', ReportController::class)->only(['index']);
    Route::resource('salesperson-reports', SalespersonReportController::class)->only(['index']);
    Route::resource('day-close', DayCloseController::class)->only(['store', 'show']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
