<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        $user = User::factory()->create([
            'name' => 'POS Admin',
            'email' => 'admin@pos.com',
        ]);

        // Create additional users
        User::factory(3)->create();

        // Create categories
        $categories = [
            ['name' => 'Electronics', 'color' => '#3b82f6'],
            ['name' => 'Food & Beverages', 'color' => '#10b981'],
            ['name' => 'Clothing', 'color' => '#f59e0b'],
            ['name' => 'Health & Beauty', 'color' => '#ec4899'],
            ['name' => 'Books & Stationery', 'color' => '#8b5cf6'],
        ];

        foreach ($categories as $categoryData) {
            Category::create($categoryData);
        }

        // Create products for each category
        $products = [
            // Electronics
            ['name' => 'Wireless Mouse', 'price' => 25.99, 'category_id' => 1, 'barcode' => '1234567890001'],
            ['name' => 'USB-C Cable', 'price' => 12.50, 'category_id' => 1, 'barcode' => '1234567890002'],
            ['name' => 'Bluetooth Headphones', 'price' => 89.99, 'category_id' => 1, 'barcode' => '1234567890003'],
            
            // Food & Beverages
            ['name' => 'Coffee Beans (1kg)', 'price' => 18.99, 'category_id' => 2, 'barcode' => '2345678900001'],
            ['name' => 'Energy Drink', 'price' => 2.50, 'category_id' => 2, 'barcode' => '2345678900002'],
            ['name' => 'Chocolate Bar', 'price' => 3.75, 'category_id' => 2, 'barcode' => '2345678900003'],
            
            // Clothing
            ['name' => 'Cotton T-Shirt', 'price' => 19.99, 'category_id' => 3, 'barcode' => '3456789000001'],
            ['name' => 'Denim Jeans', 'price' => 59.99, 'category_id' => 3, 'barcode' => '3456789000002'],
            
            // Health & Beauty
            ['name' => 'Face Moisturizer', 'price' => 24.99, 'category_id' => 4, 'barcode' => '4567890000001'],
            ['name' => 'Hand Sanitizer', 'price' => 4.99, 'category_id' => 4, 'barcode' => '4567890000002'],
            
            // Books & Stationery
            ['name' => 'Notebook (A4)', 'price' => 7.50, 'category_id' => 5, 'barcode' => '5678900000001'],
            ['name' => 'Blue Pen (Pack of 5)', 'price' => 9.99, 'category_id' => 5, 'barcode' => '5678900000002'],
        ];

        foreach ($products as $productData) {
            Product::create([
                ...$productData,
                'description' => 'High quality ' . strtolower($productData['name']),
                'stock_quantity' => random_int(20, 100),
                'min_stock_level' => 10,
                'is_active' => true,
            ]);
        }

        // Create some sample sales
        $products = Product::all();
        $users = User::all();

        for ($i = 0; $i < 20; $i++) {
            $user = $users->random();
            $selectedProducts = $products->random(random_int(1, 4));
            
            $subtotal = 0;
            $saleItems = [];

            foreach ($selectedProducts as $product) {
                $quantity = random_int(1, 3);
                $totalPrice = $product->price * $quantity;
                $subtotal += $totalPrice;

                $saleItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'unit_price' => $product->price,
                    'quantity' => $quantity,
                    'total_price' => $totalPrice,
                ];
            }

            $taxAmount = $subtotal * 0.10;
            $totalAmount = $subtotal + $taxAmount;

            $sale = Sale::create([
                'receipt_number' => 'RC-' . now()->format('Ymd') . '-' . str_pad((string)($i + 1), 4, '0', STR_PAD_LEFT),
                'user_id' => $user->id,
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'payment_method' => collect(['cash', 'card', 'qr_code'])->random(),
                'amount_paid' => $totalAmount + random_int(0, 20),
                'change_amount' => random_int(0, 20),
                'status' => 'completed',
                'created_at' => now()->subDays(random_int(0, 30)),
            ]);

            foreach ($saleItems as $itemData) {
                SaleItem::create([
                    'sale_id' => $sale->id,
                    ...$itemData,
                ]);
            }
        }
    }
}
