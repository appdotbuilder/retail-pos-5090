<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductSearchController extends Controller
{
    /**
     * Display a listing of products matching search criteria.
     */
    public function index(Request $request)
    {
        $query = $request->get('q', '');
        
        if (empty($query)) {
            return response()->json([]);
        }

        $products = Product::with('category')
            ->active()
            ->where(function ($q) use ($query) {
                $q->where('barcode', 'like', "%{$query}%")
                  ->orWhere('name', 'like', "%{$query}%");
            })
            ->limit(10)
            ->get();

        return response()->json($products);
    }
}