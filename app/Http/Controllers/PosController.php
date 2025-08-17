<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSaleRequest;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PosController extends Controller
{
    /**
     * Display the POS interface.
     */
    public function index()
    {
        $products = Product::with('category')
            ->active()
            ->orderBy('name')
            ->get();

        $categories = Category::withCount('products')
            ->orderBy('name')
            ->get();

        return Inertia::render('pos', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    /**
     * Process a sale transaction.
     */
    public function store(StoreSaleRequest $request)
    {
        try {
            DB::beginTransaction();

            $items = $request->validated()['items'];
            $paymentMethod = $request->validated()['payment_method'];
            $amountPaid = $request->validated()['amount_paid'];
            $customerEmail = $request->validated()['customer_email'] ?? null;
            $notes = $request->validated()['notes'] ?? null;

            // Calculate totals
            $subtotal = 0;
            $saleItems = [];

            foreach ($items as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                // Check stock availability
                if ($product->stock_quantity < $item['quantity']) {
                    throw new \Exception("Insufficient stock for {$product->name}");
                }

                $totalPrice = $product->price * $item['quantity'];
                $subtotal += $totalPrice;

                $saleItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'unit_price' => $product->price,
                    'quantity' => $item['quantity'],
                    'total_price' => $totalPrice,
                ];
            }

            // Calculate tax and total (assuming 10% tax rate)
            $taxAmount = $subtotal * 0.10;
            $totalAmount = $subtotal + $taxAmount;

            // Check if amount paid is sufficient
            if ($amountPaid < $totalAmount) {
                throw new \Exception("Insufficient payment amount");
            }

            $changeAmount = $amountPaid - $totalAmount;

            // Create sale record
            $receiptNumber = 'RC-' . now()->format('Ymd') . '-' . str_pad(
                (string)(Sale::whereDate('created_at', today())->count() + 1),
                4,
                '0',
                STR_PAD_LEFT
            );

            $sale = Sale::create([
                'receipt_number' => $receiptNumber,
                'user_id' => Auth::id(),
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'payment_method' => $paymentMethod,
                'amount_paid' => $amountPaid,
                'change_amount' => $changeAmount,
                'customer_email' => $customerEmail,
                'notes' => $notes,
                'status' => 'completed',
            ]);

            // Create sale items and update inventory
            foreach ($saleItems as $itemData) {
                SaleItem::create([
                    'sale_id' => $sale->id,
                    ...$itemData,
                ]);

                // Update product stock
                Product::where('id', $itemData['product_id'])
                    ->decrement('stock_quantity', $itemData['quantity']);
            }

            DB::commit();

            return Inertia::render('pos-receipt', [
                'sale' => $sale->load(['saleItems.product', 'user']),
                'success' => 'Sale completed successfully!',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }


}